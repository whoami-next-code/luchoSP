
import axios from 'axios';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
  process.exit(1);
}

async function confirmUser(email: string) {
  console.log(`🔍 Buscando usuario: ${email}`);
  
  try {
    // 1. Buscar usuario por email (usando list users, ya que no hay endpoint de busqueda directa público en v1 admin a veces, pero probemos)
    // Supabase Admin API: GET /auth/v1/admin/users
    const listRes = await axios.get(`${supabaseUrl}/auth/v1/admin/users`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    const users = listRes.data.users || [];
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      console.error(`❌ Usuario no encontrado en Supabase: ${email}`);
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.id} (Confirmado: ${user.email_confirmed_at ? 'Sí' : 'No'})`);

    if (user.email_confirmed_at) {
      console.log('⚠️ El usuario ya estaba confirmado.');
      return;
    }

    // 2. Confirmar usuario
    // PUT /auth/v1/admin/users/{id}
    const updateRes = await axios.put(
      `${supabaseUrl}/auth/v1/admin/users/${user.id}`,
      { email_confirm: true },
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✨ Usuario confirmado exitosamente!`);
    console.log('Datos actualizados:', updateRes.data);

  } catch (error: any) {
    console.error('❌ Error al confirmar usuario:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Obtener email del argumento
const emailArg = process.argv[2];
if (!emailArg) {
  console.log('Uso: npx ts-node scripts/confirm-user-supabase.ts <email>');
  process.exit(0);
}

confirmUser(emailArg);
