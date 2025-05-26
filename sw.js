const CACHE_NAME = 'gorev-defteri-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
 
// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});
 
// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache'de varsa cache'den döndür
        if (response) {
          return response;
        }
        
        // Yoksa network'ten al
        return fetch(event.request).then(
          (response) => {
            // Geçerli response değilse cache'leme
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
 
            // Response'u klonla
            const responseToCache = response.clone();
 
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
 
            return response;
          }
        );
      })
      .catch(() => {
        // Offline iken fallback sayfası
        return caches.match('./index.html');
      })
  );
});
 
// Activate event - eski cache'leri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
 
// Background sync desteği
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Offline'da yapılan değişiklikleri senkronize et
      console.log('Background sync çalışıyor')
    );
  }
});
