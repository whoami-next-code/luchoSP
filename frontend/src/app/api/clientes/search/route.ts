import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

type OwnerSuggestion = {
  id: string; // document when available, else name hash
  type: 'DNI' | 'RUC' | 'UNKNOWN';
  name: string;
  document?: string;
  address?: string;
  phone?: string;
  freq: number;
};

const memoryCache = new Map<string, { when: number; data: OwnerSuggestion[] }>();
const TTL_MS = 30_000; // 30s cache para consultas repetidas

function normalize(str: string) {
  return (str || '').toLowerCase();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim();
    const typeParam = url.searchParams.get('type') || 'any';
    const type = typeParam === 'dni' ? 'DNI' : typeParam === 'ruc' ? 'RUC' : 'ANY';

    if (!q) return NextResponse.json({ ok: false, error: 'Parámetro q requerido', suggestions: [] }, { status: 400 });

    const cacheKey = `${type}|${q}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.when < TTL_MS) {
      return NextResponse.json({ ok: true, suggestions: cached.data, cached: true });
    }

    // Consultar pedidos existentes para validar contra BD y calcular frecuencia
    const res = await fetch(`${API_URL}/pedidos`, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ ok: false, error: text || res.statusText }, { status: res.status || 502 });
    }
    const orders: any[] = await res.json();

    // Construir índice de dueños (por documento si existe)
    const byDoc = new Map<string, OwnerSuggestion>();
    const byName = new Map<string, OwnerSuggestion>();
    for (const o of orders) {
      const name = String(o?.customerName || '').trim();
      const document = String(o?.customerDni || '').trim();
      const address = String(o?.shippingAddress || '').trim();
      const phone = String(o?.customerPhone || '') || undefined;

      const docType = document?.length === 11 ? 'RUC' : document?.length === 8 ? 'DNI' : 'UNKNOWN';

      if (document) {
        const existing = byDoc.get(document);
        if (existing) {
          existing.freq += 1;
          if (!existing.address && address) existing.address = address;
          if (!existing.phone && phone) existing.phone = phone;
          if (!existing.name && name) existing.name = name;
        } else {
          byDoc.set(document, { id: document, type: docType, name, document, address, phone, freq: 1 });
        }
      }

      if (name) {
        const key = normalize(name);
        const existing = byName.get(key);
        if (existing) {
          existing.freq += 1;
        } else {
          byName.set(key, { id: key, type: docType, name, document, address, phone, freq: 1 });
        }
      }
    }

    const nq = normalize(q);
    const candidates: OwnerSuggestion[] = [];

    // Filtrar por documento
    for (const s of byDoc.values()) {
      const matchesType = type === 'ANY' || s.type === type;
      if (!matchesType) continue;
      if (s.document && s.document.includes(q)) candidates.push(s);
      else if (s.name && normalize(s.name).includes(nq)) candidates.push(s);
    }

    // Si hay pocos resultados, completar con por nombre
    if (candidates.length < 8) {
      for (const s of byName.values()) {
        const matchesType = type === 'ANY' || s.type === type;
        if (!matchesType) continue;
        if (normalize(s.name).includes(nq)) candidates.push(s);
      }
    }

    // Unificar por documento cuando disponible
    const unique = new Map<string, OwnerSuggestion>();
    for (const s of candidates) {
      const key = s.document ? `doc:${s.document}` : `name:${normalize(s.name)}`;
      const prev = unique.get(key);
      if (!prev || s.freq > prev.freq) unique.set(key, s);
    }

    const suggestions = Array.from(unique.values())
      .sort((a, b) => b.freq - a.freq)
      .slice(0, 10);

    memoryCache.set(cacheKey, { when: Date.now(), data: suggestions });
    return NextResponse.json({ ok: true, suggestions });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error interno', suggestions: [] }, { status: 500 });
  }
}

