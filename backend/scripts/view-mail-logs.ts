import axios from 'axios';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Falta configuración de Supabase en .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('1. Autenticando como Super Admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@industriasp.com',
    password: 'SuperAdmin123!',
  });

  if (authError || !authData.session) {
    console.error('Error login:', authError?.message);
    process.exit(1);
  }

  const token = authData.session.access_token;
  console.log('Login exitoso.');

  console.log('2. Consultando logs de correo...');
  try {
    const backendUrl = process.env.WEB_URL || 'http://localhost:3001';
    // Asegurar que usamos el puerto del backend si WEB_URL apunta al frontend
    const apiUrl = backendUrl.replace('3000', '3001'); 
    
    const { data } = await axios.get(`${apiUrl}/api/mail/logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('\n--- ÚLTIMOS LOGS DE CORREO ---');
    if (Array.isArray(data) && data.length > 0) {
      data.slice(0, 5).forEach((log: any) => {
        console.log(`\n[${new Date(log.createdAt).toLocaleString()}] Destino: ${log.to}`);
        console.log(`   Asunto: ${log.subject}`);
        console.log(`   Estado: ${log.status}`);
        console.log(`   Provider ID: ${log.providerMessageId || 'N/A'}`);
        if (log.error) console.log(`   Error: ${log.error}`);
      });
    } else {
      console.log('No hay logs disponibles o la lista está vacía.');
      console.log('Respuesta cruda:', data);
    }
    console.log('\n------------------------------');

  } catch (error: any) {
    console.error('Error consultando logs:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

main();
