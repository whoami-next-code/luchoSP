// Service Worker Optimizado para Producción
const CACHE_NAME = 'industria-sp-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';
const API_CACHE = 'api-cache-v1';
const IMAGE_CACHE = 'image-cache-v1';

// URLs a precachear
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/_next/static/chunks/framework-*.js',
  '/_next/static/chunks/main-*.js',
  '/_next/static/chunks/pages/_app-*.js',
  '/_next/static/chunks/webpack-*.js',
  '/_next/static/css/*.css',
  '/manifest.json',
  '/favicon.ico',
  '/images/logo.svg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== API_CACHE && 
              cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de cacheo con network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // No cachear requests de extensiones
  if (url.pathname.includes('chrome-extension') || 
      url.pathname.includes('extension') || 
      url.pathname.includes('browser-extension')) {
    return;
  }
  
  // Cacheo para imágenes
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }
  
  // Cacheo para APIs
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Cacheo para archivos estáticos
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'font') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Cacheo para páginas HTML
  if (request.destination === 'document' || 
      request.mode === 'navigate') {
    event.respondWith(handlePageRequest(request));
    return;
  }
  
  // Cacheo por defecto
  event.respondWith(handleDefaultRequest(request));
});

// Manejo de imágenes con cache-first y actualización en segundo plano
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Actualizar en segundo plano
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
    });
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Image not available', { status: 404 });
  }
}

// Manejo de APIs con stale-while-revalidate
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Si hay respuesta cacheada, devolverla inmediatamente
  if (cachedResponse) {
    // Actualizar en segundo plano
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
    });
    return cachedResponse;
  }
  
  // Si no hay respuesta cacheada, intentar la red
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Si falla la red, devolver respuesta cacheada genérica
    return new Response(JSON.stringify({ error: 'Network error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Manejo de archivos estáticos con cache-first
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available', { status: 404 });
  }
}

// Manejo de páginas HTML con network-first
async function handlePageRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Si falla la red, intentar cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no hay cache, mostrar página offline
    const offlineResponse = await cache.match('/offline');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Manejo por defecto
async function handleDefaultRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Resource not available', { status: 404 });
  }
}

// Manejo de mensajes para actualización de cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    });
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/images/logo-192.png',
    badge: '/images/logo-192.png',
    vibrate: [200, 100, 200],
    tag: 'notification',
    renotify: true,
  };
  
  event.waitUntil(
    self.registration.showNotification('Industria SP', options)
  );
});

// Función auxiliar para sincronización
async function syncData() {
  // Implementar lógica de sincronización
  console.log('Sincronizando datos...');
}

// Limpiar cache antiguo periódicamente
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cleanup-cache') {
    event.waitUntil(cleanupCache());
  }
});

// Función para limpiar cache antiguo
async function cleanupCache() {
  const cacheNames = await caches.keys();
  const now = Date.now();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          const age = now - responseDate;
          
          // Eliminar recursos con más de 30 días
          if (age > 30 * 24 * 60 * 60 * 1000) {
            await cache.delete(request);
          }
        }
      }
    }
  }
}