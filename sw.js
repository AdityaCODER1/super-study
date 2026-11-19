/**
 * Super Study — Offline-First PWA Service Worker
 * Pre-caches the entire static app shell and NCERT reaction/question banks
 * for instant standalone Home Screen launch and 100% offline study support.
 */

const CACHE_NAME = 'super-study-pwa-v2';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/components/converter-view.js',
  './js/components/custom-studio.js',
  './js/components/drill-view.js',
  './js/components/gemini-quiz.js',
  './js/components/mechanism-player.js',
  './js/components/trends-view.js',
  './js/data/offline-questions.js',
  './js/data/reactions-class11.js',
  './js/data/reactions-class12.js',
  './js/data/subjects.js',
  './js/data/trends-reagents.js',
  './js/services/gemini.js',
  './js/services/markdown.js',
  './js/services/storage.js',
  './icons/icon.svg',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((staleKey) => caches.delete(staleKey))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache live Gemini API requests
  if (url.hostname.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // Same-origin navigation requests: serve cached index.html immediately if offline
  if (request.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((networkResp) => {
          if (networkResp && networkResp.ok) {
            const copy = networkResp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          }
          return networkResp;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // Same-origin static assets & Google Fonts: Stale-While-Revalidate
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFonts =
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isSameOrigin || isGoogleFonts) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              (networkResponse.status === 200 || networkResponse.type === 'opaque')
            ) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      })
    );
  }
});
