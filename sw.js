// Orange Trail: Offline-Betrieb und Installierbarkeit.
// Seiten: zuerst das Netz (frisch), bei langsamem oder fehlendem Netz die zuletzt gespeicherte Version.
const CACHE = "satsland-v156";
const PAGES = ["./ableitung/", "./adressen/", "./bahnhof/", "./besitzer/", "./betrug/", "./blockchain/", "./cantillon/", "./datenschutz/", "./doppelt/", "./eigenschaften/", "./entropie/", "./fomo/", "./geld/", "./geldgeschichte/", "./geldschoepfung/", "./geschichte/", "./halving/", "./hashing/", "./hebel/", "./inflation/", "./kaufen/", "./knappheit/", "./konsens/", "./kritik/", "./krypto/", "./kurven/", "./lexikon/", "./lightning/", "./merkle/", "./mining/", "./mythen/", "./nodes/", "./privatsphaere/", "./quanten/", "./reise/", "./risiken/", "./schluessel/", "./script/", "./seed/", "./senden/", "./sha256/", "./signaturen/", "./sparplan/", "./start/", "./ueber/", "./utxo/", "./wallets/", "./wert/", "./whitepaper/", "./zyklen/"];   // alle Level-Seiten: nach dem ersten Besuch im Hintergrund gespeichert
const CORE = ["./", "./index.html", "./404.html", "./lern.js?v=70", "./lern.css?v=57", "./bitlib.js?v=24", "./icon-192.png", "./icon-512.png", "./icon.svg", "./manifest.webmanifest"];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))));
});
// Alte Caches löschen, damit keine veralteten Seiten übrig bleiben
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())
    .then(() => { caches.open(CACHE).then(c => PAGES.reduce((q, u) => q.then(() => c.match(u).then(m => m || c.add(u).catch(() => {}))), Promise.resolve())); })   // nacheinander, ohne zu bremsen
));
// Notfall-Seite, falls eine Seite offline noch nicht gespeichert ist
const OFF = `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline · Orange Trail</title>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0f2a;color:#eef0ff;font:16px/1.5 system-ui,sans-serif;text-align:center;padding:24px">
<div><div style="font-size:56px">📡</div><h1 style="font-size:24px;margin:8px 0">Gerade offline</h1><p style="color:#aab2d8;max-width:320px">Diese Seite ist noch nicht auf deinem Gerät gespeichert. Sobald du wieder Netz hast, geht's weiter.</p>
<p><a href="/" style="display:inline-block;margin-top:8px;padding:12px 20px;border-radius:14px;background:#f7931a;color:#0d1230;font-weight:800;text-decoration:none">Zur Startseite</a></p></div></body></html>`;
self.addEventListener("fetch", e => {
  const req = e.request, nav = req.mode === "navigate";
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const net = (nav ? fetch(req.url, {cache: "no-cache", credentials: "same-origin"}) : fetch(req, {cache: "no-cache"}))
    .then(r => { if (r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; });
  const cached = () => caches.match(req).then(r => r || (nav ? new Response(OFF, {headers: {"Content-Type": "text/html; charset=utf-8"}}) : undefined));
  // Schlechtes Netz: nach 4 Sekunden die gespeicherte Version zeigen (falls vorhanden), das Netz lädt im Hintergrund weiter
  const slow = new Promise(res => setTimeout(() => cached().then(r => r && res(r)), 4000));
  e.respondWith(Promise.race([net.catch(() => cached().then(r => r || Response.error())), slow]));
});
