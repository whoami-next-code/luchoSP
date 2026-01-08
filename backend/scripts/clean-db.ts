import 'reflect-metadata'
import { createPool } from 'mysql2/promise'
import * as fs from 'fs/promises'
import * as path from 'path'
import { exec } from 'child_process'

async function ensureEnv() {
  const envPath = path.join(process.cwd(), 'backend', '.env')
  try {
    await fs.access(envPath)
    const dotenv = await import('dotenv')
    dotenv.config({ path: envPath })
  } catch {}
  const dbType = (process.env.DB_TYPE ?? 'mysql').toLowerCase()
  if (dbType !== 'mysql') throw new Error('DB_TYPE debe ser mysql')
  const dbName = process.env.DB_NAME ?? 'industriassp'
  if (dbName !== 'industriassp') throw new Error('DB_NAME inválido: solo industriasp')
}

function nowStamp() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

async function tryMySqlDump(outDir: string) {
  return new Promise<boolean>((resolve) => {
    const host = process.env.DB_HOST ?? 'localhost'
    const port = Number(process.env.DB_PORT ?? 3306)
    const user = process.env.DB_USER ?? 'root'
    const pass = process.env.DB_PASS ?? ''
    const db = process.env.DB_NAME ?? 'industriassp'
    const outFile = path.join(outDir, `mysqldump_${db}.sql`)
    const passArg = pass ? `--password=${pass}` : ''
    const cmd = `mysqldump -h ${host} -P ${port} -u ${user} ${passArg} ${db}`
    const child = exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, async (err, stdout) => {
      if (err) return resolve(false)
      try {
        await fs.writeFile(outFile, stdout)
        resolve(true)
      } catch {
        resolve(false)
      }
    })
    child.on('error', () => resolve(false))
  })
}

async function logicalBackup(pool: ReturnType<typeof createPool>, outDir: string) {
  await fs.mkdir(outDir, { recursive: true })
  const [tablesRows] = await pool.query<any[]>('SHOW TABLES')
  const key = Object.keys(tablesRows[0] || {}).find((k) => k.toLowerCase().includes('tables_in_'))
  const tables = tablesRows.map((r) => r[key as string])
  for (const t of tables) {
    const [schemaRows] = await pool.query<any[]>(`SHOW CREATE TABLE \`${t}\``)
    const createStmt = schemaRows[0]['Create Table'] as string
    await fs.writeFile(path.join(outDir, `${t}.schema.sql`), createStmt + '\n')
    const [rows] = await pool.query<any[]>(`SELECT * FROM \`${t}\``)
    await fs.writeFile(path.join(outDir, `${t}.data.json`), JSON.stringify(rows, null, 2))
  }
}

async function generateCleanupSQL(adminEmail: string, adminId: number) {
  const lines = [
    'SET FOREIGN_KEY_CHECKS=0;',
    `DELETE FROM \`orders\` WHERE \`userId\` IS NULL OR \`userId\` <> ${adminId};`,
    'DELETE FROM `quotes`;',
    'DELETE FROM `contactos`;',
    'DELETE FROM `reportes`;',
    'DELETE FROM `products`;',
    'DELETE FROM `categorias`;',
    `DELETE FROM \`users\` WHERE \`id\` <> ${adminId};`,
    'SET FOREIGN_KEY_CHECKS=1;',
  ]
  return lines.join('\n') + '\n'
}

