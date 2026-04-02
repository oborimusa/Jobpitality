// Service Worker for Jobpitality PWA
const CACHE_NAME = 'jobpitality-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/candidates-dashboard/index.html',
  '/candidates-dashboard/profile.html',
  '/candidates-dashboard/jobs.html',
  '/candidates-dashboard/saved-jobs.html',
  '/candidates-dashboard/applications.html',
  '/candidates-dashboard/interviews.html',
  '/resources/resume-builder.html',
  '/resources/interview-prep.html',
  '/resources/career-advice.html',
  '/super-admin/login.html',
  '/super-admin/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }
  
  // Skip API calls and external resources
  if (url.pathname.includes('/api/') || url.hostname.includes('firebase')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // For HTML pages - network first, fallback to cache
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the new version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, serve from cache or offline page
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) return cachedResponse;
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // For static assets - cache first, fallback to network
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          // Cache new assets
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
      .catch(() => {
        // For images, return a default image
        if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
          return caches.match('/icons/icon-192x192.png');
        }
        return new Response('Offline content not available', {
          status: 404,
          statusText: 'Not Found'
        });
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body || 'New opportunity available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'view', title: 'View Job' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Jobpitality', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        if (clientList.length > 0) {
          clientList[0].focus();
        } else {
          clients.openWindow('/');
        }
      })
    );
  }
});