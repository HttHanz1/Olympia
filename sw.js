const CACHE_NAME = 'olimpya-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon.svg'
];

// Kurulum (Install): Beklemeden yeni sürüme geç ve dosyaları iOS HTTP önbelleğini atlayarak kaydet
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const freshRequests = ASSETS_TO_CACHE.map(
        (url) => new Request(url, { cache: 'no-store' })
      );
      return cache.addAll(freshRequests);
    })
  );
});

// Etkinleştirme (Activate): Eski tüm önbellekleri temizle ve açık istemcileri hemen devral
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keyList) =>
        Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return null;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// İstemciden gelen manuel güncelleme mesajlarını dinle
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// İstek Yakalama (Fetch): iOS WebKit gizli HTTP önbelleğini atlayan Network-First (cache: "no-store")
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Dış API isteklerini (örn. dummyjson.com) önbelleğe hiç sokmadan doğrudan ağdan geçir
  if (requestUrl.origin !== self.location.origin) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }

  // Kendi uygulama dosyalarımız (index.html, style.css, script.js, manifest.json, icon.svg)
  // için her zaman sunucudan en taze dosyayı çek (cache: "no-store"), yalnızca internet yoksa önbellekten dön
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() =>
        caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html', { ignoreSearch: true });
          }
          return new Response('Çevrimdışı', {
            status: 503,
            statusText: 'Offline'
          });
        })
      )
  );
});
