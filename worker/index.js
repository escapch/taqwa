// Custom Service Worker additions for Taqwa PWA
// This file is merged by next-pwa into the generated service worker

self.addEventListener('install', () => {
    console.log('[SW] Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activated');
    event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
    if (!event.data) return;

    let payload;
    try {
        payload = event.data.json();
    } catch {
        payload = { title: 'Taqwa', body: event.data.text() };
    }

    const title = payload.title || 'Taqwa';
    const options = {
        body: payload.body || '',
        icon: '/192x192.png',
        badge: '/192x192.png',
        data: payload.data || {},
        vibrate: [200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = self.location.origin + '/';

    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                for (const client of windowClients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
