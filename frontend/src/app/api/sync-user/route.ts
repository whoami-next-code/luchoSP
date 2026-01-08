import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const { email, fullName, id } = await req.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'email_required' }, { status: 400 });
    }
    const secret = process.env.EXTERNAL_REG_SECRET || '';
    if (!secret) {
      return NextResponse.json({ ok: false, error: 'missing_server_secret' }, { status: 500 });
    }
    const resp = await fetch(`${API_URL}/auth/register-external`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-external-secret': secret,
      },
      body: JSON.stringify({ email, fullName, id }),
    });
    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      // Si el error está relacionado con correo, mantener el mensaje específico
      const errorMsg = data.error || 'backend_error';
      if (data.emailError) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Error al enviar el correo electrónico de confirmación',
          emailError: true 
        }, { status: resp.status || 502 });
      }
      return NextResponse.json({ ok: false, error: errorMsg }, { status: resp.status || 502 });
    }
    return NextResponse.json({ 
      ok: true, 
      created: data.created, 
      id: data.id,
      emailSent: data.emailSent 
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'unexpected_error' }, { status: 500 });
  }
}
