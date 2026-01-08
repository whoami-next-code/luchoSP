import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar .env
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🔌 Conectando a Supabase para sincronizar esquema (TypeORM)...');
console.log(`Host: ${process.env.DB_HOST}`);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  entities: [path.join(__dirname, '../src/**/*.entity.ts')],
  synchronize: true, // Esto crea las tablas automáticamente
});

AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Esquema sincronizado exitosamente (Tablas creadas).");
    await AppDataSource.destroy();
  })
  .catch((err) => {
    console.error("❌ Error inicializando Data Source:", err);
    process.exit(1);
  });