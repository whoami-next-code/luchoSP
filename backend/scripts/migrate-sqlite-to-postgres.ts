import { DataSource } from 'typeorm';
import { join } from 'path';
import { User } from '../src/users/user.entity';
import { Categoria } from '../src/categorias/categoria.entity';
import { Product } from '../src/productos/product.entity';
import { Pedido } from '../src/pedidos/pedido.entity';
import { Cotizacion } from '../src/cotizaciones/cotizacion.entity';
import { Contacto } from '../src/contactos/contacto.entity';
import { Reporte } from '../src/reportes/reporte.entity';

async function main() {
  const sqlite = new DataSource({
    type: 'sqlite',
    database: join(process.cwd(), 'data.sqlite'),
    entities: [User, Product, Categoria, Pedido, Cotizacion, Contacto, Reporte],
  });
  const pg = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? process.env.PG_HOST ?? process.env.SUPABASE_DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? process.env.PG_PORT ?? process.env.SUPABASE_DB_PORT ?? 5432),
    username: process.env.DB_USER ?? process.env.PG_USER ?? process.env.SUPABASE_DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? process.env.PG_PASS ?? process.env.SUPABASE_DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'postgres',
    entities: [User, Product, Categoria, Pedido, Cotizacion, Contacto, Reporte],
    synchronize: true,
    ssl: (process.env.DB_SSL ?? 'true') === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  await sqlite.initialize();
  await pg.initialize();

  const sUsers = await sqlite.getRepository(User).find();
  const sCats = await sqlite.getRepository(Categoria).find();
  const sProds = await sqlite.getRepository(Product).find();
  const sPedidos = await sqlite.getRepository(Pedido).find();
  const sCots = await sqlite.getRepository(Cotizacion).find();
  const sContacts = await sqlite.getRepository(Contacto).find();
  const sReports = await sqlite.getRepository(Reporte).find();

  const pUsers = pg.getRepository(User);
  const pCats = pg.getRepository(Categoria);
  const pProds = pg.getRepository(Product);
  const pPedidos = pg.getRepository(Pedido);
  const pCots = pg.getRepository(Cotizacion);
  const pContacts = pg.getRepository(Contacto);
  const pReports = pg.getRepository(Reporte);

  let usersMigrated = 0;
  for (const u of sUsers) {
    u.email = u.email.toLowerCase().trim();
    await pUsers.save(pUsers.create(u));
    usersMigrated++;
  }
  await pCats.save(sCats.map(c => pCats.create(c)));
  await pProds.save(sProds.map(p => pProds.create(p)));
  await pPedidos.save(sPedidos.map(p => pPedidos.create(p)));
  await pCots.save(sCots.map(c => pCots.create(c)));
  await pContacts.save(sContacts.map(c => pContacts.create(c)));
  await pReports.save(sReports.map(r => pReports.create(r)));

  // Índices recomendados
  await pg.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
  await pg.query(`CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(createdAt);`);
  await pg.query(`CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(createdAt);`);

  console.log(JSON.stringify({
    usersMigrated,
    categorias: sCats.length,
    productos: sProds.length,
    pedidos: sPedidos.length,
    cotizaciones: sCots.length,
    contactos: sContacts.length,
    reportes: sReports.length,
  }, null, 2));

  await sqlite.destroy();
  await pg.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
