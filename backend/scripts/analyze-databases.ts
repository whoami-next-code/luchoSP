
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import axios from 'axios';

dotenv.config({ path: join(__dirname, '../.env') });

async function checkDatabases() {
  console.log('🔍 Iniciando análisis exhaustivo de bases de datos...\n');

  // 1. Verificar PostgreSQL Local
  console.log('--- 1. Base de Datos Local (PostgreSQL) ---');
  const dbConfig = {
    type: 'postgres' as const,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  };
  
  console.log(`Configuración: ${dbConfig.username}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

  const dataSource = new DataSource(dbConfig);
  try {
    await dataSource.initialize();
    console.log('✅ Conexión Local: EXITOSA');
    
    const res = await dataSource.query('SELECT count(*) FROM users');
    console.log(`📊 Usuarios locales registrados: ${res[0].count}`);
    
    await dataSource.destroy();
  } catch (err: any) {
    console.error('❌ Error Conexión Local:', err.message);
  }

  // 2. Verificar Supabase (Nube)
  console.log('\n--- 2. Base de Datos Nube (Supabase) ---');
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Error: Faltan credenciales de Supabase en .env');
  } else {
    console.log(`URL: ${supabaseUrl}`);
    try {
      const start = Date.now();
      const res = await axios.get(`${supabaseUrl}/auth/v1/health`, {
        headers: { apikey: serviceKey }
      });
      const ping = Date.now() - start;
      console.log(`✅ Conexión Supabase: EXITOSA (${ping}ms)`);
      console.log(`Estado: ${JSON.stringify(res.data)}`);

      // Verificar usuarios
      const usersRes = await axios.get(`${supabaseUrl}/auth/v1/admin/users`, {
        headers: { 
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`
        }
      });
      console.log(`📊 Usuarios en Supabase Auth: ${usersRes.data.users.length}`);

    } catch (err: any) {
      console.error('❌ Error Conexión Supabase:', err.message);
      if (err.response) {
        console.error('Detalle:', err.response.data);
      }
    }
  }

  console.log('\n--- Resumen de Integración ---');
  console.log('ℹ️  Estrategia "Hand-in-Hand" implementada:');
  console.log('   - Auth Guard ahora auto-crea usuarios locales si existen en Supabase.');
  console.log('   - Route handler sincroniza inmediatamente al verificar email.');
  console.log('   - Sistema resiliente a desincronizaciones manuales.');
}

checkDatabases();
