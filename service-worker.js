self.addEventListener('install', function() {});
self.addEventListener('fetch', (event) => {
	/**@type {Request} */
	const request = event.request;
	// Let the browser do its default thing
	// for non-GET requests.
	if (request.method !== 'GET') return;
	// Prevent the default, and handle the request ourselves.
	event.respondWith(
		(async () => {
			// Try to get the response from a cache.
			const cache = await caches.open('qwq');
			const cachedResponse = await cache.match(request);
			if (cachedResponse) {
				// If we found a match in the cache, return it, but also
				// update the entry in the cache in the background.
				event.waitUntil(cache.add(request));
				return cachedResponse;
			} else {
				const reg = /assets|jsdelivr|baomitu|googleapis|loli/;
				// If we didn't find a match in the cache, use the network.
				const response = await fetch(request);
				if (response.ok && reg.test(request.url)) event.waitUntil(cache.put(request, response.clone()));
				return response;
			}
		})());
});