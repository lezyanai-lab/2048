const CACHE = '2048-v2';
const ASSETS = [
  './', './index.html', './manifest.json', './style/main.css',
  './style/fonts/clear-sans.css',
  './style/fonts/ClearSans-Regular-webfont.woff',
  './style/fonts/ClearSans-Light-webfont.woff',
  './style/fonts/ClearSans-Bold-webfont.woff',
  './js/bind_polyfill.js', './js/classlist_polyfill.js', './js/animframe_polyfill.js',
  './js/keyboard_input_manager.js', './js/html_actuator.js', './js/grid.js',
  './js/tile.js', './js/local_storage_manager.js', './js/game_manager.js',
  './js/application.js', './icon-192.png', './icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// Network first (always fresh code), fall back to cache when offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
