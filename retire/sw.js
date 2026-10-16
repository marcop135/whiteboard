// Self-retiring service worker for the old draw host (uploaded only by
// .github/workflows/retire-draw.yml). Installed PWAs keep serving their cached
// app shell and never see an HTTP redirect, so this worker replaces the old
// Workbox one: it takes over at once, deletes the caches, unregisters itself
// and sends every open window to the same path on the new host. Boards in
// IndexedDB are left untouched.
const TARGET_ORIGIN = "https://whiteboard.marcopontili.com";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      await Promise.all(
        windows.map((client) => {
          const url = new URL(client.url);
          return client.navigate(TARGET_ORIGIN + url.pathname + url.search + url.hash).catch(() => undefined);
        }),
      );
    })(),
  );
});
