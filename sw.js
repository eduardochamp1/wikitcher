// Service worker: deixa o codex funcionar sem internet.
// Arquivos do próprio site: rede primeiro (as edições aparecem logo) e cópia guardada se estiver offline.
// Arquivos de fora (React do CDN, fontes do Google): cópia guardada primeiro, rede para completar.
const VERSAO = 'codex-v1';
const ARQUIVOS = ['Wiki The Witcher.dc.html', 'support.js', 'witcher-app.js', 'witcher-tempo.js', 'witcher-verbetes.js', 'witcher-glossario.js',
  'witcher-wiki-dados.js', 'witcher-extras.js', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png'].map(encodeURI);

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.pathname.endsWith('/__mudou')) return;
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(req).then(guardado => guardado || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copia = res.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); }
    return res;
  })));
});
