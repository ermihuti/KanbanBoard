/// <reference lib="webworker" />
self.addEventListener("install", (event) => {
	console.log("Service Worker: Installed");
	event.waitUntil(
		caches.open("kanban-cache-v1").then((cache) => {
			return cache.addAll([
				"/",
				"/manifest.json",
                "/icons/icon-128x128.png",
				"/icons/icon-512x512.png"
			]);
		})
	);
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log("Service Worker: Activated");
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys
					.filter((key) => key !== "kanban-cache-v1")
					.map((key) => caches.delete(key))
			)
		)
	);
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			return (
				cachedResponse ||
				fetch(event.request).catch(() => {
					if (event.request.mode === "navigate") {
						return caches.match("/");
					}
				})
			);
		})
	);
});