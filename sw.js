// Service Worker for Roger's Restaurant - Performance Optimization
const CACHE_NAME = 'rogers-restaurant-v2';
const STATIC_CACHE = 'rogers-static-v2';
const DYNAMIC_CACHE = 'rogers-dynamic-v2';

// Files to cache immediately
const STATIC_ASSETS = [
    './',
    './rogers.html',
    './images/logo.jpg',
    './images/ovenwings.jpg',
    './images/pexels-zain-ali-549209752-27645103.jpg',
    './images/rogers1.mp4'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap',
    'https://unpkg.com/react@17/umd/react.production.min.js',
    'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return caches.open(DYNAMIC_CACHE);
            })
            .then((cache) => {
                console.log('Dynamic cache ready');
                return cache.addAll(EXTERNAL_RESOURCES);
            })
            .then(() => {
                console.log('External resources cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (url.origin === self.location.origin) {
        // Same-origin requests - try cache first
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(request)
                        .then((fetchResponse) => {
                            // Cache successful responses for future use
                            if (fetchResponse && fetchResponse.status === 200) {
                                const responseClone = fetchResponse.clone();
                                caches.open(DYNAMIC_CACHE)
                                    .then((cache) => {
                                        cache.put(request, responseClone);
                                    });
                            }
                            return fetchResponse;
                        });
                })
        );
    } else {
        // External requests (CDNs, fonts, etc.)
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(request)
                        .then((fetchResponse) => {
                            // Cache external resources
                            if (fetchResponse && fetchResponse.status === 200) {
                                const responseClone = fetchResponse.clone();
                                caches.open(DYNAMIC_CACHE)
                                    .then((cache) => {
                                        cache.put(request, responseClone);
                                    });
                            }
                            return fetchResponse;
                        })
                        .catch(() => {
                            // Return fallback for failed external requests
                            if (request.destination === 'image') {
                                return new Response('', { status: 404 });
                            }
                        });
                })
        );
    }
});

// Background sync for offline orders
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Get any pending orders from IndexedDB
        const pendingOrders = await getPendingOrders();
        if (pendingOrders.length > 0) {
            console.log('Processing pending orders:', pendingOrders.length);
            // Process pending orders when back online
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Helper function to get pending orders (placeholder)
async function getPendingOrders() {
    // This would integrate with your order management system
    return [];
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('Service Worker loaded successfully');
