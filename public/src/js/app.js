if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then(() => {});
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    return false;
});
