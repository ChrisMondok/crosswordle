const cacheName = 'v1';
const filesToCache = [
  './solutions',
  './words.json',
  './script.js',
  './stuff.js',
  './style.css',
];

self.addEventListener('install', e => {
  e.waitUntil(initializeCache());
});

async function initializeCache() {
  const cache = await caches.open('v1');
  await cache.addAll(filesToCache);
  console.log('added files to cache');
}

self.addEventListener("fetch", (e) => {
  e.respondWith(handleFetch(e));
});

async function handleFetch(e) {
  const r = await caches.match(e.request);
  if (r) {
    console.log(`Serving ${e.request.url} from cache`);
    return r;
  }
  const response = await fetch(e.request);
  if(response.ok) {
    const cache = await caches.open(cacheName);
    console.log(`Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
  } else {
    console.log(`Not caching ${r.request.url} because of error`);
  }
  return response;
}
