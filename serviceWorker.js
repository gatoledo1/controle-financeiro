const staticdata = "data-cache"
const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/scripts.js",
    "/icon/icon-money@1x.png",
    "/icon/icon-money@2x.png",
    "/icon/icon-money@3x.png",
    "/icon/icon-money@4x.png",
    "/icon/icon-money@5x.png",
    "/icon/icon-money@6x.png",
    "/icon/icon-money@7x.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticdata).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})