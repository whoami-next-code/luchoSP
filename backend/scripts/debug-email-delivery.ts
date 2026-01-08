#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/mail/mail.service';

async function debugEmailDelivery() {
  console.log('🔍 Diagnóstico de Entrega de Correos\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);

  console.log('📋 Verificando configuración:\n');
  console.log(`   RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada (' + process.env.RESEND_API_KEY.substring(0, 10) + '...)' : '❌ Falta'}`);
  console.log(`   RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL || 'IndustriaSP@whoamicode.com'}`);
  console.log();

  console.log('📧 Enviando email de diagnóstico...\n');

  try {
    const result = await mailService.sendTest(
      'd7502055@gmail.com',
      '🧪 Test de Diagnóstico - IndustriaSP',
      `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">🧪 Email de Diagnóstico</h1>
          <p>Este es un email de prueba para verificar la entrega.</p>
          <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <p><strong>Remitente:</strong> ${process.env.RESEND_FROM_EMAIL || 'IndustriaSP@whoamicode.com'}</p>
          <p><strong>Destinatario:</strong> d7502055@gmail.com</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            Si recibes este correo, el sistema está funcionando correctamente.
            <br>Revisa la carpeta de spam/correo no deseado si no lo ves en la bandeja principal.
          </p>
        </div>
      `,
    );

    console.log('📊 Resultado del envío:\n');
    console.log(`   Estado: ${result.ok ? '✅ Exitoso' : '❌ Fallido'}`);
    
    if (result.ok) {
      console.log(`   Message ID: ${result.id || 'No disponible'}`);
      if ((result as any).fallback) {
        console.log('   ⚠️  IMPORTANTE: Enviado usando fallback (onboarding@resend.dev)');
        console.log('   Razón: El dominio whoamicode.com no está verificado en Resend');
        console.log();
        console.log('   🔧 Soluciones:');
        console.log('      1. Verificar el dominio en: https://resend.com/domains');
        console.log('      2. Los correos llegarán desde: onboarding@resend.dev (pueden ir a spam)');
        console.log();
      } else {
        console.log('   ✅ Enviado desde: ' + process.env.RESEND_FROM_EMAIL);
      }
    } else {
      console.log(`   Error: ${result.error}`);
      console.log();
      console.log('   ⚠️  Posibles causas:');
      console.log('      1. API Key inválida o expirada');
      console.log('      2. Cuota de Resend agotada (100 emails/día en plan gratuito)');
      console.log('      3. Dominio bloqueado o suspendido');
      console.log();
    }

    // Esperar para el envío asíncrono
    console.log('\n⏳ Esperando confirmación del proveedor (10 segundos)...\n');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Revisar logs más recientes
    const logs = await mailService.listLogs(3);
    console.log('📝 Últimos 3 registros en logs:\n');
    
    logs.forEach((log, index) => {
      console.log(`   ${index + 1}. ${log.type} → ${log.to}`);
      console.log(`      Estado: ${log.status === 'SUCCESS' ? '✅' : '❌'} ${log.status}`);
      console.log(`      Asunto: ${log.subject}`);
      if (log.providerMessageId) {
        console.log(`      Message ID: ${log.providerMessageId}`);
      }
      if (log.errorMessage) {
        console.log(`      Error: ${log.errorMessage}`);
      }
      console.log(`      Fecha: ${new Date(log.createdAt).toLocaleString('es-ES')}`);
      console.log();
    });

  } catch (error: any) {
    console.error('❌ Error durante el diagnóstico:', error.message);
    console.error(error.stack);
  }

  console.log('\n🔗 Verificar en Dashboard de Resend:');
  console.log('   https://resend.com/emails');
  console.log();
  console.log('📌 Recomendaciones:');
  console.log('   1. Revisa la carpeta de SPAM/Correo no deseado');
  console.log('   2. Verifica en el dashboard de Resend si los emails están siendo enviados');
  console.log('   3. Confirma que no has alcanzado el límite de 100 emails/día');
  console.log('   4. Verifica el dominio whoamicode.com en Resend');
  console.log();

  await app.close();
}

debugEmailDelivery().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