async function verifyPostCleanup(pool: ReturnType<typeof createPool>, adminId: number) {
  const q = async (sql: string) => (await pool.query<any[]>(sql))[0]
  const users = await q('SELECT COUNT(*) AS c FROM `users`')
  const onlyAdmin = await q(`SELECT COUNT(*) AS c FROM \`users\` WHERE id=${adminId}`)
  const ordersOther = await q(`SELECT COUNT(*) AS c FROM \`orders\` WHERE \`userId\` IS NULL OR \`userId\` <> ${adminId}`)
  const quotes = await q('SELECT COUNT(*) AS c FROM `quotes`')
  const contactos = await q('SELECT COUNT(*) AS c FROM `contactos`')
  const reportes = await q('SELECT COUNT(*) AS c FROM `reportes`')
  const products = await q('SELECT COUNT(*) AS c FROM `products`')
  const categorias = await q('SELECT COUNT(*) AS c FROM `categorias`')
  return {
    usersTotal: users[0]?.c ?? 0,
    usersOnlyAdmin: onlyAdmin[0]?.c ?? 0,
    ordersNotAdmin: ordersOther[0]?.c ?? 0,
    quotesTotal: quotes[0]?.c ?? 0,
    contactosTotal: contactos[0]?.c ?? 0,
    reportesTotal: reportes[0]?.c ?? 0,
    productsTotal: products[0]?.c ?? 0,
    categoriasTotal: categorias[0]?.c ?? 0,
  }
}

async function main() {
  await ensureEnv()
  const host = process.env.DB_HOST ?? 'localhost'
  const port = Number(process.env.DB_PORT ?? 3306)
  const user = process.env.DB_USER ?? 'root'
  const pass = process.env.DB_PASS ?? ''
  const db = process.env.DB_NAME ?? 'industriassp'
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@industriasp.local'
  const outBase = path.join(process.cwd(), 'backend', 'backups', `industriasp_${nowStamp()}`)
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'pre-fix',
      hypothesisId:'H1',
      location:'scripts/clean-db.ts:main',
      message:'main_start',
      data:{cwd:process.cwd(),host,port,db},
      timestamp:Date.now()
    })
  }).catch(()=>{})
  // #endregion
  // Asegurar base de datos existente
  const serverPool = createPool({ host, port, user, password: pass })
  await serverPool.query(`CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await serverPool.end()

  const pool = createPool({ host, port, user, password: pass, database: db, multipleStatements: true })
  const [dbRow] = await pool.query<any[]>('SELECT DATABASE() AS db')
  const currentDb = dbRow[0]?.db
  if (currentDb !== 'industriassp') throw new Error('Conectado a una base de datos incorrecta')

  await fs.mkdir(outBase, { recursive: true })
  const dumped = await tryMySqlDump(outBase)
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'pre-fix',
      hypothesisId:'H2',
      location:'scripts/clean-db.ts:main',
      message:'mysqldump_result',
      data:{dumped,backupDir:outBase},
      timestamp:Date.now()
    })
  }).catch(()=>{})
  // #endregion
  if (!dumped) await logicalBackup(pool, outBase)

  const [adminRows] = await pool.query<any[]>('SELECT id FROM `users` WHERE `role` = ? AND `email` = ? LIMIT 1', ['ADMIN', adminEmail])
  const adminId = adminRows[0]?.id
  if (!adminId) throw new Error('Usuario administrador no encontrado')

  const cleanupSQL = await generateCleanupSQL(adminEmail, adminId)
  const outSql = path.join(outBase, `cleanup_industriasp_${nowStamp()}.sql`)
  await fs.writeFile(outSql, cleanupSQL)

  await pool.query('START TRANSACTION')
  await pool.query(cleanupSQL)
  await pool.query('COMMIT')

  const report = await verifyPostCleanup(pool, adminId)
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'pre-fix',
      hypothesisId:'H3',
      location:'scripts/clean-db.ts:main',
      message:'cleanup_report',
      data:{report,backupDir:outBase},
      timestamp:Date.now()
    })
  }).catch(()=>{})
  // #endregion
  console.log(JSON.stringify({ ok: true, report, backupDir: outBase }, null, 2))
  await pool.end()
}

main().catch(async (err) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'pre-fix',
      hypothesisId:'H4',
      location:'scripts/clean-db.ts:main',
      message:'main_error',
      data:{error:err?.message??String(err)},
      timestamp:Date.now()
    })
  }).catch(()=>{})
  // #endregion
  console.error(JSON.stringify({ ok: false, error: err?.message ?? String(err) }))
  process.exitCode = 1
})
