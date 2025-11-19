const versao = '0.0.0';
const arquivos = [
    'favicon.ico',
    'offline.html',
    'img/aviso.png',

    'img/icon_16.png',
    'img/icon_32.png',
    'img/icon_57.png',
    'img/icon_60.png',
    'img/icon_72.png',
    'img/icon_76.png',
    'img/icon_96.png',
    'img/icon_114.png',
    'img/icon_120.png',
    'img/icon_128.png',
    'img/icon_144.png',
    'img/icon_152.png',
    'img/icon_180.png',
    'img/icon_192.png',
    'img/icon_256.png',
    'img/icon_384.png',
    'img/icon_512.png',
    'img/screenshot.webp'
];

self.addEventListener('install', event => {
    //console.log('SW: install');
    event.waitUntil(
        caches.open(versao).then(cache => {
            cache.addAll(arquivos);
        }).then(event => {
            self.skipWaiting();
        })
    );
});

self.addEventListener('activate', event => {
    //console.log('SW: activate');
    event.waitUntil(
        caches.keys().then(versoes => {
            return Promise.all(versoes.map(versaoAntiga => {
                if(versaoAntiga !== versao) {
                    console.log(`SW: apagou a versão ${versaoAntiga}`);
                    return caches.delete(versaoAntiga);
                }
            }));
        })
    );
});

 self.addEventListener('fetch', event => {
    //console.log("SW: fetch", event.request.url);
    event.respondWith(
        (async () => {
            const cache = await caches.open(versao);
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            } else {
                try {
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    return "offline.html";
                }
            }
        })()
    );
});
