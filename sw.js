/**
 * Super Study — Offline-First PWA Service Worker
 * Pre-caches the entire static app shell and NCERT reaction/question banks
 * for instant standalone Home Screen launch and 100% offline study support.
 */

const CACHE_NAME = 'super-study-pwa-v4';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/runtime-config.js',
  './js/components/biology-doubt-qa-view.js',
  './js/components/biology-reader-view.js',
  './js/components/biology-revision-view.js',
  './js/components/biology-setups-view.js',
  './js/components/converter-view.js',
  './js/components/custom-studio.js',
  './js/components/drill-view.js',
  './js/components/gemini-quiz.js',
  './js/components/mechanism-player.js',
  './js/components/nta-cbt-view.js',
  './js/components/pdf-crop-modal.js',
  './js/components/trends-view.js',
  './js/data/abhyas-bank.js',
  './js/data/biology-ncert-data.js',
  './js/data/neet-papers.js',
  './js/data/neet-syllabus.js',
  './js/data/offline-questions.js',
  './js/data/pyq-bank.js',
  './js/data/reactions-class11.js',
  './js/data/reactions-class12.js',
  './js/data/subjects.js',
  './js/data/trends-reagents.js',
  './js/services/cbt-storage.js',
  './js/services/gemini.js',
  './js/services/markdown.js',
  './js/services/pdf-parser.js',
  './js/services/storage.js',
  './js/vendor/pdf.min.mjs',
  './js/vendor/pdf.worker.min.mjs',
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

  // Same-origin static assets, Google Fonts, KaTeX/PDF.js CDN, and HF Paper Images: Stale-While-Revalidate
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFonts =
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');
  const isCdnAsset = url.hostname.includes('cdn.jsdelivr.net');

  if (isSameOrigin || isGoogleFonts || isCdnAsset) {
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
          .catch(() => cachedResponse || Response.error());

        return cachedResponse || networkFetch;
      })
    );
  }
});
