const CACHE_NAME = "reinan-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json"
];

// instala e força ativação
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ativa imediatamente
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// estratégia offline-first
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;

        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // fallback offline
          return caches.match("/index.html");
        });
      })
  );
});
