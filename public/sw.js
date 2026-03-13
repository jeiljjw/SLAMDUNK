const CACHE_NAME = 'slam-dunk-cache-v2';

// index.html은 캐시에서 제외 (항상 최신 버전 로드)
const NO_CACHE_URLS = ['/', '/index.html'];

const urlsToCache = [
  '/css/styles.css',
  '/js/main.js',
  '/public/manifest.json',
];

// Install event - cache static assets only
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // index.html은 항상 네트워크에서 가져오고 캐시하지 않음
  if (NO_CACHE_URLS.includes(url.pathname) || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 나머지 정적 자산: 네트워크 우선, 실패 시 캐시
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});