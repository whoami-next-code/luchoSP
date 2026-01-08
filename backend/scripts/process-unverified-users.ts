#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { MailService } from '../src/mail/mail.service';
import { AuditService } from '../src/audit/audit.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function processUnverifiedUsers() {
  console.log('🔄 Iniciando proceso de mantenimiento de usuarios no verificados...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const mailService = app.get(MailService);
  const auditService = app.get(AuditService);

  const graceDays = Number(process.env.UNVERIFIED_USER_GRACE_DAYS || 7);
  
  // 1. Eliminar usuarios expirados
  console.log(`🗑️  Buscando usuarios no verificados creados hace más de ${graceDays} días...`);
  const expiredUsers = await usersService.findUnverifiedOlderThan(graceDays);
  
  if (expiredUsers.length > 0) {
    console.log(`   Encontrados ${expiredUsers.length} usuarios expirados. Procesando eliminación...`);
    for (const user of expiredUsers) {
      await auditService.log('user.auto_deleted', user.id, {
        reason: 'unverified_grace_period_expired',
        email: user.email,
        createdAt: user.createdAt,
      });
      console.log(`   - Marcado para eliminar: ${user.email}`);
    }
    
    const deleted = await usersService.removeUnverifiedOlderThan(graceDays);
    console.log(`✅ Eliminados de la base de datos: ${deleted} usuarios`);
  } else {
    console.log('   No se encontraron usuarios expirados.');
  }

  // 2. Enviar recordatorios a usuarios pendientes (ej. creados hace más de 1 día pero menos del límite)
  // Para evitar spam diario, idealmente filtraríamos por fecha específica (ej. hace 3 días)
  // Aquí demostramos el proceso iterando sobre los recientes
  console.log('📧 Buscando usuarios para enviar recordatorios...');
  
  // Buscamos usuarios creados hace más de 1 día
  const pendingUsers = await usersService.findUnverifiedOlderThan(1);
  let remindersSent = 0;

  for (const user of pendingUsers) {
    const ageMs = Date.now() - user.createdAt.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    // Solo notificar si aún no ha expirado (aunque el paso 1 ya debió borrar los expirados)
    // Y para evitar spam masivo en este script de ejemplo, limitamos a los de "hace 3 días" aprox (ventana de 2 a 4 días)
    if (ageDays < graceDays && ageDays >= 2 && ageDays <= 4) {
      console.log(`   Enviando recordatorio a ${user.email} (registrado hace ${ageDays.toFixed(1)} días)`);
      try {
        await mailService.sendAccountCreation({
          to: user.email,
          fullName: user.fullName ?? 'Usuario',
        });
        remindersSent++;
      } catch (error) {
        console.error(`❌ Error enviando a ${user.email}:`, error.message);
      }
    }
  }
  
  console.log(`✅ Recordatorios enviados: ${remindersSent}`);
  console.log('🏁 Proceso finalizado.');
  
  await app.close();
}

processUnverifiedUsers().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
