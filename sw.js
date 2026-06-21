/* Reverse Raffle service worker — network-first.
   Online: always serve the freshest file (bypassing the browser cache).
   Offline: fall back to the last saved copy so the app still opens. */
var CACHE = "reverse-raffle";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  e.respondWith(
    fetch(req, req.mode === "navigate" ? { cache: "reload" } : {})
      .then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      })
      .catch(function () {
        return caches.match(req);
      })
  );
});
