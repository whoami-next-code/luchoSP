#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/mail/mail.service';

async function verifyEmailConfiguration() {
  console.log('🔍 Verificando configuración de correo electrónico...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);

  // Verificar variables de entorno
  console.log('📋 Verificando variables de entorno:');
  const requiredEnvVars = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'WEB_URL'];
  const envStatus = {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ Falta',
    RESEND_FROM_EMAIL:
      process.env.RESEND_FROM_EMAIL || 'IndustriaSP@whoamicode.com',
    WEB_URL: process.env.WEB_URL || 'http://localhost:3000',
  };

  console.log(`  RESEND_API_KEY: ${envStatus.RESEND_API_KEY}`);
  console.log(
    `  RESEND_FROM_EMAIL: ${envStatus.RESEND_FROM_EMAIL} ${process.env.RESEND_FROM_EMAIL ? '✅' : '⚠️  (usando default)'}`,
  );
  console.log(
    `  WEB_URL: ${envStatus.WEB_URL} ${process.env.WEB_URL ? '✅' : '⚠️  (usando default)'}\n`,
  );

  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY no está configurada.');
    console.log(
      '   Para configurarla, agrega la siguiente línea al archivo .env:',
    );
    console.log('   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx\n');
    console.log('   Obtén tu API key en: https://resend.com/api-keys\n');
    await app.close();
    return;
  }

  // Enviar email de prueba
  console.log('📧 Enviando email de prueba...\n');

  const testEmail = process.env.TEST_EMAIL || 'd7502055@gmail.com';
  const minimal = String(process.env.EMAIL_TEST_MINIMAL || '').toLowerCase() === 'true';
  const subject = minimal ? 'Tu cuenta fue creada' : 'Test de configuración - IndustriaSP';
  const html = minimal
    ? 'Tu cuenta fue creada correctamente. Inicia sesión en IndustriasSP.'
    : '<h1>¡Configuración exitosa!</h1><p>El sistema de correo electrónico está funcionando correctamente.</p>';

  try {
    const result = await mailService.sendTest(testEmail, subject, html);

    if (result.ok) {
      console.log('✅ Email de prueba enviado exitosamente!');
      console.log(`   ID del mensaje: ${result.id}`);
      if ((result as any).fallback) {
        console.log(
          '   ⚠️  Enviado desde onboarding@resend.dev (dominio no verificado)',
        );
      }
      console.log(`   Destinatario: ${testEmail}\n`);
    } else {
      console.log('❌ Error al enviar email de prueba:');
      console.log(`   ${result.error}\n`);
    }
  } catch (error: any) {
    console.log('❌ Excepción al enviar email de prueba:');
    console.log(`   ${error.message}\n`);
  }

  // Verificar logs
  console.log('📊 Verificando logs de correo...\n');
  try {
    const logs = await mailService.listLogs(5);
    console.log(`   Total de logs recientes: ${logs.length}`);
    if (logs.length > 0) {
      console.log('   Últimos envíos:');
      logs.forEach((log, i) => {
        const statusIcon = log.status === 'SUCCESS' ? '✅' : '❌';
        console.log(
          `     ${i + 1}. ${statusIcon} ${log.type} → ${log.to} (${log.status})`,
        );
      });
    }
    console.log();
  } catch (error: any) {
    console.log('   ⚠️  No se pudieron cargar los logs');
    console.log(`   ${error.message}\n`);
  }

  // Resumen final
  console.log('📝 Resumen de configuración:\n');
  const issues = [];

  if (!process.env.RESEND_API_KEY) {
    issues.push('- Falta configurar RESEND_API_KEY');
  }
  if (!process.env.RESEND_FROM_EMAIL) {
    issues.push('- RESEND_FROM_EMAIL usa valor por defecto');
  }
  if (!process.env.WEB_URL) {
    issues.push('- WEB_URL usa valor por defecto (localhost)');
  }

  if (issues.length === 0) {
    console.log('✅ Configuración completa y correcta!\n');
    console.log('El sistema está listo para enviar correos en producción.\n');
  } else {
    console.log('⚠️  Configuración funcional pero con pendientes:\n');
    issues.forEach((issue) => console.log(`   ${issue}`));
    console.log();
  }

  console.log('🔗 Enlaces útiles:');
  console.log('   - Resend Dashboard: https://resend.com/emails');
  console.log('   - API Keys: https://resend.com/api-keys');
  console.log('   - Dominio verificado: https://resend.com/domains');
  console.log();

  await app.close();
}

verifyEmailConfiguration().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
