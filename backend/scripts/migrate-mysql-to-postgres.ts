import 'reflect-metadata'
import * as path from 'path'
import * as fs from 'fs/promises'
import { createPool as createMySqlPool } from 'mysql2/promise'
import { Pool as PgPool } from 'pg'
import { DataSource } from 'typeorm'
import { User } from '../src/users/user.entity'
import { Product } from '../src/productos/product.entity'
import { Categoria } from '../src/categorias/categoria.entity'
import { Pedido } from '../src/pedidos/pedido.entity'
import { Cotizacion } from '../src/cotizaciones/cotizacion.entity'
import { Contacto } from '../src/contactos/contacto.entity'
import { Reporte } from '../src/reportes/reporte.entity'

async function loadEnv() {
  const envPath = path.join(process.cwd(), 'backend', '.env')
  try {
    await fs.access(envPath)
    const dotenv = await import('dotenv')
    dotenv.config({ path: envPath })
  } catch {}
}

function nowStamp() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

async function ensurePostgresDatabase(pgAdminPool: PgPool, dbName: string) {
  const res = await pgAdminPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])
  if (res.rowCount === 0) {
    await pgAdminPool.query(`CREATE DATABASE "${dbName}" WITH ENCODING 'UTF8' TEMPLATE template1`)
  }
}

async function createSchemaWithTypeORM(pgPool: PgPool, dbName: string) {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.PG_HOST ?? process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.PG_PORT ?? process.env.DB_PORT ?? 5432),
    username: process.env.PG_USER ?? process.env.DB_USER ?? 'postgres',
    password: process.env.PG_PASS ?? process.env.DB_PASS ?? '',
    database: dbName,
    entities: [User, Product, Categoria, Pedido, Cotizacion, Contacto, Reporte],
    synchronize: true,
  })
  await ds.initialize()
  await ds.destroy()
}

async function migrateTable(mysql: ReturnType<typeof createMySqlPool>, pg: PgPool, table: string, columns: string[]) {
  const [rows] = await mysql.query<any[]>(`SELECT ${columns.map((c) => `\`${c}\``).join(', ')} FROM \`${table}\``)
  if (!rows.length) return
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
  const insert = `INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${placeholders})`
  for (const r of rows) {
    const vals = columns.map((c) => r[c] ?? null)
    await pg.query(insert, vals)
  }
}

async function resetSequence(pg: PgPool, table: string, idCol = 'id') {
  const seqRes = await pg.query(`SELECT pg_get_serial_sequence($1, $2) AS seq`, [table, idCol])
  const seq = seqRes.rows[0]?.seq
  if (seq) {
    await pg.query(`SELECT setval($1, (SELECT COALESCE(MAX(${idCol}), 1) FROM "${table}"))`, [seq])
  }
}

async function migrateData(mysql: ReturnType<typeof createMySqlPool>, pg: PgPool) {
  await migrateTable(mysql, pg, 'users', [
    'id',
    'email',
    'passwordHash',
    'role',
    'fullName',
    'verified',
    'resetToken',
    'resetTokenExpires',
    'verificationToken',
    'createdAt',
    'updatedAt',
  ])
  await resetSequence(pg, 'users')

  await migrateTable(mysql, pg, 'products', [
    'id',
    'name',
    'description',
    'price',
    'category',
    'imageUrl',
    'thumbnailUrl',
    'stock',
    'createdAt',
    'updatedAt',
  ])
  await resetSequence(pg, 'products')

  await migrateTable(mysql, pg, 'categorias', ['id', 'name', 'description', 'imageUrl', 'createdAt'])
  await resetSequence(pg, 'categorias')

  await migrateTable(mysql, pg, 'orders', [
    'id',
    'orderNumber',
    'userId',
    'customerName',
    'customerDni',
    'customerEmail',
    'customerPhone',
    'items',
    'subtotal',
    'shipping',
    'total',
    'paymentMethod',
    'paymentStatus',
    'stripePaymentId',
    'orderStatus',
    'shippingAddress',
    'notes',
    'createdAt',
    'updatedAt',
    'status',
  ])
  await resetSequence(pg, 'orders')

  await migrateTable(mysql, pg, 'quotes', [
    'id',
    'customerName',
    'customerEmail',
    'customerPhone',
    'items',
    'status',
    'notes',
    'createdAt',
  ])
  await resetSequence(pg, 'quotes')

  await migrateTable(mysql, pg, 'contactos', [
    'id',
    'nombre',
    'email',
    'telefono',
    'mensaje',
    'productoId',
    'estado',
    'creadoEn',
  ])
  await resetSequence(pg, 'contactos')

  await migrateTable(mysql, pg, 'reportes', ['id', 'nombre', 'datos', 'creadoEn'])
  await resetSequence(pg, 'reportes')
}

