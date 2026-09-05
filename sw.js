// ChromaNom Service Worker — v7.0
// Páginas HTML: red primero (siempre la versión más reciente si hay conexión).
// Assets estáticos (JS/CSS/íconos) y fuentes: stale-while-revalidate (rápido y se
// autoactualiza en segundo plano). Todo funciona offline como respaldo.

const CACHE = 'chromanom-v7';
const FONT_CACHE = 'chromanom-fonts-v1';

const ASSETS = [
  './',
  './index.html',
  './teoria.html',
  './grupos.html',
  './reacciones.html',
  './juego.html',
  './generador.html',
  './referencia.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  './pwa-install.js',
  './text-zoom.js'
];

// Instalar: guardar todos los archivos en caché.
// OJO: NO se llama self.skipWaiting() aquí. pwa-install.js muestra un banner
// "Nueva versión disponible" y solo llama skipWaiting() (vía postMessage,
// ver el listener 'message' más abajo) cuando el usuario pulsa "Actualizar".
// Antes se llamaba aquí de forma incondicional, así que el SW nuevo tomaba
// control solo, disparaba 'controllerchange' y forzaba location.reload() en
// pwa-install.js sin que nadie lo pidiera — si un estudiante estaba a mitad
// de una partida cuando se publicaba una versión nueva, la página se
// recargaba sola y perdía el progreso del ejercicio.
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

// Permite que pwa-install.js difiera la activación hasta que el usuario
// pulse "Actualizar" en el banner (worker.postMessage('SKIP_WAITING')).
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
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

// Fetch
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // No interceptar requests a Google Apps Script (analytics)
  if (url.includes('script.google.com')) return;

  // Google Fonts: stale-while-revalidate
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

  if (!url.startsWith(self.location.origin)) return;

  // Navegación a páginas HTML: red primero, para que los cambios recientes
  // lleguen de inmediato con conexión; si falla (sin red) usa el caché.
  const isNavigation = e.request.mode === 'navigate' ||
    (e.request.method === 'GET' && e.request.headers.get('accept')?.includes('text/html'));
  if (isNavigation) {
    e.respondWith(
      fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Todo lo demás (JS, CSS, íconos): stale-while-revalidate — responde rápido
  // desde caché y actualiza en segundo plano para la próxima visita.
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const networkFetch = fetch(e.request).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(e.request, response.clone());
          }
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});
