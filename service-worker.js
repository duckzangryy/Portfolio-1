// Service Worker for PWA and Performance Optimization
const CACHE_NAME = 'personal-website-v1.0.0';
const CACHE_VERSION = '1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/css/snow.css',
    '/assets/js/main.js',
    '/assets/js/snow.js',
    '/assets/js/music.js',
    '/assets/images/favicon.ico',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Quicksand:wght@400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// Install event - precache assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Precaching assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating version:', CACHE_VERSION);
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('[Service Worker] Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - cache-first strategy with network fallback
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Chrome extensions
    if (event.request.url.startsWith('chrome-extension://')) return;

    // Skip analytics and tracking
    if (event.request.url.includes('google-analytics') || 
        event.request.url.includes('gtag') ||
        event.request.url.includes('analytics')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached response if available
                if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        // Don't cache non-successful responses
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone the response for caching
                        const responseToCache = networkResponse.clone();

                        // Cache the new response
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                                console.log('[Service Worker] Caching new resource:', event.request.url);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('[Service Worker] Fetch failed:', error);
                        
                        // If offline and requesting HTML, show offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL)
                                .then(offlineResponse => offlineResponse || new Response('Offline'));
                        }
                        
                        // For other resources, return a fallback
                        if (event.request.destination === 'image') {
                            return new Response(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#666" font-family="Arial">Image</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        }
                        
                        return new Response('Network error', { status: 408 });
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-settings') {
        event.waitUntil(syncSettings());
    }
});

// Push notifications
self.addEventListener('push', event => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'Có thông báo mới từ trang web cá nhân',
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'explore',
                title: 'Xem ngay'
            },
            {
                action: 'close',
                title: 'Đóng'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Thông báo', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic background sync for updates
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-check') {
        event.waitUntil(checkForUpdates());
    }
});

// Helper functions
async function syncSettings() {
    // Sync user settings when back online
    console.log('[Service Worker] Syncing settings...');
    
    // This would sync with a backend in a real application
    // For now, just log the action
    return Promise.resolve();
}

async function checkForUpdates() {
    console.log('[Service Worker] Checking for updates...');
    
    try {
        const response = await fetch('/version.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Version check failed');
        
        const data = await response.json();
        
        if (data.version !== CACHE_VERSION) {
            console.log('[Service Worker] New version available:', data.version);
            
            // Notify clients about update
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'UPDATE_AVAILABLE',
                    version: data.version
                });
            });
        }
    } catch (error) {
        console.error('[Service Worker] Update check failed:', error);
    }
}

// Message handling from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME)
            .then(success => {
                console.log('[Service Worker] Cache cleared:', success);
                event.ports[0].postMessage({ success });
            });
    }
});

// Cache warming for critical assets
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'WARM_CACHE') {
        const urls = event.data.urls || PRECACHE_ASSETS;
        
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => {
                    return Promise.all(
                        urls.map(url => {
                            return fetch(url, { cache: 'reload' })
                                .then(response => {
                                    if (response.ok) {
                                        return cache.put(url, response);
                                    }
                                })
                                .catch(error => {
                                    console.error('[Service Worker] Cache warming failed for:', url, error);
                                });
                        })
                    );
                })
        );
    }
});

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        // Collect and report performance metrics
        const metrics = {
            timestamp: Date.now(),
            cacheHitRatio: calculateCacheHitRatio(),
            storageUsage: estimateStorageUsage()
        };
        
        event.ports[0].postMessage({ type: 'PERFORMANCE_METRICS', metrics });
    }
});

// Helper function to calculate cache hit ratio
async function calculateCacheHitRatio() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        return requests.length;
    } catch (error) {
        console.error('[Service Worker] Error calculating cache hit ratio:', error);
        return 0;
    }
}

// Helper function to estimate storage usage
async function estimateStorageUsage() {
    if (!navigator.storage || !navigator.storage.estimate) {
        return null;
    }
    
    try {
        const estimate = await navigator.storage.estimate();
        return {
            usage: estimate.usage,
            quota: estimate.quota,
            percentage: (estimate.usage / estimate.quota * 100).toFixed(2)
        };
    } catch (error) {
        console.error('[Service Worker] Error estimating storage:', error);
        return null;
    }
}