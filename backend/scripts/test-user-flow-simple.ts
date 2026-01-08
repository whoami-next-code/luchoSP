#!/usr/bin/env ts-node

import * as dotenv from 'dotenv';
import { Resend } from 'resend';

// Cargar variables
dotenv.config();

async function testFullFlow() {
  console.log('🚀 Iniciando prueba de flujo completo de correo...\n');

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'IndustriaSP@whoamicode.com';
  // Usar correo de prueba real del usuario, no el admin que rebota
  const toEmail = process.env.TEST_EMAIL || 'whoamicp95@gmail.com'; 

  console.log('Configuración detectada:');
  console.log(`- API Key: ${apiKey ? '********' + apiKey.slice(-4) : 'MISSING'}`);
  console.log(`- From: ${fromEmail}`);
  console.log(`- To: ${toEmail}`);
  console.log(`- Admin Alert Email: ${process.env.ADMIN_ALERT_EMAIL} (Debe ser un correo real que reciba emails)`);
  
  if (!apiKey || !apiKey.startsWith('re_')) {
    console.error('❌ Error: API Key inválida o de test. Debe empezar con re_');
    return;
  }

  const resend = new Resend(apiKey);

  console.log('\n📧 1. Intentando enviar correo de BIENVENIDA simulado...');
  
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '✅ Prueba de Registro de Usuario - IndustriaSP',
      html: `
        <h1>¡Bienvenido a IndustriaSP!</h1>
        <p>Este es un correo de prueba simulando el registro de un nuevo usuario.</p>
        <p>Si recibes esto, el flujo de envío funciona correctamente.</p>
        <hr>
        <p><small>Enviado desde: ${fromEmail}</small></p>
      `,
    });

    if (error) {
      console.error('❌ Error en envío:', error);
    } else {
      console.log('✅ Envío exitoso!');
      console.log(`   ID: ${data?.id}`);
      console.log('   Por favor revisa tu bandeja de entrada (y spam).');
    }

  } catch (e) {
    console.error('❌ Excepción al enviar:', e);
  }
}

testFullFlow();
