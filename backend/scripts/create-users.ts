
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Error: Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // 1. Crear Usuario Cliente
  const clientEmail = 'cliente@prueba.com';
  const clientPass = 'Cliente123!';
  
  console.log(`\n--- Creando Usuario Cliente (${clientEmail}) ---`);
  
  // Intentar login para ver si existe
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: clientEmail,
    password: clientPass
  });

  if (loginData.user) {
     console.log('El usuario cliente ya existe y las credenciales son válidas.');
  } else {
    // Si no existe o pass incorrecto, intentamos crear (o sobreescribir si fuera admin pero aqui solo signUp)
    console.log('Intentando registrar usuario...');
    const { data, error } = await supabase.auth.signUp({
        email: clientEmail,
        password: clientPass,
        options: {
            data: {
                fullName: 'Cliente de Prueba',
                role: 'CLIENTE'
            }
        }
    });
    
    if (error) {
        console.error('Error creando cliente:', error.message);
    } else {
        console.log('Cliente registrado exitosamente via signUp (público).');
        if (!data.session) {
            console.log('NOTA: Es posible que se requiera confirmación de email.');
        }
    }
  }

  // 2. Información del Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@industriasp.local';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  console.log(`\n--- Verificando Usuario Admin (${adminEmail}) ---`);
  
  const { data: adminLogin, error: adminError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass
  });
  
  if (adminLogin.user) {
      console.log('El usuario admin ya existe y las credenciales son válidas.');
  } else {
      console.log('Intentando registrar admin...');
      const { data, error } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPass,
          options: {
              data: {
                  fullName: 'Administrador Sistema',
                  role: 'ADMIN'
              }
          }
      });
      if (error) {
          console.error('Error creando admin en Supabase:', error.message);
      } else {
          console.log('Admin registrado en Supabase exitosamente.');
      }
  }

  console.log('\n=============================================');
  console.log('CREDENCIALES DE ACCESO:');
  console.log('---------------------------------------------');
  console.log('1. CLIENTE');
  console.log(`   Email:    ${clientEmail}`);
  console.log(`   Password: ${clientPass}`);
  console.log('---------------------------------------------');
  console.log('2. ADMIN');
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPass}`);
  console.log('=============================================\n');
}

main().catch(console.error);
