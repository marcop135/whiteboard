// Self-retiring stand-in for the old share-target-sw.js on the draw host
// (uploaded only by .github/workflows/retire-draw.yml). The old Workbox sw.js
// imported this file, so a changed copy also triggers the worker update. It
// does the same as retire/sw.js: take over, delete caches, unregister, and
// send open windows to the same path on the new host. Boards in IndexedDB are
// left untouched.
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
