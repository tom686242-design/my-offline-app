const CACHE_NAME = 'vault-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json'
];

// On install, save the core app structure
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// The "Interceptor" - This is what makes it work offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If we have it in cache, return it. Otherwise, fetch from web.
      return cachedResponse || fetch(event.request).then(response => {
        // Automatically save the new page we just fetched into the cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      // If internet is off and NOT in cache, you could return an offline.html here
    })
  );
});
