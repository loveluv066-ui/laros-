/* La Rose service worker: works offline. Bump VERSION when index.html changes. */
var VERSION='larose-v6';
var CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(hit){
    var net=fetch(e.request).then(function(res){
      if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(VERSION).then(function(c){c.put(e.request,cp)})}
      return res}).catch(function(){return hit});
    return hit||net;
  }));
});
