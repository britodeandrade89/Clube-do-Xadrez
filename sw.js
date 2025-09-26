// sw.js

// Nome do cache (você pode mudar a versão para forçar atualização)
const CACHE_NAME = 'chess-club-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  // Força o service worker a ativar imediatamente
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação: limpa caches antigos (opcional)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições para servir offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se encontrado no cache, retorna ele
        if (response) {
          return response;
        }
        // Senão, busca na rede
        return fetch(event.request).catch(() => {
          // Opcional: retornar uma página offline personalizada
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});
