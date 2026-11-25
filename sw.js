const C='f22p4-v612';
const CORE=['./','index.html','manifest.webmanifest','icon-192-2.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
/* 先用快取立即開啟 (平面圖圖檔永遠先取快取)，網頁本身於背景更新，下次開啟即為新版 */
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const isImg=/\/plans\//.test(r.url);
  e.respondWith(caches.open(C).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>hit);
    return hit&&isImg?hit:(hit||net);
  })));
  if(!isImg)e.waitUntil(Promise.resolve());
});
