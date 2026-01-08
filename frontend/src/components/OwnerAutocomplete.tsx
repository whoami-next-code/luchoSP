'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, CheckCircle, AlertCircle, User, Building } from 'lucide-react';

type OwnerRecord = {
  id: string;
  type: 'DNI' | 'RUC' | 'UNKNOWN';
  name: string;
  document?: string;
  address?: string;
  phone?: string;
  freq: number;
};

type Props = {
  documentType: 'dni' | 'ruc' | 'any';
  documentNumber?: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (owner: OwnerRecord) => void;
  placeholder?: string;
  className?: string;
};

export default function OwnerAutocomplete({ documentType, documentNumber, value, onChange, onSelect, placeholder = 'Nombre / Razón social', className = '' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OwnerRecord[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState(false);
  const cache = useRef<Map<string, OwnerRecord[]>>(new Map());
  const freqStoreKey = 'owner_search_freq';

  // Cargar frecuencias de uso
  const freqs = useMemo<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(freqStoreKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {} as Record<string, number>;
    }
  }, []);

  const saveFreq = (key: string) => {
    const next = { ...freqs, [key]: (freqs[key] || 0) + 1 };
    try { localStorage.setItem(freqStoreKey, JSON.stringify(next)); } catch {}
  };

  // Buscar sugerencias con debounce
  useEffect(() => {
    const q = value.trim();
    setError(null);
    if (!q || q.length < 2) { setItems([]); setOpen(false); return; }
    const cacheKey = `${documentType}|${q}`;
    const cached = cache.current.get(cacheKey);
    if (cached) { 
      const ranked = rankByFrequency(cached, freqs);
      setItems(ranked);
      setOpen(isFocused && ranked.length > 0);
      return; 
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/clientes/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(documentType)}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const suggestions: OwnerRecord[] = Array.isArray(data?.suggestions) ? data.suggestions : [];
        cache.current.set(cacheKey, suggestions);
        const ranked = rankByFrequency(suggestions, freqs);
        setItems(ranked);
        setOpen(isFocused && ranked.length > 0);
      } catch (e: any) {
        setError(e?.message || 'Error buscando dueños');
        setItems([]);
        setOpen(isFocused);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [value, documentType, isFocused]);

  const rankByFrequency = (arr: OwnerRecord[], freqMap: Record<string, number>) => {
    return [...arr].sort((a, b) => (freqMap[keyOf(b)] || b.freq) - (freqMap[keyOf(a)] || a.freq));
  };

  const keyOf = (o: OwnerRecord) => o.document ? `doc:${o.document}` : `name:${o.name.toLowerCase()}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) onChoose(items[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const onChoose = (owner: OwnerRecord) => {
    onChange(owner.name);
    onSelect(owner);
    saveFreq(keyOf(owner));
    setOpen(false);
  };

  const icon = (type: OwnerRecord['type']) => (type === 'RUC' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => { setActiveIndex(-1); setOpen(false); onChange(e.target.value); }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); setOpen(false); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        />
        <Search className="w-4 h-4 text-gray-500" />
      </div>
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              Buscando…
            </div>
          )}
          {!loading && error && (
            <div className="px-3 py-2 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-600">Sin resultados</div>
          )}
          {!loading && !error && items.length > 0 && (
            <ul role="listbox">
              {items.map((it, idx) => (
                <li
                  key={`${it.id}-${idx}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onMouseDown={(e) => { e.preventDefault(); onChoose(it); }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${idx === activeIndex ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {icon(it.type)}
                    <div>
                      <div className="font-medium text-gray-900">{it.name}</div>
                      <div className="text-xs text-gray-600">{it.document || 'Sin documento'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {it.freq}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
