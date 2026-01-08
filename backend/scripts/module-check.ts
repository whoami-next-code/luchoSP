import 'reflect-metadata'
import path from 'path'

// #region agent log
fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
    sessionId:'debug-session',
    runId:'module-check',
    hypothesisId:'H1',
    location:'scripts/module-check.ts:top',
    message:'start',
    data:{cwd:process.cwd(),node:process.version},
    timestamp:Date.now()
  })
}).catch(()=>{})
// #endregion

async function main() {
  try {
    // Cargar dotenv desde backend/.env si existe
    const envPath = path.join(process.cwd(), 'backend', '.env')
    const dotenv = await import('dotenv')
    dotenv.config({ path: envPath })
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'module-check',
        hypothesisId:'H2',
        location:'scripts/module-check.ts:dotenv',
        message:'dotenv_loaded',
        data:{envPathExists:true,dbType:process.env.DB_TYPE,dbName:process.env.DB_NAME},
        timestamp:Date.now()
      })
    }).catch(()=>{})
    // #endregion

    const mysql = await import('mysql2/promise')
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'module-check',
        hypothesisId:'H3',
        location:'scripts/module-check.ts:mysql2',
        message:'mysql2_loaded',
        data:{keys:Object.keys(mysql)},
        timestamp:Date.now()
      })
    }).catch(()=>{})
    // #endregion

    const fs = await import('fs/promises')
    const testFile = path.join(process.cwd(), 'backend', '.env')
    let exists = false
    try { await fs.access(testFile); exists = true } catch {}
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'module-check',
        hypothesisId:'H4',
        location:'scripts/module-check.ts:fs',
        message:'fs_promises_ok',
        data:{envExists:exists},
        timestamp:Date.now()
      })
    }).catch(()=>{})
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'module-check',
        hypothesisId:'H5',
        location:'scripts/module-check.ts:done',
        message:'success',
        data:{processEnvKeys:Object.keys(process.env ?? {}).length},
        timestamp:Date.now()
      })
    }).catch(()=>{})
    // #endregion
    console.log('module-check ok')
  } catch (err) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/638fba18-ebc9-4dbf-9020-8d680af003ce',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'module-check',
        hypothesisId:'H6',
        location:'scripts/module-check.ts:error',
        message:'failure',
        data:{error:(err as Error)?.message ?? String(err)},
        timestamp:Date.now()
      })
    }).catch(()=>{})
    // #endregion
    console.error(err)
    process.exitCode = 1
  }
}

main()

