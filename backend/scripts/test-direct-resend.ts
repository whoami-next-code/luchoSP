#!/usr/bin/env ts-node

import * as dotenv from 'dotenv';
import { Resend } from 'resend';

// Cargar variables de entorno
dotenv.config();

async function testDirectResend() {
  console.log('🔧 Test Directo con API de Resend\n');

  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY no configurada');
    console.log('   Asegúrate de que el archivo .env contenga:');
    console.log('   RESEND_API_KEY=re_e4aAB4Qp_FbT7VETXcp5ACxyQvY48rena');
    process.exit(1);
  }

  console.log(`📋 API Key: ${apiKey.substring(0, 10)}...`);
  console.log();

  const resend = new Resend(apiKey);

  // Test único: Enviar desde dominio verificado
  console.log('📧 Test: Enviando desde no-reply@whoamicode.com...\n');
  
  try {
    const result1 = await resend.emails.send({
      from: 'no-reply@whoamicode.com',
      to: 'd7502055@gmail.com',
      subject: '✅ Test Directo Resend - Dominio Verificado',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f7fb;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
            <h1 style="color: #2563eb;">✅ Test Exitoso - Dominio Verificado</h1>
            <p>Este correo fue enviado desde <strong>no-reply@whoamicode.com</strong></p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
            <p><strong>Destino:</strong> d7502055@gmail.com</p>
          </div>
        </div>
      `,
    });

    if (result1.error) {
      throw new Error(result1.error.message);
    }

    console.log('✅ Resultado Test:');
    console.log(`   Status: SUCCESS`);
    console.log(`   Message ID: ${(result1 as any).id || result1}`);
    console.log(`   Remitente: no-reply@whoamicode.com`);
    console.log();
    
  } catch (error: any) {
    console.error('❌ Error Test:', error.message);
    console.log();
  }

  // Validación y guía si falla
  console.log('🔎 Si falla, verifica que tu clave sea de PRODUCCIÓN (prefijo re_) y que el dominio whoamicode.com esté verificado con DKIM/SPF/DMARC.\n');

  console.log('\n📬 Revisa tu bandeja de entrada de d7502055@gmail.com');
  console.log('   - Carpeta principal');
  console.log('   - Carpeta de SPAM/Correo no deseado');
  console.log('   - Carpeta de Promociones (si usas Gmail)');
  console.log();
  
  console.log('🔗 Dashboard de Resend:');
  console.log('   https://resend.com/emails');
  console.log('   Aquí puedes ver el estado real de cada email enviado');
  console.log();

  console.log('⏰ Los correos pueden tardar de 1-5 minutos en llegar');
  console.log();
}

testDirectResend().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
