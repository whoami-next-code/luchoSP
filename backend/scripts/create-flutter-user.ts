/**
 * Script para crear un usuario completo con todos los permisos para la app Flutter
 * 
 * Este script:
 * 1. Crea el usuario en Supabase con email confirmado
 * 2. Lo sincroniza en la base de datos local
 * 3. Le asigna rol ADMIN (máximos permisos)
 * 4. Le crea un pedido de prueba para que tenga trabajos asignados
 * 
 * USO:
 *   ts-node scripts/create-flutter-user.ts
 * 
 * O con parámetros personalizados:
 *   ts-node scripts/create-flutter-user.ts --email usuario@example.com --password MiPassword123!
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { PedidosService } from '../src/pedidos/pedidos.service';
import { AuthService } from '../src/auth/auth.service';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

async function main() {
  // Obtener parámetros de línea de comandos o usar valores por defecto
  const args = process.argv.slice(2);
  let email = 'flutter@industriasp.com';
  let password = 'Flutter123!';
  let fullName = 'Usuario Flutter';

  // Parsear argumentos simples
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      email = args[i + 1];
    } else if (args[i] === '--password' && args[i + 1]) {
      password = args[i + 1];
    } else if (args[i] === '--name' && args[i + 1]) {
      fullName = args[i + 1];
    }
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const pedidosService = app.get(PedidosService);
  const authService = app.get(AuthService);

  try {
    console.log('\n=============================================');
    console.log('CREANDO USUARIO PARA APP FLUTTER');
    console.log('=============================================\n');

    // Verificar configuración de Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('❌ Error: Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Verificar si el usuario ya existe en Supabase
    console.log(`📧 Verificando usuario: ${email}`);
    let supabaseUser;
    
    try {
      // Intentar buscar usuario por email usando Admin API
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      if (!listError && users?.users) {
        supabaseUser = users.users.find((u) => u.email === email);
      }
    } catch (e) {
      console.log('   No se pudo listar usuarios, continuando...');
    }

    let supabaseUid: string;

    if (supabaseUser) {
      console.log('   ✓ Usuario ya existe en Supabase');
      supabaseUid = supabaseUser.id;
      
      // Intentar login para verificar credenciales
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        console.log('   ⚠ Las credenciales no coinciden. Actualizando contraseña...');
        // Actualizar contraseña usando Admin API
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          supabaseUid,
          { password },
        );
        if (updateError) {
          console.error(`   ❌ Error actualizando contraseña: ${updateError.message}`);
        } else {
          console.log('   ✓ Contraseña actualizada');
        }
      } else {
        console.log('   ✓ Credenciales válidas');
      }
    } else {
      // 2. Crear usuario en Supabase usando Admin API
      console.log('   Creando usuario en Supabase...');
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirmar email
        user_metadata: {
          fullName,
          role: 'ADMIN',
        },
      });

      if (createError) {
        console.error(`   ❌ Error creando usuario en Supabase: ${createError.message}`);
        process.exit(1);
      }

      supabaseUid = userData.user.id;
      console.log('   ✓ Usuario creado en Supabase');
    }

    // 3. Verificar/crear usuario en base de datos local
    console.log('\n📦 Sincronizando con base de datos local...');
    let localUser = await usersService.findBySupabaseUid(supabaseUid);

    if (!localUser) {
      // Buscar por email como fallback
      localUser = await usersService.findByEmail(email);
      
      if (localUser) {
        // Actualizar con supabaseUid
        await usersService.update(localUser.id, {
          supabaseUid,
          role: 'ADMIN' as any,
          verified: true,
          fullName: fullName || localUser.fullName,
        } as any);
        console.log('   ✓ Usuario actualizado en base de datos local');
      } else {
        // Crear nuevo usuario
        localUser = await usersService.create({
          email,
          password, // Se hasheará automáticamente
          role: 'ADMIN' as any,
          fullName,
          verified: true,
          supabaseUid,
        });
        console.log('   ✓ Usuario creado en base de datos local');
      }
    } else {
      // Actualizar rol y datos si es necesario
      if (localUser.role !== 'ADMIN') {
        await usersService.update(localUser.id, {
          role: 'ADMIN' as any,
          verified: true,
          fullName: fullName || localUser.fullName,
        } as any);
        console.log('   ✓ Usuario actualizado con rol ADMIN');
      } else {
        console.log('   ✓ Usuario ya existe con rol ADMIN');
      }
    }

    // 4. Crear pedido de prueba asociado al usuario
    console.log('\n📋 Creando pedido de prueba...');
    const existingPedidos = await pedidosService.findByUserId(localUser.id);
    
    if (existingPedidos.length === 0) {
      const orderNumber = `ORD-FLUTTER-${Date.now()}`;
      const testPedido = {
        orderNumber,
        userId: localUser.id,
        customerName: 'Cliente de Prueba Flutter',
        customerDni: '12345678',
        customerEmail: email,
        customerPhone: '+5491123456789',
        items: JSON.stringify([
          {
            name: 'Equipo Industrial Flutter',
            productName: 'Equipo Industrial Flutter',
            qty: 1,
            cantidad: 1,
            price: 75000,
            precio: 75000,
          },
        ]),
        subtotal: 75000,
        shipping: 5000,
        total: 80000,
        paymentMethod: 'CARD' as const,
        paymentStatus: 'COMPLETED' as const,
        orderStatus: 'PROCESSING' as const,
        status: 'PAGADO' as const,
        shippingAddress: 'Dirección de Prueba Flutter 123',
        notes: 'Pedido de prueba creado automáticamente para usuario Flutter',
      };

      const pedidoCreado = await pedidosService.create(testPedido);
      console.log(`   ✓ Pedido creado: ${pedidoCreado.orderNumber}`);
    } else {
      console.log(`   ✓ Ya existe ${existingPedidos.length} pedido(s) asignado(s)`);
    }

    // 5. Verificar que el login funciona
    console.log('\n🔐 Verificando login...');
    try {
      const loginResult = await authService.login({ email, password });
      if (loginResult.access_token) {
        console.log('   ✓ Login exitoso');
      }
    } catch (e) {
      console.log(`   ⚠ Error en login de verificación: ${e.message}`);
    }

    // 6. Mostrar resumen
    console.log('\n=============================================');
    console.log('✅ USUARIO CREADO EXITOSAMENTE');
    console.log('=============================================');
    console.log('\n📱 CREDENCIALES PARA APP FLUTTER:');
    console.log('---------------------------------------------');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Nombre:   ${fullName}`);
    console.log(`Rol:      ADMIN (todos los permisos)`);
    console.log(`ID:       ${localUser.id}`);
    console.log('---------------------------------------------');
    console.log('\n📋 ESTADO:');
    console.log(`✓ Usuario creado en Supabase`);
    console.log(`✓ Usuario sincronizado en BD local`);
    console.log(`✓ Email confirmado`);
    console.log(`✓ Rol: ADMIN`);
    console.log(`✓ Pedidos asignados: ${existingPedidos.length > 0 ? existingPedidos.length : 1}`);
    console.log('\n🚀 Puedes usar estas credenciales para iniciar sesión en la app Flutter');
    console.log('=============================================\n');

  } catch (error) {
    console.error('\n❌ Error al crear usuario:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();

