const CACHE_NAME = 'vault-gaming-v1'; // Update this (v1, v2, v3) when you change code
const ASSETS = ['./', './index.html', './app.js', './manifest.json'];

self.addEventListener('install', (e) => {
  // skipWaiting forces this new service worker to become active immediately
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  // clients.claim ensures the new worker takes control of the page immediately
  e.waitUntil(self.clients.claim());
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(networkRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, networkRes.clone());
          return networkRes;
        });
      });
    })
  );
});
