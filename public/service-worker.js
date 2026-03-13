self.addEventListener("install", () => {
  console.log("Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service Worker activado");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("spelling-cache").then((cache) =>
      cache.match(event.request).then((resp) => {
        return (
          resp ||
          fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      })
    )
  );
});
