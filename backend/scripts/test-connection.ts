import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Cargar variables de entorno
dotenv.config({ path: join(process.cwd(), '.env') });

async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...\n');

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL no está configurada en .env');
    process.exit(1);
  }

  console.log('📋 Configuración detectada:');
  console.log(`   DATABASE_URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`); // Ocultar contraseña
  console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL || 'No configurada'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'No configurada'}\n`);

  try {
    // Parsear la URL
    let urlString = databaseUrl.replace(/^postgres:/, 'postgresql:');
    if (!urlString.startsWith('postgresql://')) {
      urlString = 'postgresql://' + urlString;
    }

    const url = new URL(urlString);
    const hostname = url.hostname;
    const port = Number(url.port) || 5432;
    const username = decodeURIComponent(url.username || 'postgres');
    const password = decodeURIComponent(url.password || '');
    const database = url.pathname.slice(1) || 'postgres';

    console.log('📊 Detalles de conexión:');
    console.log(`   Host: ${hostname}`);
    console.log(`   Puerto: ${port}`);
    console.log(`   Usuario: ${username}`);
    console.log(`   Base de datos: ${database}`);
    console.log(`   SSL: ${url.searchParams.get('sslmode') === 'require' ? 'Habilitado' : 'Deshabilitado'}\n`);

    // Crear DataSource para probar conexión
    const dataSource = new DataSource({
      type: 'postgres',
      host: hostname,
      port: port,
      username: username,
      password: password,
      database: database,
      ssl: url.searchParams.get('sslmode') === 'require' || 
           hostname.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : undefined,
    });

    console.log('🔄 Intentando conectar...');
    await dataSource.initialize();
    
    console.log('✅ ¡Conexión exitosa!');
    console.log('✅ La configuración es correcta\n');

    // Probar una consulta simple
    console.log('🔄 Probando consulta...');
    const result = await dataSource.query('SELECT version()');
    console.log('✅ Consulta exitosa');
    console.log(`   PostgreSQL version: ${result[0]?.version?.substring(0, 50)}...\n`);

    await dataSource.destroy();
    console.log('✅ Prueba completada exitosamente');
    process.exit(0);

  } catch (error: any) {
    console.error('❌ Error de conexión:');
    console.error(`   Mensaje: ${error.message}`);
    
    if (error.message.includes('password')) {
      console.error('\n💡 Solución: Verifica que la contraseña en DATABASE_URL sea correcta');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Solución: Verifica que el hostname sea correcto (debe ser db.xxxxx.supabase.co, no una IP)');
    } else if (error.message.includes('SSL')) {
      console.error('\n💡 Solución: Asegúrate de tener ?sslmode=require en la URL');
    }
    
    process.exit(1);
  }
}

testConnection();

