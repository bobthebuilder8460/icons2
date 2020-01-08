"use strict";

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  "/index.html",
  "/client.js",
  "/style.css",
  "install.js",
  "/addserviceworker.js",
  "/manifest.json",
  "/images/favicon.ico"
];

/* Providing a cache name, allows us to version files so we
 *can easily update some files w/o affecting other. Change
 *the cache name any time any of the cached files have changed.
 */
const CACHE_NAME = "static-cache-v11";
const DATA_CACHE_NAME = "data-cache-v12";

/* Adds an install event to the page that caches offline resources. */
self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");

  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  console.log("[ServiceWorker] Activate");

  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  console.log("[ServiceWorker] Fetch", evt.request.url);
  if (evt.request.url.includes("/api/")) {
    console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      })
    );
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});
