const VERSION = "static-v17";
const DYNAMIC_VERSION = "dynamic-v1";

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(VERSION).then((cache) => {
            cache.addAll([
                "/",
                "/index.html",
                "/offline.html",
                "/src/js/app.js",
                "/src/js/feed.js",
                "/src/js/promise.js",
                "/src/js/fetch.js",
                "/src/js/material.min.js",
                "/src/css/app.css",
                "/src/css/feed.css",
                "/src/images/main-image.jpg",
                "https://fonts.googleapis.com/css?family=Roboto:400,700",
                "https://fonts.googleapis.com/icon?family=Material+Icons",
                "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
            ]);
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== VERSION && key !== "dynamic") {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    let fetchUrl = "https://httpbin.org/get";

    if (event.request.url.indexOf(fetchUrl) > -1) {
        event.respondWith(
            caches.open(DYNAMIC_VERSION).then((cache) => {
                return fetch(event.request).then((response) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                console.log(
                    response == undefined
                        ? `Did not find ${event.request.url} in cache.`
                        : `Found ${event.request.url} in cache.`
                );
                if (response != undefined) {
                    return response;
                } else {
                    console.log(`Adding ${event.request.url} to cache.`);
                    return fetch(event.request)
                        .then((response) => {
                            caches.open("dynamic").then((cache) => {
                                cache.put(event.request.url, response.clone());
                                return response;
                            });
                        })
                        .catch((_) => {
                            return caches.open(VERSION).then((cache) => {
                                return cache
                                    .match("/offline.html")
                                    .then((response) => response);
                            });
                        });
                }
            })
        );
    }
});

// self.addEventListener("fetch", function (event) {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             console.log(
//                 response == undefined
//                     ? `Did not find ${event.request.url} in cache.`
//                     : `Found ${event.request.url} in cache.`
//             );
//             if (response != undefined) {
//                 return response;
//             } else {
//                 console.log(`Adding ${event.request.url} to cache.`);
//                 return fetch(event.request)
//                     .then((response) => {
//                         caches.open("dynamic").then((cache) => {
//                             cache.put(event.request.url, response.clone());
//                             return response;
//                         });
//                     })
//                     .catch((_) => {
//                         return caches.open(VERSION).then((cache) => {
//                             return cache
//                                 .match("/offline.html")
//                                 .then((response) => response);
//                         });
//                     });
//             }
//         })
//     );
// });
