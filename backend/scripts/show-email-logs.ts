#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MailService } from '../src/mail/mail.service';

async function showRecentEmailLogs() {
  console.log('📊 Últimos correos enviados\n');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const mailService = app.get(MailService);

  try {
    const logs = await mailService.listLogs(10);

    if (logs.length === 0) {
      console.log('   No hay logs de correos.\n');
    } else {
      console.log(`   Total de logs: ${logs.length}\n`);
      console.log('   ID | Tipo                | Destinatario              | Estado  | Fecha');
      console.log('   ' + '-'.repeat(85));

      logs.forEach((log) => {
        const statusIcon = log.status === 'SUCCESS' ? '✅' : '❌';
        const date = new Date(log.createdAt).toLocaleString('es-ES');
        const id = log.id.toString().padEnd(4);
        const type = log.type.padEnd(18);
        const to = log.to.padEnd(24);
        const status = `${statusIcon} ${log.status}`.padEnd(8);

        console.log(`   ${id}| ${type}| ${to}| ${status}| ${date}`);
      });

      console.log();

      // Resumen
      const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
      const failCount = logs.filter((l) => l.status === 'FAIL').length;
      const successRate = ((successCount / logs.length) * 100).toFixed(1);

      console.log('   📈 Estadísticas:');
      console.log(`      Exitosos: ${successCount}`);
      console.log(`      Fallidos: ${failCount}`);
      console.log(`      Tasa de éxito: ${successRate}%\n`);

      // Mostrar último correo con detalles
      const latest = logs[0];
      console.log('   📧 Último correo enviado:');
      console.log(`      Tipo: ${latest.type}`);
      console.log(`      Para: ${latest.to}`);
      console.log(`      Asunto: ${latest.subject}`);
      console.log(`      Estado: ${latest.status === 'SUCCESS' ? '✅ Exitoso' : '❌ Fallido'}`);
      if (latest.providerMessageId) {
        console.log(`      ID Resend: ${latest.providerMessageId}`);
      }
      if (latest.errorMessage) {
        console.log(`      Error: ${latest.errorMessage}`);
      }
      console.log(`      Fecha: ${new Date(latest.createdAt).toLocaleString('es-ES')}`);
      if (latest.opens > 0) {
        console.log(`      Aperturas: ${latest.opens}`);
      }
      if (latest.clicks > 0) {
        console.log(`      Clics: ${latest.clicks}`);
      }
      console.log();
    }
  } catch (error: any) {
    console.error('❌ Error obteniendo logs:', error.message);
  }

  await app.close();
}

showRecentEmailLogs().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
