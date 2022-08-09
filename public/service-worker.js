self.addEventListener("install", (event) => {});

self.addEventListener("activate", (event) => {
    return self.clients.claim();
});
