#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

async function testUserRegistration() {
  console.log('🧪 Prueba de Registro de Usuario con Envío de Correo\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  const testUser = {
    email: 'd7502055@gmail.com',
    password: 'TestPassword123!',
    fullName: 'Usuario de Prueba IndustriaSP',
  };

  console.log('📝 Datos del usuario de prueba:');
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Nombre: ${testUser.fullName}\n`);

  try {
    console.log('🔄 Intentando registrar usuario...\n');

    const result = await authService.register(testUser);

    console.log('✅ Usuario registrado exitosamente!');
    console.log(`   ID: ${(result as any).user.id}`);
    console.log(`   Email: ${(result as any).user.email}`);
    // console.log(`   Token de verificación: ${result.verificationToken}\n`);

    console.log('📧 El correo de bienvenida se está enviando de forma asíncrona...');
    console.log('   Destinatario: d7502055@gmail.com');
    console.log('   Remitente: IndustriaSP@whoamicode.com\n');

    // Esperar un poco para que se complete el envío asíncrono
    console.log('⏳ Esperando envío del correo (5 segundos)...\n');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log('✅ Proceso completado!');
    console.log('\n📬 Revisa la bandeja de entrada de d7502055@gmail.com');
    console.log('   El correo debe contener:');
    console.log('   - Saludo personalizado: "Hola Usuario de Prueba IndustriaSP"');
    console.log('   - Link de inicio de sesión');
    console.log('   - Link de verificación de cuenta');
    console.log('   - Remitente: IndustriaSP@whoamicode.com\n');
  } catch (error: any) {
    if (error.message?.includes('Email ya registrado')) {
      console.log('⚠️  El usuario ya existe en la base de datos');
      console.log(
        '   Para probar nuevamente, puedes eliminar el usuario o usar otro email\n',
      );
      console.log('💡 Enviando correo de recuperación de contraseña como alternativa...\n');

      try {
        const resetResult = await authService.forgotPassword(testUser.email);
        console.log('✅ Correo de recuperación enviado!');
        // console.log(`   Token: ${resetResult.token}`);
        console.log('   Espera 5 segundos para el envío asíncrono...\n');
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log('📬 Revisa la bandeja de d7502055@gmail.com');
        console.log('   Debe haber llegado un correo de recuperación de contraseña\n');
      } catch (resetError: any) {
        console.error('❌ Error enviando correo de recuperación:', resetError.message);
      }
    } else {
      console.error('❌ Error en el registro:', error.message);
      console.error(error.stack);
    }
  }

  await app.close();
}

testUserRegistration().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
