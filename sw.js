const CACHE_NAME='loss-adjuster-second-f6d6927260eb';
const FILES=['./index.html','./manifest.webmanifest','./app-icon.svg','./app-icon-192.png','./app-icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES.map(file=>new Request(new URL(file,self.location.href),{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('loss-adjuster-second-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy)));return response}
   return caches.match('./index.html').then(cached=>cached||response);
  }).catch(()=>caches.match('./index.html')));return;
 }
 const canonical=FILES.find(file=>new URL(file,self.location.href).pathname===new URL(event.request.url).pathname);
 if(canonical)event.respondWith(caches.match(new URL(canonical,self.location.href).href).then(cached=>cached||fetch(event.request)));
});
