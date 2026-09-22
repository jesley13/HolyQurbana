const CACHE_NAME = 'holy-qurbana-v8';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './mass-data.js',
    './readings.js',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './manifest.json'
];

self.addEventListener('install', event => {
    // Skip waiting to immediately activate the new service worker
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // We wrap this in a try-catch equivalent so it doesn't fail the install
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn('PWA cache addAll failed, but continuing install:', err);
            });
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                if (response) {
                    return response;
                }
                // Clone the request because it's a one-time use stream
                const fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    response => {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Clone the response because it's a one-time use stream
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});
