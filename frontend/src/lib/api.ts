export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// Debug en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[API] API_URL configurado:', API_URL);
  console.log('[API] NEXT_PUBLIC_API_URL env:', process.env.NEXT_PUBLIC_API_URL);
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  // Prioriza localStorage pero permite sesión temporal si el usuario eligió no recordar.
  return localStorage.getItem('token') ?? sessionStorage.getItem('token');
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  // Asegurar que el path empiece con / si no lo hace
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_URL}${normalizedPath}`;
  
  // Debug en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('[apiFetch]', { API_URL, path, normalizedPath, url });
  }
  
  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  
  return res.json();
}

// Requiere autenticación previa; si no hay token, redirige al login con mensaje y parámetro next
export function requireAuthOrRedirect(nextUrl?: string) {
  const token = getToken();
  if (!token && typeof window !== 'undefined') {
    const msg = encodeURIComponent('Debes iniciar sesión para continuar');
    const next = encodeURIComponent(nextUrl ?? (window.location.pathname + window.location.search));
    window.location.assign(`/auth/login?msg=${msg}&next=${next}`);
    return null;
  }
  return token;
}

// Versión de apiFetch que falla temprano si no hay token y necesita autenticación
export async function apiFetchAuth(path: string, options: RequestInit = {}) {
  // No pasar rutas de API como "next"; debemos regresar al lugar actual del usuario.
  const token = requireAuthOrRedirect();
  if (!token) throw new Error('no_auth');
  
  try {
    return await apiFetch(path, options);
  } catch (err: any) {
    if (err.message.includes('"statusCode":401') || err.message.includes('Unauthorized')) {
      // Si recibimos un 401 del backend, el token probablemente expiró
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        requireAuthOrRedirect();
      }
    }
    throw err;
  }
}