async function verify(pg: PgPool) {
  const q = async (sql: string) => (await pg.query(sql)).rows[0]?.c ?? 0
  const tables = ['users', 'products', 'categorias', 'orders', 'quotes', 'contactos', 'reportes']
  const counts: Record<string, number> = {}
  for (const t of tables) {
    counts[t] = await q(`SELECT COUNT(*)::int AS c FROM "${t}"`)
  }
  return counts
}

async function main() {
  await loadEnv()
  const mysqlHost = process.env.MYSQL_HOST ?? process.env.DB_HOST ?? 'localhost'
  const mysqlPort = Number(process.env.MYSQL_PORT ?? process.env.DB_PORT ?? 3306)
  const mysqlUser = process.env.MYSQL_USER ?? process.env.DB_USER ?? 'root'
  const mysqlPass = process.env.MYSQL_PASS ?? process.env.DB_PASS ?? ''
  const mysqlDb = process.env.MYSQL_DB ?? process.env.DB_NAME ?? 'industriassp'

  const pgHost = process.env.PG_HOST ?? process.env.DB_HOST ?? 'localhost'
  const pgPort = Number(process.env.PG_PORT ?? process.env.DB_PORT ?? 5432)
  const pgUser = process.env.PG_USER ?? process.env.DB_USER ?? 'postgres'
  const pgPass = process.env.PG_PASS ?? process.env.DB_PASS ?? ''
  const pgDb = process.env.PG_NAME ?? process.env.DB_NAME ?? 'industriassp'

  const backupDir = path.join(process.cwd(), 'backend', 'backups', `mysql_full_${nowStamp()}`)
  await fs.mkdir(backupDir, { recursive: true })

  const mysql = createMySqlPool({ host: mysqlHost, port: mysqlPort, user: mysqlUser, password: mysqlPass, database: mysqlDb })
  const [tablesRows] = await mysql.query<any[]>('SHOW TABLES')
  const key = Object.keys(tablesRows[0] || {}).find((k) => k.toLowerCase().includes('tables_in_'))
  const tables = tablesRows.map((r) => r[key as string])
  for (const t of tables) {
    const [schemaRows] = await mysql.query<any[]>(`SHOW CREATE TABLE \`${t}\``)
    const createStmt = schemaRows[0]['Create Table'] as string
    await fs.writeFile(path.join(backupDir, `${t}.schema.sql`), createStmt + '\n')
    const [rows] = await mysql.query<any[]>(`SELECT * FROM \`${t}\``)
    await fs.writeFile(path.join(backupDir, `${t}.data.json`), JSON.stringify(rows, null, 2))
  }

  const pgAdminPool = new PgPool({ host: pgHost, port: pgPort, user: pgUser, password: pgPass ? pgPass : undefined, database: 'postgres' })
  await ensurePostgresDatabase(pgAdminPool, pgDb)
  await pgAdminPool.end()

  const pg = new PgPool({ host: pgHost, port: pgPort, user: pgUser, password: pgPass ? pgPass : undefined, database: pgDb })
  await createSchemaWithTypeORM(pg, pgDb)
  await migrateData(mysql, pg)
  const counts = await verify(pg)
  await pg.end()
  await mysql.end()

  console.log(JSON.stringify({ ok: true, backupDir, counts }))
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err?.message ?? String(err) }))
  process.exitCode = 1
})
