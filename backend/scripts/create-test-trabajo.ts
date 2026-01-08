/**
 * Script seguro para crear un trabajo de prueba asociado a un usuario
 * 
 * USO:
 *   ts-node scripts/create-test-trabajo.ts [userId]
 * 
 * Si no se proporciona userId, busca el primer usuario con rol TECNICO o OPERARIO
 * Si no encuentra ninguno, usa el primer usuario disponible
 * 
 * Este script NO modifica datos existentes, solo crea un nuevo pedido de prueba
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PedidosService } from '../src/pedidos/pedidos.service';
import { UsersService } from '../src/users/users.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const pedidosService = app.get(PedidosService);
  const usersService = app.get(UsersService);

  try {
    // Obtener userId del argumento o buscar uno apropiado
    const userIdArg = process.argv[2];
    let userId: number | undefined;

    if (userIdArg) {
      userId = parseInt(userIdArg, 10);
      if (isNaN(userId)) {
        console.error('Error: userId debe ser un número');
        process.exit(1);
      }
      // Verificar que el usuario existe
      const user = await usersService.findOne(userId);
      if (!user) {
        console.error(`Error: Usuario con ID ${userId} no encontrado`);
        process.exit(1);
      }
      console.log(`✓ Usuario encontrado: ${user.email} (${user.role})`);
    } else {
      // Buscar usuario técnico u operario
      console.log('Buscando usuario técnico u operario...');
      const tecnicos = await usersService.findAll({ role: 'TECNICO' as any });
      const operarios = await usersService.findAll({ role: 'OPERARIO' as any });
      
      const usuarioApropiado = tecnicos[0] || operarios[0];
      
      if (usuarioApropiado) {
        userId = usuarioApropiado.id;
        console.log(`✓ Usuario encontrado: ${usuarioApropiado.email} (${usuarioApropiado.role})`);
      } else {
        // Buscar cualquier usuario
        const todosUsuarios = await usersService.findAll();
        if (todosUsuarios.length === 0) {
          console.error('Error: No hay usuarios en la base de datos');
          console.log('Por favor, crea un usuario primero usando: ts-node scripts/create-users.ts');
          process.exit(1);
        }
        userId = todosUsuarios[0].id;
        console.log(`⚠ Usando primer usuario disponible: ${todosUsuarios[0].email} (${todosUsuarios[0].role})`);
      }
    }

    // Crear pedido de prueba
    const orderNumber = `ORD-TEST-${Date.now()}`;
    const testPedido = {
      orderNumber,
      userId,
      customerName: 'Cliente de Prueba',
      customerDni: '12345678',
      customerEmail: 'cliente.prueba@example.com',
      customerPhone: '+5491123456789',
      items: JSON.stringify([
        {
          name: 'Equipo Industrial de Prueba',
          productName: 'Equipo Industrial de Prueba',
          qty: 1,
          cantidad: 1,
          price: 50000,
          precio: 50000,
        },
      ]),
      subtotal: 50000,
      shipping: 5000,
      total: 55000,
      paymentMethod: 'CARD' as const,
      paymentStatus: 'COMPLETED' as const,
      orderStatus: 'PROCESSING' as const,
      status: 'PAGADO' as const, // status solo acepta: 'PENDIENTE' | 'PAGADO' | 'ENVIADO' | 'CANCELADO'
      shippingAddress: 'Calle de Prueba 123, Ciudad de Prueba',
      notes: 'Este es un pedido de prueba creado automáticamente para testing de la app móvil',
    };

    console.log(`\n--- Creando pedido de prueba ---`);
    console.log(`Order Number: ${orderNumber}`);
    console.log(`Usuario ID: ${userId}`);
    console.log(`Estado: ${testPedido.orderStatus}`);

    const pedidoCreado = await pedidosService.create(testPedido);

    console.log(`\n✓ Pedido creado exitosamente!`);
    console.log(`  ID: ${pedidoCreado.id}`);
    console.log(`  Order Number: ${pedidoCreado.orderNumber}`);
    console.log(`  Cliente: ${pedidoCreado.customerName}`);
    console.log(`  Estado: ${pedidoCreado.orderStatus}`);
    console.log(`  Total: $${pedidoCreado.total}`);
    console.log(`\nEste pedido debería aparecer en la app móvil para el usuario con ID ${userId}`);

  } catch (error) {
    console.error('Error al crear pedido de prueba:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();

