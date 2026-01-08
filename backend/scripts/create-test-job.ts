#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { PedidosService } from '../src/pedidos/pedidos.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function createTestJob() {
  console.log('🔄 Creando trabajo de prueba...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const pedidosService = app.get(PedidosService);

  // 1. Buscar o Crear usuario cliente
  const email = 'cliente@prueba.com';
  let user = await usersService.findByEmail(email);

  if (!user) {
    console.log(`⚠️ El usuario ${email} no existe localmente. Creándolo...`);
    // Crear usuario local dummy para pruebas
    user = await usersService.create({
      email,
      fullName: 'Cliente Prueba Local',
      role: 'CLIENTE', // Ajustar según UserRole enum
      verified: true,
      supabaseUid: '123e4567-e89b-12d3-a456-426614174000', // UID válido (UUID v4)
    } as any);
  }

  // 2. Crear Pedido (Trabajo)
  const orderNumber = `ORD-TEST-${Date.now().toString().slice(-6)}`;
  console.log(`📝 Creando pedido ${orderNumber} para usuario ID: ${user.id}`);

  const pedido = await pedidosService.create({
    orderNumber,
    userId: user.id,
    customerName: 'Empresa Test S.A.',
    customerDni: '12345678',
    customerEmail: email,
    customerPhone: '555-0199',
    shippingAddress: 'Av. Industrial 123, Ciudad',
    items: JSON.stringify([
      { name: 'Reparación Motor X200', quantity: 1 },
      { name: 'Mantenimiento Preventivo', quantity: 1 }
    ]),
    subtotal: 1500.00,
    total: 1500.00,
    orderStatus: 'PROCESSING', // Para que se vea en progreso (Azul)
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PENDING'
  });

  console.log('✅ Trabajo creado exitosamente:', pedido.id);
  console.log('👉 Ahora recarga la app móvil para ver el trabajo.');

  await app.close();
}

createTestJob().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
