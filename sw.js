/* PokeRogue · service worker (build bf2fc39584, v42.7) */
const V='pr-bf2fc39584',PRE=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "assets/00c5ea680bc3.webp", "assets/1280af6bc3f0.webp", "assets/193f71a0d3a2.jpg", "assets/3aa1a8624cee.webp", "assets/5ceccf7427f0.webp", "assets/6ab1838b27fc.webp", "assets/6e173d3806c7.jpg", "assets/73e3cc0d87e7.jpg", "assets/7929b41621fd.webp", "assets/82f6c51364cd.webp", "assets/c17af24a4066.webp"],IMG='pr-img-v1',MAXIMG=900;
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==IMG).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const trim=async()=>{const c=await caches.open(IMG),k=await c.keys();if(k.length>MAXIMG)for(const r of k.slice(0,k.length-MAXIMG))await c.delete(r)};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 /* la página: primero la red (así siempre ves la última versión) y, si no hay conexión, la copia guardada */
 if(r.mode==='navigate'||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){
  e.respondWith((async()=>{try{const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),6000);const n=await fetch(r,{signal:ctl.signal});clearTimeout(t);if(n.ok){const c=await caches.open(V);c.put('index.html',n.clone())}return n}catch(_){return(await caches.match('index.html'))||(await caches.match('./'))||Response.error()}})());return}
 /* archivos propios: caché primero */
 if(u.origin===location.origin){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(n=>{if(n.ok){const cl=n.clone();caches.open(V).then(c=>c.put(r,cl))}return n})));return}
 /* sprites de Pokémon y objetos: se guardan para que la próxima vez salgan al instante */
 if(r.destination==='image'||/\.(png|gif|webp|jpg|svg)$/i.test(u.pathname)&&/(githubusercontent|pokeapi|pokemondb|serebii)/.test(u.host)){
  e.respondWith(caches.open(IMG).then(async c=>{const h=await c.match(r);if(h)return h;try{const n=await fetch(r);if(n.ok||n.type==='opaque'){c.put(r,n.clone());if(Math.random()<.05)trim()}return n}catch(err){return h||Response.error()}}));return}});
