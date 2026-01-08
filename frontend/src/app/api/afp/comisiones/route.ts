import { NextResponse } from 'next/server';

type AFPItem = {
  afp: string;
  periodo: string;
  comision_fija: number | null;
  comision_sobre_flujo: number | null;
  comision_mixta_sobre_flujo: number | null;
  comision_mixta_sobre_saldo: number | null;
  comision_anual_sobre_saldo: number | null;
  prima_de_seguro: number | null;
  aporte_obligatorio: number | null;
  remuneracion_maxima_asegurable: number | null;
};

const memoryCache = new Map<string, { when: number; data: AFPItem[] }>();
const TTL_MS = 15 * 60 * 1000; // 15 minutos

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');
    if (!year || !month) {
      return NextResponse.json({ ok: false, error: 'Parámetros year y month son requeridos' }, { status: 400 });
    }

    const token = process.env.DECOLECTA_API_TOKEN;
    if (!token) {
      return NextResponse.json({ ok: false, error: 'Token no configurado en el servidor (DECOLECTA_API_TOKEN)' }, { status: 500 });
    }

    const cacheKey = `${year}-${month}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.when < TTL_MS) {
      return NextResponse.json({ ok: true, cached: true, items: cached.data });
    }

    const endpoint = `https://api.decolecta.com/v1/afp/comisiones?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`;
    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ ok: false, error: text || res.statusText }, { status: res.status || 502 });
    }
    const data = await res.json();
    const items: AFPItem[] = Array.isArray(data) ? data : [];
    memoryCache.set(cacheKey, { when: Date.now(), data: items });
    return NextResponse.json({ ok: true, items });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error interno' }, { status: 500 });
  }
}

