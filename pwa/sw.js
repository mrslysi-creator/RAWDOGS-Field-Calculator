const CACHE='rawdogs-field-calc-phone-b001';
const ASSETS=[
  './','./index.html','./manifest.webmanifest',
  './assets/rawdogs_icon.png','./assets/icon-192.png','./assets/icon-512.png',
  './assets/camo_blue.png','./assets/camo_green.png','./assets/camo_red.png',
  './weapons/l81.js','./weapons/sph2.js','./js/engine.js','./js/mobile-app.js'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    caches.match(event.request).then(hit=>hit||fetch(event.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});
