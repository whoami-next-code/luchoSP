
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Error: Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
    process.exit(1);
  }

  // Usar Service Key para permisos administrativos completos
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const superAdminEmail = 'superadmin@industriasp.com';
  const superAdminPass = 'SuperAdmin2025!';

  console.log(`\n👑 Creando/Actualizando Super Admin (${superAdminEmail})...`);

  // 1. Buscar si existe el usuario
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listando usuarios:', listError.message);
    process.exit(1);
  }

  const existingUser = users.find(u => u.email === superAdminEmail);

  if (existingUser) {
    console.log('ℹ️ El usuario ya existe. Actualizando contraseña y rol...');
    
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password: superAdminPass,
        email_confirm: true,
        user_metadata: {
          fullName: 'Super Admin Maestro',
          role: 'ADMIN', // Rol maestro
          isSuperAdmin: true
        }
      }
    );

    if (error) {
      console.error('❌ Error actualizando admin:', error.message);
    } else {
      console.log('✅ Super Admin actualizado correctamente.');
    }

  } else {
    console.log('ℹ️ Creando nuevo usuario Super Admin...');
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: superAdminEmail,
      password: superAdminPass,
      email_confirm: true, // Auto-confirmar
      user_metadata: {
        fullName: 'Super Admin Maestro',
        role: 'ADMIN',
        isSuperAdmin: true
      }
    });

    if (error) {
      console.error('❌ Error creando admin:', error.message);
    } else {
      console.log('✅ Super Admin creado correctamente.');
    }
  }

  console.log('\n=============================================');
  console.log('🔑 CREDENCIALES SUPER ADMIN');
  console.log('=============================================');
  console.log(`📧 Email:    ${superAdminEmail}`);
  console.log(`🔒 Password: ${superAdminPass}`);
  console.log('=============================================\n');
}

main().catch(console.error);
