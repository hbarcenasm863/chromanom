// ChromaNom Service Worker — v6.0
// Cache-first para uso offline completo, incluyendo Google Fonts

const CACHE = 'chromanom-v12';
const FONT_CACHE = 'chromanom-fonts-v1';

const ASSETS = [
  '/chromanom/',
  '/chromanom/index.html',
  '/chromanom/teoria.html',
  '/chromanom/grupos.html',
  '/chromanom/juego.html',
  '/chromanom/referencia.html',
  '/chromanom/manifest.json',
  '/chromanom/icons/icon-192.png',
  '/chromanom/icons/icon-512.png',
  '/chromanom/icons/icon-192-maskable.png',
  '/chromanom/icons/icon-512-maskable.png',
  '/chromanom/icons/icon-180.png',
  '/chromanom/pwa-install.js',
  '/chromanom/icons/logo.png',
  '/chromanom/icons/favicon-32.png',
  '/chromanom/icons/favicon-16.png',
  '/chromanom/favicon.ico'
];

// Instalar: guardar todos los archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar: borrar cachés antiguas (mantener fuentes)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE && k !== FONT_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: caché primero, red como respaldo
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // No interceptar requests a Google Apps Script (analytics)
  if (url.includes('script.google.com')) return;

  // Google Fonts: caché primero, luego red (stale-while-revalidate ligero)
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const networkFetch = fetch(e.request).then(response => {
            if (response && response.status === 200) {
              cache.put(e.request, response.clone());
            }
            return response;
          }).catch(() => cached); // sin red → devuelve caché aunque no esté
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Todo lo demás: caché primero, red como respaldo
  if (!url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
