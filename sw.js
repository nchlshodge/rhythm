// Bump this on every deploy that touches index.html — it's what forces
// already-cached visitors (this app is actively iterated on multiple times
// a day) off stale, possibly-vulnerable copies of the app shell.
const CACHE = 'rhythm-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // The app shell (the page itself) changes often and can carry fixes —
  // always prefer the network so a returning visitor never gets stuck on a
  // stale cached copy, only falling back to cache when actually offline.
  // Everything else (art, audio/video, JSON) is large and rarely changes,
  // so cache-first there still saves bandwidth without the staleness risk.
  const isAppShell = e.request.mode === 'navigate' || e.request.url.endsWith('/index.html');
  if (isAppShell) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => cached))
  );
});
