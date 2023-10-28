const STATIC_CACHE_NAME = 'static-file-v-1';
const DINAMIC_CACHES_NAME = 'dinamic-cache-name';
const ASSET_URLS = [];
self.addEventListener('install', async ()=>{
  try{
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.addAll(ASSET_URLS);
  }catch(err){
      console.log('Error: ', err)
  }
})

self.addEventListener('activate', async (event)=>{
const cacheNames = await caches.keys();
await Promise.all(
 cacheNames
     .filter(name=>name !== STATIC_CACHE_NAME)
     .filter(name=>name !== DINAMIC_CACHES_NAME)
     .map(name=>caches.delete(name))
)
  self.clients.claim()
})

self.addEventListener('fetch', async (event)=>{  
  const {request} = event;
  const url = new URL(request.url);
  if(request.method === 'GET'){
      if( url.pathname.split('.').pop() === 'woff2' || url.pathname.split('.').pop() === 'woff' || url.pathname.split('.').pop() === 'svg' || 
      url.pathname.split('.').pop() === 'png' || url.pathname.split('.').pop() === 'gif' || url.pathname.split('.').pop() === 'ico' || 
      url.pathname.split('.').pop() === 'jpeg' || url.pathname.split('.').pop() === 'jpg' 
      ){
          event.respondWith(cacheFirst(request));
      }
  }
})

async function cacheFirst(request){
  try{
      const cached = await caches.match(request);
      return cached ?? await networkFirst(request)
  }catch(err){console.log('Erroe: ',err)};
}

async function networkFirst(request){
  const cache = await caches.open(DINAMIC_CACHES_NAME);
  try{ 
      const response = await fetch(request)
      if(request.method !== "POST" && request.method !== "DELETE" ) await cache.put(request, response.clone())
      return response
  }
  catch(err){
      if(request.method !== "POST" && request.method !== "DELETE"){
          const cached = await cache.match(request);
          return cached ?? await caches.match('/offline.html');
      }else{
          return await fetch(request);
      }
  }
}