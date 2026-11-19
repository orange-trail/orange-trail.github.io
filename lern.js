/* =====================================================================
   Gemeinsame Helfer aller Lernwelten: Lernpfad, Quiz, Fortschritt.
   Der Fortschritt bleibt nur im eigenen Browser (localStorage), ohne Konto.
   ===================================================================== */
const Lern = (() => {
  const KEY = "bvb-lernen";
  // ---------- Live-Daten: eine eigene Quelle für alles (Satsea-Node + Kurs), Pfade wie bei mempool.space ----------
  // DATA leer = Entwicklungsmodus mit öffentlichen Quellen. Vor dem Start die eigene Adresse eintragen (siehe node/ANLEITUNG.md).
  // Ohne eigene Quelle (DATA leer): feste Werte mit Stand-Datum, kein einziger fremder Dienst wird abgefragt.
  // Netzwerk-Werte (Blöcke, Gebühren …) laufen dann als Schätzung bzw. Simulation der jeweiligen Seite.
  // Monatlich aktualisieren: STAND und SNAP anpassen.
  const DATA = "", DSTAND = "15.11.2026";
  const SNAP = {"price/BTC-USD": {data: {amount: "64800", currency: "USD"}}, "price/BTC-EUR": {data: {amount: "58800", currency: "EUR"}},
    "v1/prices": {time: 1794700800, USD: 64800, EUR: 58800}, "global": {data: {active_cryptocurrencies: 15000, market_cap_percentage: {btc: 58.8}}}};
  // Blockhöhe ohne Live-Daten: hochgerechnet ab einem echten Ankerblock (976.097 am 16.11.2026, 08:16 UTC), im Schnitt 597 s pro Block (Mittel seit dem Halving 2024)
  const heightF = () => 976097 + (Date.now()/1000 - 1794816960)/597, height = () => Math.floor(heightF());   // heightF: mit Nachkommastellen (Fortschritt zum nächsten Block)
  // Kurs bleibt fester Monatswert, auch mit eigener Node (Live-Kurs nur mit Lizenz, dann LIVE_KURS = true)
  const LIVE_KURS = false; let usedLive = false;   // usedLive: hat diese Seite echte Node-Daten geholt?
  const api = p => SNAP[p] && !(DATA && LIVE_KURS) ? "data:application/json," + encodeURIComponent(JSON.stringify(SNAP[p])) : DATA ? (usedLive = true, DATA + p) : p === "blocks/tip/height" ? "data:text/plain," + height() : SNAP[p] ? "data:application/json," + encodeURIComponent(JSON.stringify(SNAP[p])) : "satsland-offline:" + p;
  // Abgeschaltete Abrufe leise ablehnen (die Seiten zeigen dann Schätzung bzw. Beispielwerte), ohne Fehlermeldungen in der Konsole
  if (!DATA){ const f0 = window.fetch.bind(window); window.fetch = (u, o) => typeof u === "string" && u.startsWith("satsland-offline:") ? Promise.reject(new TypeError("Festwert-Modus")) : f0(u, o); }
  // Festwerte ehrlich kennzeichnen: „Live“ wird zu „Stand …“
  document.addEventListener("DOMContentLoaded", () => new MutationObserver(ms => ms.forEach(m => { const e = m.target.nodeType === 1 ? m.target : m.target.parentElement;
    if (e && e.classList && e.classList.contains("mode") && e.textContent === "Live" && !usedLive){ e.textContent = "Stand " + DSTAND; e.classList.remove("live"); e.classList.add("stand"); } }))
    .observe(document.body, {subtree: true, childList: true, characterData: true}));
  // Empfohlene Reihenfolge für Einsteiger: [id, Titel, Pfad]
  // Kapitel für Einsteiger: [Symbol, Titel, Kurzbeschreibung, Welten in Reihenfolge]
  const CHAPTERS = [
    ["🏦", "Geld verstehen", "Was Geld ist, woher es kommt und warum es an Wert verliert.", ["geld", "geldgeschichte", "geldschoepfung", "cantillon", "inflation"]],
    ["🌱", "Warum Bitcoin?", "Das Kopier-Problem, gutes Geld, Knappheit und wie alles anfing.", ["start", "doppelt", "eigenschaften", "knappheit", "wert", "geschichte"]],
    ["⚙️", "So funktioniert Bitcoin", "Das große Ganze: Blöcke, Mining, Halving und wer alles prüft.", ["hashing", "blockchain", "mining", "halving", "nodes", "konsens"]],
    ["🛡️", "Sicher starten", "Bevor du Bitcoin kaufst: Schlüssel, Wallet, Seed, Betrug und echte Risiken.", ["schluessel", "wallets", "seed", "betrug", "krypto", "risiken"]],
    ["💸", "Bezahlen & Senden", "Wie eine Zahlung wirklich abläuft, schnell und günstig.", ["utxo", "senden", "bahnhof", "lightning", "privatsphaere", "reise"]],
    ["🧠", "Klug handeln", "Richtig kaufen, Sparplan statt Bauchgefühl, Finger weg vom Hebel und Mythen durchschauen.", ["kaufen", "sparplan", "zyklen", "fomo", "hebel", "besitzer", "mythen", "kritik"]]
  ];
  // Profi-Pfade: Vertiefungen je Kapitel (Index wie CHAPTERS), freigeschaltet nach dem Kapitel-Boss. Zählen nicht für Level.
  const PRO = [["hyperinflation", "goldstandard"], ["vorlaeufer", "satoshi"], ["whitepaper", "sha256", "kurven", "signaturen", "adressen", "merkle", "script", "quanten"], ["entropie", "ableitung", "krimis"], ["blockbau", "lnnetz", "offline"], ["psycho"]];
  const proOf = id => PRO.findIndex(c => c.includes(id));
  // Lernpfad = alle Welten in Kapitel-Reihenfolge: [id, Titel, Pfad]
  const TITLES = {geld: ["Tausch-Insel", "geld/"], geldgeschichte: ["Geld-Zeitreise", "geldgeschichte/"], geldschoepfung: ["Geld-Maschine", "geldschoepfung/"], cantillon: ["Geldfluss", "cantillon/"], knappheit: ["Knappheits-Messer", "knappheit/"], doppelt: ["Kopier-Problem", "doppelt/"], wert: ["Wert-Waage", "wert/"], risiken: ["Risiko-Radar", "risiken/"], reise: ["Reise einer Zahlung", "reise/"], eigenschaften: ["Geld-Duell", "eigenschaften/"], inflation: ["Geld & Inflation", "inflation/"], halving: ["Knappheit & Halving", "halving/"], geschichte: ["Zeitreise", "geschichte/"], wallets: ["Wallet-Check", "wallets/"], seed: ["Seed-Trainer", "seed/"], senden: ["Senden & Empfangen", "senden/"], betrug: ["Betrug erkennen", "betrug/"], krypto: ["Coin-Check", "krypto/"], sparplan: ["Sparplan", "sparplan/"], fomo: ["Gefühls-Achterbahn", "fomo/"], hebel: ["Hebel-Falle", "hebel/"], utxo: ["Wechselgeld-Kasse", "utxo/"], bahnhof: ["Mempool-Bahnhof", "bahnhof/"], lightning: ["Lightning", "lightning/"], hashing: ["Fingerabdruck-Maschine", "hashing/"], schluessel: ["Schlüssel-Labor", "schluessel/"], blockchain: ["Blockchain", "blockchain/"], mining: ["Mining-Werkstatt", "mining/"], nodes: ["Node-Wache", "nodes/"], entropie: ["Würfel-Seed", "entropie/"], ableitung: ["Seed-Fabrik", "ableitung/"], sha256: ["SHA-256 von innen", "sha256/"], kurven: ["Kurven-Labor", "kurven/"], signaturen: ["Signatur-Duell", "signaturen/"], adressen: ["Adress-Zoo", "adressen/"], merkle: ["Merkle-Baum", "merkle/"], blockbau: ["Bau deinen Block", "blockbau/"], hyperinflation: ["Hyperinflation-Akte", "hyperinflation/"], goldstandard: ["Vom Gold zum Papier", "goldstandard/"], vorlaeufer: ["Die Vorläufer", "vorlaeufer/"], krimis: ["Bitcoin-Krimis", "krimis/"], satoshi: ["Wer ist Satoshi?", "satoshi/"], offline: ["Bitcoin ohne Internet", "offline/"], psycho: ["Psychologie-Labor", "psycho/"], lnnetz: ["Lightning unter der Haube", "lnnetz/"], quanten: ["Quanten-Check", "quanten/"], kaufen: ["Erster Kauf", "kaufen/"], mythen: ["Mythen-Check", "mythen/"], kritik: ["Kritik-Check", "kritik/"], privatsphaere: ["Spuren-Detektiv", "privatsphaere/"], script: ["Script-Labor", "script/"], zyklen: ["Kurs-Achterbahn", "zyklen/"], besitzer: ["Wem gehört Bitcoin?", "besitzer/"], start: ["Bitcoin in 5 Minuten", "start/"], konsens: ["Einigungs-Labor", "konsens/"], whitepaper: ["Whitepaper-Tour", "whitepaper/"]};
  const PATH = CHAPTERS.flatMap(c => c[3].map(id => [id, ...TITLES[id]]));
  const chapterOf = id => CHAPTERS.findIndex(c => c[3].includes(id));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } };
  const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e){} };
  const done = (s, id) => !!(s[id] && s[id].quiz);
  // Seite als besucht merken
  function visit(id){ const s = load(); s[id] = Object.assign({}, s[id], {seen: Date.now()}); save(s); }
  // Nächste empfohlene Welt (erste noch nicht abgeschlossene, außer der aktuellen)
  // Nächster Schritt im Lernpfad: Welten in Kapitel-Reihenfolge, nach jedem fertigen Kapitel dessen Boss.
  // Gesucht wird ab der aktuellen Welt vorwärts (danach von vorn); Bosse zählen erst, wenn ihr Kapitel komplett ist.
  function nextStep(id){
    const s = load(), won = bossWon(), seq = [];
    CHAPTERS.forEach((c, k) => { c[3].forEach(w => seq.push({w})); seq.push({b: k}); });
    const open = it => it.w ? !done(s, it.w) : !won[it.b] && CHAPTERS[it.b][3].every(w => done(s, w));
    const start = seq.findIndex(it => it.w === id);
    for (let n = 1; n <= seq.length; n++){ const it = seq[(start + n + seq.length) % seq.length]; if (it.w !== id && open(it)) return it; }
    return null;
  }
  function nextAfter(id){ const it = nextStep(id); return it && it.w ? PATH.find(p => p[0] === it.w) : null; }
  // Quiz bauen: QUIZ = [[Frage, [Antworten], Index richtig, Erklärung], ...]
  function quiz(box, id, QUIZ, root){
    const answered = {}; let finished = false;
    QUIZ.forEach(([q, opts, ok, why], qi) => {
      // Antworten in zufälliger Reihenfolge, damit die richtige nicht immer an derselben Stelle steht
      const d = document.createElement("div"); d.className = "q";
      d.innerHTML = `<p>${qi + 1}. ${q}</p><div class="opts">${opts.map((o, i) => [Math.random(), i, o]).sort((a, b) => a[0] - b[0]).map(([, i, o]) => `<button type="button" data-i="${i}">${o}</button>`).join("")}</div><p class="why" hidden></p>`;
      d.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
        const i = +b.dataset.i;
        d.querySelectorAll("button").forEach(x => { x.classList.remove("ok", "no"); if (+x.dataset.i === ok) x.classList.add("ok"); });
        if (i !== ok) b.classList.add("no");
        const w = d.querySelector(".why"); w.hidden = false; w.textContent = (i === ok ? "Richtig! " : "Nicht ganz. ") + why;
        sfx(i === ok ? "ok" : "no");
        if (!(qi in answered)){ answered[qi] = i === ok; say(i === ok ? pickOne(PRAISE) : pickOne(OOPS), 3500); repAdd(id, qi, QUIZ[qi], i === ok); }
        if (Object.keys(answered).length === QUIZ.length && !finished){ finished = true; finish(); }
      }));
      box.appendChild(d);
    });
    const res = document.createElement("p"); res.className = "res"; res.hidden = true; box.appendChild(res);
    function finish(){
      const right = Object.values(answered).filter(Boolean).length, s = load(), before = level(count(s)), first = !done(s, id);
      s[id] = Object.assign({}, s[id], {quiz: Math.max(right, (s[id] && s[id].quiz) || 0), total: QUIZ.length}); save(s);
      const after = level(count(s));
      res.hidden = false; res.textContent = `${"⭐".repeat(right)}${"☆".repeat(QUIZ.length - right)}  ${right} von ${QUIZ.length} richtig. ${done(load(), id) ? "✓ Dieses Level ist in deinem Lernpfad abgehakt." : "Ab 1 richtigen Antwort ist das Level abgehakt."}`;
      if (new Date().getHours() < 4){ const tt = tget(); tt.owl = 1; tset(tt); }
      badge(); renderNext(id, root); titles();
      setTimeout(() => lvDone(right, QUIZ.length, first, after.name !== before.name ? after : null, after), 700);
    }
  }
  // "Weiter mit …"-Karte am Seitenende
  function renderNext(id, root = ""){
    const el = document.getElementById("next"); if (!el) return;
    const pk = proOf(id);
    if (pk >= 0){ const s = load(), L = PRO[pk], nx = L.slice(L.indexOf(id) + 1).concat(L.slice(0, L.indexOf(id))).find(w => !done(s, w));
      el.innerHTML = nx ? `<span class="muted">🔬 Profi-Pfad, weiter mit</span><b>${TITLES[nx][0]}</b><a href="${root}${TITLES[nx][1]}">Los geht's →</a>`
        : !done(s, id) ? `<span class="muted">🔬 Profi-Pfad</span><b>Mach noch das Quiz „Teste dich“, dann ist dieser Profi-Pfad geschafft!</b><a href="${root}#pro${pk + 1}">Zur Übersicht →</a>`
        : `<span class="muted">🔬 Profi-Pfad</span><b>Alle Vertiefungen dieser Welt geschafft!</b><a href="${root}#pro${pk + 1}">Zur Übersicht →</a>`; return; }
    const it = nextStep(id), n = it && it.w ? PATH.find(p => p[0] === it.w) : null;
    el.innerHTML = n ? `<span class="muted">Empfohlen als Nächstes</span><b>${n[1]}</b><a href="${root}${n[2]}">Los geht's →</a>`
      : it ? `<span class="muted">Welt ${it.b + 1} geschafft! Jetzt wartet</span><b>⚔️ ${bossName(it.b)}</b><a href="${root}#boss${it.b + 1}">Zum Boss-Kampf →</a>`
      : `<b>🏆 Alles geschafft, alle Bosse besiegt!</b><a href="${root}">Zur Übersicht →</a>`;
  }


  // ---------- Comic-Zeichnungen (gemeinsam für Szenen, Karten und Satoshi) ----------
  // Comic-Zeichnungen im Satsea-Stil: dicke dunkle Kontur, flache Farben, Glanzpunkt. viewBox 0 0 100 100
  const SK = 'stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
  const hl = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45"/>`;
  // Helfer für die Boss-Grafiken (Glüh-Augen, Geldscheine)
  const S2 = 'stroke="#0d1230" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
  const glow = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r*2.2}" fill="${c}" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const bill = (x, y, rot) => `<g transform="rotate(${rot} ${x + 11} ${y + 6})"><rect x="${x}" y="${y}" width="22" height="12" rx="2" fill="#7fd68f" ${S2}/><text x="${x + 11}" y="${y + 9.5}" font-size="8.5" font-weight="900" text-anchor="middle" fill="#0d1230" font-family="Arial">€</text></g>`;
  const coinP = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffc94d" ${SK}/><circle cx="${cx}" cy="${cy}" r="${r*.72}" fill="none" stroke="#e0a000" stroke-width="3"/><text x="${cx}" y="${cy + r*.36}" font-size="${r}" font-weight="900" text-anchor="middle" fill="#b86e00" font-family="Arial">₿</text>${hl(cx - r*.35, cy - r*.45, r*.3, r*.14)}`;
  const tn = (d, c) => `<path d="${d}" fill="none" stroke="#0d1230" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
  const ART = {
    // Meeres-Bosse
    squid: `<g class="ba-fl">${bill(4, 10, -20)}</g><g class="ba-fl d2">${bill(74, 6, 18)}</g><g class="ba-wig">${tn("M40 64Q30 80 18 80Q8 79 12 70", "#d86ae8")}${tn("M45 67Q42 84 32 94", "#d86ae8")}${tn("M55 67Q58 84 68 94", "#d86ae8")}${tn("M60 64Q70 78 80 74", "#d86ae8")}</g><g class="ba-fl d3">${bill(74, 64, -10)}</g><path d="M50 6C64 14 70 30 68 50Q66 62 50 64Q34 62 32 50C30 30 36 14 50 6z" fill="#c04fd6" ${SK}/><path d="M50 6l-18 16 4 6zM50 6l18 16-4 6z" fill="#a23ab8" ${SK}/>${hl(42, 22, 5, 3)}<circle cx="42" cy="46" r="7" fill="#fff" ${S2}/><circle cx="58" cy="46" r="7" fill="#fff" ${S2}/><circle cx="43" cy="47" r="3" fill="#0d1230"/><circle cx="57" cy="47" r="3" fill="#0d1230"/><path d="M34 37l12 5M66 37l-12 5" stroke="#0d1230" stroke-width="3.5" stroke-linecap="round"/><path d="M43 56q7 5 14 0" fill="#5a1a6a" ${S2}/><circle cx="22" cy="40" r="3" fill="#0d1230" opacity=".7"/><circle cx="16" cy="48" r="2" fill="#0d1230" opacity=".5"/><circle cx="80" cy="40" r="2.5" fill="#0d1230" opacity=".6"/>`,
    shipg: `${(() => { const ship = `<path d="M12 64h76l-11 18H23z" fill="#9fb6d8" ${SK}/><path d="M50 12v52" stroke="#0d1230" stroke-width="4"/><path d="M53 16h24l-3 12 4 5-5 4 3 7-4 4 2 8H53z" fill="#eaf3ff" ${S2}/><path d="M47 20H28l3 10-4 5 4 5-3 6 4 5-2 5h17z" fill="#eaf3ff" ${S2}/><path d="M50 12l14 4-14 4z" fill="#ff5c73" ${S2}/>${glow(32, 72, 2.6, "#7fffd4")}${glow(50, 72, 2.6, "#7fffd4")}${glow(68, 72, 2.6, "#7fffd4")}`; return `<g class="ba-flk"><g opacity=".4" transform="translate(9 -7)">${ship}</g></g>${ship}`; })()}<path d="M2 86q8-6 16 0t16 0 16 0 16 0 16 0 16 0v12H2z" fill="#4aa3df" ${SK}/>${coinP(30, 56, 7)}<g class="ba-flk d2"><g opacity=".5">${coinP(38, 52, 7)}</g></g>`,
    kraken: `<g class="ba-wig">${tn("M26 56Q8 62 6 78Q6 90 16 86", "#e2523f")}${tn("M34 62Q26 80 18 96", "#e2523f")}${tn("M46 64Q44 82 40 96", "#e2523f")}${tn("M56 64Q58 82 64 96", "#e2523f")}${tn("M66 62Q76 80 84 94", "#e2523f")}${tn("M74 56Q92 62 94 78Q94 90 84 86", "#e2523f")}<g fill="#ffd0c0"><circle cx="10" cy="76" r="1.8"/><circle cx="24" cy="84" r="1.8"/><circle cx="43" cy="84" r="1.8"/><circle cx="60" cy="84" r="1.8"/><circle cx="78" cy="84" r="1.8"/><circle cx="91" cy="76" r="1.8"/></g></g><path d="M20 58C18 26 34 8 50 8s32 18 30 50c-8 9-52 9-60 0z" fill="#e2523f" ${SK}/>${hl(36, 20, 7, 4)}<text x="50" y="34" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="15" fill="#fff" stroke="#0d1230" stroke-width="1.2">51%</text><g class="ba-pul">${glow(39, 47, 4, "#ffe66d")}${glow(61, 47, 4, "#ffe66d")}</g><circle cx="39" cy="47" r="1.6" fill="#0d1230"/><circle cx="61" cy="47" r="1.6" fill="#0d1230"/><path d="M31 40l12 4M69 40l-12 4" stroke="#0d1230" stroke-width="3.5" stroke-linecap="round"/><path d="M42 57q8-5 16 0" fill="none" ${S2}/>`,
    angler: `<path d="M46 30Q42 6 20 10" fill="none" stroke="#0d1230" stroke-width="3" stroke-linecap="round"/><g class="ba-blk">${glow(19, 12, 5, "#ffe66d")}</g><text x="20" y="28" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="7.5" fill="#ffe66d">Seed?</text><path d="M80 56l16-16v34z" fill="#2c3766" ${SK}/><path d="M14 58C14 36 38 26 58 30c22 4 30 18 26 32C80 80 56 88 36 82 22 78 14 70 14 58z" fill="#3d4a7a" ${SK}/>${hl(56, 38, 8, 4)}<path d="M54 30l8-12 6 14z" fill="#2c3766" ${S2}/><path d="M14 54l26 8-24 14z" fill="#1a1030" ${S2}/><path d="M17 56l4 5 3-4 4 5 3-4 4 4M19 73l4-5 3 4 4-5 3 4" fill="#fff" stroke="#0d1230" stroke-width="1.2" stroke-linejoin="round"/><circle cx="44" cy="46" r="8" fill="#fff" ${S2}/><circle cx="42" cy="47" r="3.2" fill="#0d1230"/><path d="M34 36l16 5" stroke="#0d1230" stroke-width="3.5" stroke-linecap="round"/><path d="M58 64q6 6 14 2" fill="none" stroke="#2c3766" stroke-width="3" stroke-linecap="round"/>`,
    zollhai: `<g class="ba-bar"><path d="M6 88h62" stroke="#0d1230" stroke-width="9" stroke-linecap="round"/><path d="M6 88h62" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M14 88h8M32 88h8M50 88h8" stroke="#ff5c73" stroke-width="5"/></g>${coinP(80, 86, 10)}<path d="M44 34L56 10l8 26z" fill="#6c83a8" ${SK}/><path d="M80 44l16-14-4 24 4 22-16-14z" fill="#6c83a8" ${SK}/><path d="M6 54C18 34 56 28 82 44v16C60 74 24 74 6 54z" fill="#7d93b5" ${SK}/><path d="M9 57c18 12 46 12 70 3-22 4-48 3-70-3z" fill="#f0f4ff"/><path d="M46 60l8 10-12-2z" fill="#6c83a8" ${S2}/>${hl(40, 40, 8, 3)}<path d="M10 55q16 10 34 2" fill="#fff" ${S2}/><path d="M14 57l3 4 3-3 3 4 3-3 3 4 3-3 3 3" fill="none" stroke="#0d1230" stroke-width="1.4" stroke-linejoin="round"/><circle cx="30" cy="46" r="4.5" fill="#fff" ${S2}/><circle cx="31" cy="46.5" r="2" fill="#0d1230"/><path d="M24 40l10 3" stroke="#0d1230" stroke-width="3" stroke-linecap="round"/><path d="M16 40q10-16 28-10l2 6q-16-4-30 4z" fill="#2e6b4a" ${S2}/><path d="M12 42q8-4 18-4" stroke="#0d1230" stroke-width="3" stroke-linecap="round"/><circle cx="31" cy="31" r="2.6" fill="#ffc94d" stroke="#0d1230" stroke-width="1.2"/>`,
    siren: `<circle cx="50" cy="44" r="40" fill="#7b5cff" opacity=".16"/><path d="M0 90q8-6 16 0t17 0 17 0 17 0 17 0 16 0v10H0z" fill="#4aa3df" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M24 94Q28 80 42 80Q56 76 70 82Q80 84 82 94z" fill="#5d6480" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="36" cy="84" rx="6" ry="2" fill="#fff" opacity=".45"/><path d="M50 5C28 5 22 22 26 36C28 46 21 53 24 62C33 60 37 54 40 47H60C63 54 67 60 76 62C79 53 72 46 74 36C78 22 72 5 50 5z" fill="#ffb84d" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M30 30C30 42 27 50 28 56M70 30C70 42 73 50 72 56" fill="none" stroke="#ffe08a" stroke-width="2.6" stroke-linecap="round"/><path d="M81 67C83 55 91 48 98 45C96 55 96 61 93 66C97 70 99 77 97 86C90 81 83 75 81 67z" fill="#b9a6ff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M86 66l8-14M86 67h9M86 68l7 12" stroke="#7b5cff" stroke-width="1.8" stroke-linecap="round"/><path d="M40 56C33 72 38 87 55 88C71 89 80 80 84 67L80 64C76 75 67 80 57 79C47 77 46 67 58 56z" fill="#7b5cff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M43 66q3 3 6 0M45 74q3 3 6 0M51 81q3 3 6 0M59 82q3 3 6 0M67 79q3 3 6 0M49 60q3 3 6 0" fill="none" stroke="#c8baff" stroke-width="1.8" stroke-linecap="round"/><path d="M39 58Q37 44 50 42Q63 44 61 58z" fill="#34d982" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M43 50q2.5 2.5 5 0M48 50q2.5 2.5 5 0M53 50q2.5 2.5 5 0M45 55q2.5 2.5 5 0M50 55q2.5 2.5 5 0" fill="none" stroke="#1fa85c" stroke-width="1.6" stroke-linecap="round"/><path d="M41 48Q34 54 30 50" fill="none" stroke="#0d1230" stroke-width="10" stroke-linecap="round"/><path d="M41 48Q34 54 30 50" fill="none" stroke="#ffd3b0" stroke-width="5" stroke-linecap="round"/><g class="ba-hook"><g transform="translate(29 52) scale(1.4) translate(-29 -52)"><path d="M28 52C18 52 14 42 18 34" fill="none" stroke="#0d1230" stroke-width="7" stroke-linecap="round"/><path d="M28 52C18 52 14 42 18 34" fill="none" stroke="#c9d1e8" stroke-width="3.5" stroke-linecap="round"/><path d="M18 34l-4 5M18 34l5 3" stroke="#0d1230" stroke-width="3" stroke-linecap="round"/><path d="M22 36q-3-4 0-7" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/></g></g><circle cx="30" cy="50" r="4.2" fill="#ffd3b0" stroke="#0d1230" stroke-width="2.4"/><path d="M59 48Q66 46 72 40" fill="none" stroke="#0d1230" stroke-width="10" stroke-linecap="round"/><path d="M59 48Q66 46 72 40" fill="none" stroke="#ffd3b0" stroke-width="5" stroke-linecap="round"/><g class="ba-bait"><circle cx="78" cy="34" r="9" fill="#ffc94d" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="78" cy="34" r="6.4799999999999995" fill="none" stroke="#e0a000" stroke-width="3"/><text x="78" y="37.24" font-size="9" font-weight="900" text-anchor="middle" fill="#b86e00" font-family="Arial">₿</text><ellipse cx="74.85" cy="29.95" rx="2.6999999999999997" ry="1.2600000000000002" fill="#fff" opacity=".45"/><g class="ba-spk"><path d="M66 22l2 4 4 1-4 2-2 4-2-4-4-2 4-1zM90 20l1.5 3 3 1-3 1.5-1.5 3-1.5-3-3-1.5 3-1z" fill="#fff"/></g></g><path d="M46 38h8v6h-8z" fill="#ffd3b0" stroke="#0d1230" stroke-width="2.4"/><ellipse cx="50" cy="27" rx="12" ry="12.5" fill="#ffd3b0" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M38 27C37 13 63 13 62 27C59 21 55 19 51 22C47 18 41 21 38 27z" fill="#ffb84d" stroke="#0d1230" stroke-width="2.4" stroke-linejoin="round"/><path d="M42 28q3-3 6 0M52 28q3-3 6 0" fill="none" stroke="#0d1230" stroke-width="2.4" stroke-linecap="round"/><path d="M41.5 25.5l-1.5-1.5M58.5 25.5l1.5-1.5" stroke="#0d1230" stroke-width="1.6" stroke-linecap="round"/><circle cx="42.5" cy="33" r="2" fill="#ff8fa3" opacity=".55"/><circle cx="57.5" cy="33" r="2" fill="#ff8fa3" opacity=".55"/><path d="M45 33q5 4 10 0" fill="#c2185b" stroke="#0d1230" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M58 11c3-4 8-3 8 1-4 0-6 2-8-1z" fill="#ff8fb1" stroke="#0d1230" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><g class="ba-nt"><g transform="rotate(-10 12 24)"><path d="M15 24V12q5 2 7 7" fill="none" stroke="#ffe66d" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="12" cy="24" rx="4" ry="3" fill="#ffe66d" transform="rotate(-20 12 24)" stroke="#0d1230" stroke-width="1.8"/></g></g><g class="ba-nt"><g transform="rotate(10 88 58)"><path d="M91 58V46q5 2 7 7" fill="none" stroke="#b9a6ff" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="88" cy="58" rx="4" ry="3" fill="#b9a6ff" transform="rotate(-20 88 58)" stroke="#0d1230" stroke-width="1.8"/></g></g>`,
    pool: `<ellipse cx="50" cy="95" rx="40" ry="4" fill="#000" opacity=".3"/><circle cx="50" cy="40" r="34" fill="#f7931a" opacity=".1"/><ellipse cx="50" cy="72" rx="47" ry="21" fill="#1d4f8f" ${SK}/><ellipse cx="50" cy="70" rx="38" ry="14" fill="none" stroke="#9fd8ff" stroke-width="1.6" opacity=".3"/><g class="ba-rise"><path d="M28 76C28 56 37 49 50 49s22 7 22 27z" fill="#141a3d" ${SK}/><circle cx="50" cy="34" r="13" fill="#141a3d" ${SK}/><path d="M37 30q-2-14 13-16q15 2 13 16q-6-7-13-7t-13 7z" fill="#0a0d26"/>${glow(45, 35, 2.2, "#f7931a")}${glow(55, 35, 2.2, "#f7931a")}<path d="M44 42q6 3 12 0" fill="none" stroke="#f7931a" stroke-width="1.8" stroke-linecap="round" opacity=".7"/><path d="M38 28q3-2 6 0t6 0 6 0 6 0M34 58q4-2 8 0t8 0 8 0 8 0M32 66q4-2 9 0t9 0 9 0 9 0" fill="none" stroke="#9fd8ff" stroke-width="1.6" stroke-linecap="round" opacity=".35"/><path d="M42 47v4M58 47v5" stroke="#141a3d" stroke-width="3" stroke-linecap="round"/></g><path d="M3 72Q50 98 97 72Q50 86 3 72z" fill="#2a6bb0" ${SK}/><g class="ba-rip"><ellipse cx="50" cy="76" rx="26" ry="5" fill="none" stroke="#9fd8ff" stroke-width="2" opacity=".7"/></g><g class="ba-rip d2"><ellipse cx="50" cy="77" rx="36" ry="7" fill="none" stroke="#9fd8ff" stroke-width="1.6" opacity=".45"/></g>`,
    scroll: `<path d="M22 14h56a10 10 0 0 1 0 20H72v52H24a10 10 0 0 1 0-20h6V24a10 10 0 0 0-8-10z" fill="#f4efe1" ${SK}/><path d="M14 76a10 10 0 0 0 10 10h50" fill="none" ${SK}/><path d="M38 34h26M38 44h26M38 54h18" stroke="#b86e00" stroke-width="4" stroke-linecap="round"/><circle cx="62" cy="68" r="7" fill="#ff5c73" ${SK}/>`,
    go: `<circle cx="50" cy="50" r="40" fill="#34d982" ${SK}/><path d="M40 30l28 20-28 20z" fill="#fff" ${SK}/><path d="M14 22l-6-6M86 22l6-6M50 6V0" stroke="#ffc94d" stroke-width="5" stroke-linecap="round"/>${hl(32, 28, 9, 4)}`,
    shake: `<path d="M6 40l18-10 14 6 12-6 14 4 18-6 12 10v18l-14 8-14 12-8-4-6 6-8-4-6 4-8-6-14-10-10-6z" fill="#ffd0a0" ${SK}/><path d="M38 36l14 14M48 62l8-8M56 70l8-8M64 64l6-6" fill="none" stroke="#c98a5a" stroke-width="3" stroke-linecap="round"/><path d="M2 36l14-8 8 26-14 6zM98 36l-14-8-8 26 14 6z" fill="#2f6fd6" ${SK}/>`,
    coaster: `<path d="M6 80C20 80 22 22 38 22S52 64 64 64 78 34 94 34" fill="none" stroke="#0d1230" stroke-width="11" stroke-linecap="round"/><path d="M6 80C20 80 22 22 38 22S52 64 64 64 78 34 94 34" fill="none" stroke="#ff5c73" stroke-width="5" stroke-linecap="round"/><path d="M14 90V74M38 90V30M64 90V68M86 90V40" stroke="#9aa2b8" stroke-width="4"/><path d="M28 12h20v10H28z" fill="#ffc94d" ${SK}/><circle cx="32" cy="24" r="3" fill="#0d1230"/><circle cx="44" cy="24" r="3" fill="#0d1230"/>`,
    pie: `<circle cx="50" cy="52" r="38" fill="#34d982" ${SK}/><path d="M50 52V14a38 38 0 0 1 36 26z" fill="#ffc94d" ${SK}/><path d="M50 52l36-12a38 38 0 0 1-14 42z" fill="#7cc4ff" ${SK}/><path d="M50 52l22 30a38 38 0 0 1-30 6z" fill="#9aa2b8" ${SK}/>${hl(36, 30, 8, 3)}`,
    card: `<path d="M8 24h84v54H8z" fill="#2f6fd6" ${SK}/><path d="M8 36h84" stroke="#0d1230" stroke-width="7"/><path d="M18 50h16v12H18z" fill="#ffc94d" ${SK}/><text x="72" y="70" font-size="26" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">€</text>${hl(26, 30, 10, 2)}`,
    cart: `<path d="M6 16h14l10 46h50l8-32H24" fill="none" stroke="#0d1230" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><path d="M6 16h14l10 46h50l8-32H24" fill="none" stroke="#9aa2b8" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="36" cy="78" r="8" fill="#ffc94d" ${SK}/><circle cx="72" cy="78" r="8" fill="#ffc94d" ${SK}/>${coinP(54, 36, 16)}`,
    myth: `<path d="M12 18h76v52H48L28 88V70H12z" fill="#fff" ${SK}/><text x="34" y="56" font-size="34" font-weight="900" text-anchor="middle" fill="#ff5c73" font-family="Arial">✗</text><text x="66" y="56" font-size="34" font-weight="900" text-anchor="middle" fill="#34d982" font-family="Arial">✓</text>${hl(26, 26, 8, 3)}`,
    shades: `<path d="M8 40h84" stroke="#0d1230" stroke-width="6" stroke-linecap="round"/><path d="M12 40h32l-4 22c-1 6-6 10-12 10s-11-4-12-10zM56 40h32l-4 22c-1 6-6 10-12 10s-11-4-12-10z" fill="#232a62" ${SK}/><path d="M44 46q6-6 12 0" fill="none" ${SK}/>${hl(22, 50, 6, 3)}${hl(66, 50, 6, 3)}`,
    term: `<path d="M8 16h84v68H8z" fill="#0b0f2a" ${SK}/><path d="M8 16h84v14H8z" fill="#3a4070" ${SK}/><circle cx="18" cy="23" r="3" fill="#ff5c73"/><circle cx="28" cy="23" r="3" fill="#ffc94d"/><circle cx="38" cy="23" r="3" fill="#34d982"/><path d="M20 44l12 10-12 10" fill="none" stroke="#34d982" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 64h28" stroke="#ffc94d" stroke-width="5" stroke-linecap="round"/>`,
    dice: `<path d="M16 32l34-17 34 17v38L50 87 16 70z" fill="#fff" ${SK}/><path d="M16 32l34 17 34-17M50 49v38" fill="none" ${SK}/><ellipse cx="50" cy="31" rx="7" ry="4" fill="#ff5c73"/><circle cx="29" cy="52" r="4" fill="#0d1230"/><circle cx="37" cy="69" r="4" fill="#0d1230"/><circle cx="63" cy="56" r="4" fill="#0d1230"/><circle cx="71" cy="63" r="4" fill="#0d1230"/><circle cx="63" cy="73" r="4" fill="#0d1230"/><circle cx="71" cy="49" r="4" fill="#0d1230"/>${hl(40, 26, 10, 3)}`,
    factory: `<path d="M10 88V46l20 12V46l20 12V46l20 12V24h14v64z" fill="#9aa2b8" ${SK}/><path d="M70 24h14v-8H70z" fill="#ff5c73" ${SK}/><path d="M20 70h10v10H20zM40 70h10v10H40z" fill="#ffc94d" ${SK}/><circle cx="77" cy="8" r="5" fill="#dfe3f2" opacity=".8"/><path d="M58 76a8 8 0 1 1 8 8h-2v8h-6v-6" fill="#ffc94d" ${SK}/>`,
    gear: `<path d="M44 8h12l2 12 9 4 10-7 8 8-7 10 4 9 12 2v12l-12 2-4 9 7 10-8 8-10-7-9 4-2 12H44l-2-12-9-4-10 7-8-8 7-10-4-9-12-2V44l12-2 4-9-7-10 8-8 10 7 9-4z" fill="#7cc4ff" ${SK}/><circle cx="50" cy="50" r="17" fill="#0b0f2a" ${SK}/><text x="50" y="58" font-size="22" font-weight="900" text-anchor="middle" fill="#ffc94d" font-family="Arial">#</text>${hl(36, 20, 8, 3)}`,
    curve: `<path d="M12 50h80M24 10v80" stroke="#8890b8" stroke-width="3" stroke-linecap="round"/><path d="M88 8C62 28 40 38 32 50c8 12 30 22 56 42" fill="none" stroke="#0d1230" stroke-width="11" stroke-linecap="round"/><path d="M88 8C62 28 40 38 32 50c8 12 30 22 56 42" fill="none" stroke="#ffc94d" stroke-width="6" stroke-linecap="round"/><path d="M14 20l78 52" stroke="#ff5c73" stroke-width="3" stroke-dasharray="6 5"/><circle cx="40" cy="37" r="7" fill="#34d982" ${SK}/><circle cx="72" cy="58" r="7" fill="#7cc4ff" ${SK}/>`,
    pen: `<path d="M8 84q10-14 18-4t16-6 14 2" fill="none" stroke="#7cc4ff" stroke-width="4" stroke-linecap="round"/><path d="M64 10l26 26-38 38-18 6 6-18z" fill="#ffc94d" ${SK}/><path d="M64 10l26 26-10 10-26-26z" fill="#ff5c73" ${SK}/><path d="M40 62l-6 18 18-6" fill="#0d1230"/><circle cx="48" cy="56" r="4" fill="#0d1230"/>${hl(70, 22, 6, 3)}`,
    tag: `<path d="M10 40l30-28h46v76H40z" fill="#9ee6a8" ${SK}/><circle cx="72" cy="28" r="6" fill="#0b0f2a" ${SK}/><text x="54" y="66" font-size="19" font-weight="900" text-anchor="middle" fill="#0d1230" font-family="Arial">bc1</text>${hl(60, 18, 10, 3)}`,
    tree: `<path d="M50 24L28 50M50 24l22 26M28 50L17 76M28 50l11 26M72 50L61 76M72 50l11 26" stroke="#0d1230" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="20" r="11" fill="#ffc94d" ${SK}/><circle cx="28" cy="50" r="9" fill="#7cc4ff" ${SK}/><circle cx="72" cy="50" r="9" fill="#7cc4ff" ${SK}/><path d="M9 74h16v14H9zM31 74h16v14H31zM53 74h16v14H53zM75 74h16v14H75z" fill="#9ee6a8" ${SK}/>${hl(46, 15, 4, 2)}`,
    atom: `<ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#0d1230" stroke-width="8"/><ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#b26bff" stroke-width="4"/><g transform="rotate(60 50 50)"><ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#0d1230" stroke-width="8"/><ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#7cc4ff" stroke-width="4"/></g><g transform="rotate(-60 50 50)"><ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#0d1230" stroke-width="8"/><ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="#34d982" stroke-width="4"/></g><circle cx="50" cy="50" r="11" fill="#ffc94d" ${SK}/>${hl(46, 46, 4, 2)}`,
    shell: `<path d="M50 88C30 86 10 70 10 48 10 26 28 12 50 12s40 14 40 36c0 22-20 38-40 40z" fill="#ffd0f0" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M50 88V20M50 88L26 26M50 88L74 26M50 88L14 46M50 88L86 46" fill="none" stroke="#c97aa8" stroke-width="3"/><path d="M38 88h24v6H38z" fill="#ffb3c8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`,
    gauge: `<path d="M12 70a38 38 0 0 1 76 0z" fill="#f2f4ff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M18 66a32 32 0 0 1 20-26" fill="none" stroke="#34d982" stroke-width="7"/><path d="M40 38a32 32 0 0 1 22 0" fill="none" stroke="#ffc94d" stroke-width="7"/><path d="M64 40a32 32 0 0 1 18 26" fill="none" stroke="#ff5c73" stroke-width="7"/><path d="M50 70L74 42" stroke="#0d1230" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="70" r="7" fill="#f7931a" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="50" y="92" font-size="14" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">S2F</text>`,
    copy: `<path d="M14 22h44v58H14z" fill="#f4efe1" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M42 14h44v58H42z" fill="#fff1c2" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="64" cy="40" r="12" fill="#ffc94d" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="64" y="45" font-size="14" font-weight="900" text-anchor="middle" fill="#b86e00" font-family="Arial">₿</text><circle cx="36" cy="52" r="12" fill="#ffc94d" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="36" y="57" font-size="14" font-weight="900" text-anchor="middle" fill="#b86e00" font-family="Arial">₿</text><path d="M58 84l8 8 8-8" fill="none" stroke="#ff5c73" stroke-width="5" stroke-linecap="round"/>`,
    eye: `<path d="M6 50q44-44 88 0-44 44-88 0z" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="50" cy="50" r="18" fill="#7cc4ff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="50" cy="50" r="8" fill="#0d1230"/><circle cx="44" cy="44" r="4" fill="#fff"/><path d="M18 26l-6-8M50 18V8M82 26l6-8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`,
    plankton: `<path d="M50 18c18 0 30 14 30 32S68 84 50 84 20 70 20 50s12-32 30-32z" fill="#7ad890" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="36" cy="40" r="4" fill="#34d982"/><circle cx="62" cy="64" r="5" fill="#34d982"/><circle cx="58" cy="34" r="3" fill="#34d982"/><circle cx="44" cy="52" r="6" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="45" cy="52" r="2.7" fill="#0d1230"/><circle cx="58" cy="50" r="5" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="59" cy="50" r="2.25" fill="#0d1230"/><path d="M20 50l-10-4M80 50l10-4M50 18l2-10M50 84l-2 10" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`,
    shrimp: `<path d="M78 30c-4 32-26 52-52 46-8-2-10-10-4-14 18 4 34-6 38-30z" fill="#ff9a6a" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M60 40l8 4M52 52l8 6M42 62l6 8" stroke="#c9374f" stroke-width="3" stroke-linecap="round"/><path d="M76 30q4-18 18-22M74 30q-6-16 2-26" fill="none" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="72" cy="30" r="5" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="73" cy="30" r="2.25" fill="#0d1230"/><path d="M22 66l-12 4 4 10" fill="#ff9a6a" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`,
    crab: `<ellipse cx="50" cy="58" rx="30" ry="20" fill="#ff5c73" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M24 52q-14-10-10-26 12 2 14 14M76 52q14-10 10-26-12 2-14 14" fill="#ff5c73" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M14 26l8 4M86 26l-8 4" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="40" cy="40" r="6" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="41" cy="40" r="2.7" fill="#0d1230"/><circle cx="60" cy="40" r="6" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="61" cy="40" r="2.7" fill="#0d1230"/><path d="M30 74l-8 10M42 78l-4 10M58 78l4 10M70 74l8 10" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M42 60q8 6 16 0" fill="none" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="40" cy="50" rx="8" ry="3" fill="#fff" opacity=".45"/>`,
    fish: `<path d="M20 50c12-22 40-26 58-6-18 22-46 20-58 6z" fill="#7cc4ff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M78 44l16-14v38l-16-14z" fill="#5aa0e8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M40 34q10 16 0 32" fill="none" stroke="#2f6fd6" stroke-width="3"/><circle cx="30" cy="46" r="5" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="31" cy="46" r="2.25" fill="#0d1230"/><ellipse cx="50" cy="38" rx="10" ry="3" fill="#fff" opacity=".45"/>`,
    dolphin: `<path d="M12 60c10-26 44-40 74-22 6 4 6 10 0 12-24 10-50 14-74 10z" fill="#8fb4d8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M50 36l8-18 8 20z" fill="#8fb4d8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M80 48l14 6-4-14z" fill="#8fb4d8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M14 60l-6 4 8 2" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="28" cy="52" r="4" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="29" cy="52" r="1.8" fill="#0d1230"/><path d="M20 60q10 4 22 0" fill="none" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="50" cy="44" rx="12" ry="3" fill="#fff" opacity=".45"/>`,
    shark: `<path d="M8 58c16-24 52-30 82-10-26 22-62 24-82 10z" fill="#9aa2b8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M46 38l6-26 14 30z" fill="#9aa2b8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M88 48l8-16v34z" fill="#9aa2b8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M14 58l22 2-4 6-4-5-4 6-4-6-4 5z" fill="#fff" stroke="#0d1230" stroke-width="2.5" stroke-linejoin="round"/><circle cx="30" cy="48" r="4" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="31" cy="48" r="1.8" fill="#0d1230"/><path d="M50 52l2 8M58 50l2 8M66 50l2 8" stroke="#0d1230" stroke-width="2.5"/>`,
    humpback: `<path d="M8 58c6-24 46-36 78-16 8 6 6 22-6 26-30 8-56 6-72-10z" fill="#3a5a9a" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M12 62c20 10 46 12 70 4" fill="none" stroke="#dbe6ff" stroke-width="3"/><path d="M84 46l12-14 0 26z" fill="#3a5a9a" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M40 66l-6 16 16-10z" fill="#3a5a9a" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="24" cy="52" r="4" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="25" cy="52" r="1.8" fill="#0d1230"/><circle cx="44" cy="44" r="3" fill="#5a7ac0"/><circle cx="56" cy="40" r="3" fill="#5a7ac0"/>`,
    whale: `<path d="M8 60c0-24 30-40 62-30 18 6 24 20 18 30-10 16-60 20-80 0z" fill="#2f6fd6" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M82 46l14-12v28z" fill="#2f6fd6" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M12 66c18 8 50 10 70-2" fill="none" stroke="#bfe0ff" stroke-width="3"/><circle cx="26" cy="52" r="5" fill="#fff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="27" cy="52" r="2.25" fill="#0d1230"/><path d="M36 26q-4-14 4-20M36 26q6-12 16-12" fill="none" stroke="#7cc4ff" stroke-width="5" stroke-linecap="round"/><circle cx="56" cy="50" r="10" fill="#ffc94d" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="56" y="55" font-size="13" font-weight="900" text-anchor="middle" fill="#b86e00" font-family="Arial">₿</text><ellipse cx="40" cy="38" rx="12" ry="3" fill="#fff" opacity=".45"/>`,
    printer: `${bill(8, 10, -18)}${bill(70, 6, 16)}${bill(40, 0, -4)} <path d="M26 16h48v24H26z" fill="#e8ecf8" ${SK}/> <path d="M12 38h76a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V42a4 4 0 0 1 4-4z" fill="#4a5072" ${SK}/> <path d="M10 64h80v12a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="#363b58"/> <path d="M22 47l16 5M78 47l-16 5" stroke="#0d1230" stroke-width="5" stroke-linecap="round"/> ${glow(31, 56, 4.5, "#ff3d5a")}${glow(69, 56, 4.5, "#ff3d5a")} <path d="M32 68q18 9 36 0" fill="#141833" ${SK}/><path d="M38 69.5l3 4 3-3.5 3 4 3-4 3 4 3-3.5 3 4" fill="none" stroke="#fff" stroke-width="2"/> <path d="M28 80h44v14H28z" fill="#7fd68f" ${SK}/><text x="50" y="91" font-size="11" font-weight="900" text-anchor="middle" fill="#0d1230" font-family="Arial">€€€</text> ${hl(22, 43, 8, 2.5)}`,
    fomo: `<path d="M50 8l-6 12h4v10h4V20h4z" fill="#34d982" ${S2}/> <path d="M14 94c-4-30 2-62 36-62s40 32 36 62l-8-6-7 6-7-6-7 6-7-6-7 6-7-6-7 6z" fill="#8b5cf6" ${SK}/> <path d="M14 80c14 8 58 8 72 0l0 14-8-6-7 6-7-6-7 6-7-6-7 6-7-6-7 6-7-6z" fill="#6d3fd6"/> <path d="M18 52l-12-8M82 52l12-8" stroke="#0d1230" stroke-width="5" stroke-linecap="round"/><path d="M18 52l-12-8M82 52l12-8" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round"/> <circle cx="37" cy="52" r="12" fill="#fff" ${SK}/><circle cx="63" cy="52" r="12" fill="#fff" ${SK}/> <path d="M37 52m-7 0a7 7 0 1 0 7-7a5 5 0 1 0 4 5a3 3 0 1 0-3 2" fill="none" stroke="#0d1230" stroke-width="2.2"/> <path d="M63 52m-7 0a7 7 0 1 0 7-7a5 5 0 1 0 4 5a3 3 0 1 0-3 2" fill="none" stroke="#0d1230" stroke-width="2.2"/> <path d="M30 70q20 16 40 0z" fill="#3a0f2a" ${SK}/><path d="M35 71l3 5 3-4 3 5 3-5 3 5 3-5 3 4 3-5" fill="none" stroke="#fff" stroke-width="2"/><path d="M45 79q5 5 10 0" fill="#ff7aa8"/> ${hl(32, 40, 9, 3)}`,
    key: `<circle cx="32" cy="50" r="20" fill="#ffc94d" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="32" cy="50" r="7" fill="#1b2150" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M50 50h40v10M78 50v12M66 50v8" fill="none" stroke="#0d1230" stroke-width="10" stroke-linecap="round"/><path d="M50 50h40v10M78 50v12M66 50v8" fill="none" stroke="#ffc94d" stroke-width="5" stroke-linecap="round"/>`,
    mask: `<circle cx="50" cy="52" r="34" fill="#ffd0a0" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M14 44q36-18 72 0v14q-36 14-72 0z" fill="#0d1230"/><ellipse cx="36" cy="50" rx="8" ry="5" fill="#fff"/><ellipse cx="64" cy="50" rx="8" ry="5" fill="#fff"/><circle cx="37" cy="50" r="3" fill="#0d1230"/><circle cx="63" cy="50" r="3" fill="#0d1230"/><path d="M38 72q12-6 24 0" fill="none" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M20 30q30-26 60 0" fill="#3a3f5c" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`,
    pig: `<ellipse cx="50" cy="56" rx="36" ry="28" fill="#ffb3c8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M30 34l-4-14 14 8M64 30l10-12 2 16" fill="#ff8fb0" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><ellipse cx="84" cy="58" rx="8" ry="10" fill="#ff8fb0" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="64" cy="46" r="3.5" fill="#0d1230"/><path d="M40 30h18" stroke="#0d1230" stroke-width="5" stroke-linecap="round"/><path d="M30 82v8M66 82v8" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><text x="44" y="68" font-size="18" font-weight="900" text-anchor="middle" fill="#f7931a" font-family="Arial">₿</text>`,
    train: `<path d="M18 22h64v50H18z" fill="#ff5c73" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M26 30h20v16H26zM54 30h20v16H54z" fill="#7cc4ff" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M10 72h80" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="32" cy="80" r="8" fill="#3a3f5c" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="68" cy="80" r="8" fill="#3a3f5c" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M18 56h64" stroke="#ffc94d" stroke-width="5"/>`,
    finger: `<path d="M50 10c-20 0-34 16-34 38 0 22 10 38 18 42M50 22c-12 0-22 10-22 26 0 16 6 30 14 36M50 34c-6 0-10 6-10 14 0 14 6 26 12 32M50 46v34M62 34c4 4 6 10 6 16 0 14-4 24-8 30M74 26c6 8 10 16 10 26 0 16-4 26-10 34" fill="none" stroke="#0d1230" stroke-width="9" stroke-linecap="round"/><path d="M50 10c-20 0-34 16-34 38 0 22 10 38 18 42M50 22c-12 0-22 10-22 26 0 16 6 30 14 36M50 34c-6 0-10 6-10 14 0 14 6 26 12 32M50 46v34M62 34c4 4 6 10 6 16 0 14-4 24-8 30M74 26c6 8 10 16 10 26 0 16-4 26-10 34" fill="none" stroke="#7af0ff" stroke-width="4" stroke-linecap="round"/>`,
    chain: `<rect x="8" y="38" width="36" height="24" rx="12" fill="none" stroke="#0d1230" stroke-width="12"/><rect x="8" y="38" width="36" height="24" rx="12" fill="none" stroke="#f7931a" stroke-width="6"/><rect x="56" y="38" width="36" height="24" rx="12" fill="none" stroke="#0d1230" stroke-width="12"/><rect x="56" y="38" width="36" height="24" rx="12" fill="none" stroke="#f7931a" stroke-width="6"/><rect x="34" y="42" width="32" height="16" rx="8" fill="none" stroke="#0d1230" stroke-width="12"/><rect x="34" y="42" width="32" height="16" rx="8" fill="none" stroke="#ffc94d" stroke-width="6"/>`,
    server: `<path d="M22 12h56v24H22zM22 40h56v24H22zM22 68h56v24H22z" fill="#2b3478" stroke="#0d1230" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="34" cy="24" r="4" fill="#34d982"/><circle cx="34" cy="52" r="4" fill="#34d982"/><circle cx="34" cy="80" r="4" fill="#ffc94d"/><path d="M48 24h20M48 52h20M48 80h20" stroke="#7cc4ff" stroke-width="4" stroke-linecap="round"/>`,
    laptop: `<path d="M20 22h60v40H20z" fill="#2b3478" ${SK}/><path d="M26 28h48v28H26z" fill="#7cc4ff"/><text x="50" y="50" font-size="22" font-weight="900" text-anchor="middle" fill="#f7931a" font-family="Arial">₿</text><path d="M8 66h84l-8 12H16z" fill="#c0c0cc" ${SK}/>`,
    letter: `<path d="M12 28h76v48H12z" fill="#fff1c2" ${SK}/><path d="M12 28l38 28 38-28" fill="none" ${SK}/>${hl(30, 36, 8, 3)}`,
    news: `<path d="M14 16h72v70H14z" fill="#f4efe1" ${SK}/><path d="M22 26h56v10H22z" fill="#0d1230"/><path d="M22 44h26M22 52h26M22 60h26M22 68h26M56 44h22v24H56z" stroke="#7a7a8c" stroke-width="3" fill="#c9cbe0"/>`,
    block: `<path d="M50 12l34 18v40L50 88 16 70V30z" fill="#f7931a" ${SK}/><path d="M16 30l34 18 34-18M50 48v40" fill="none" ${SK}/><path d="M50 12l34 18-34 18-34-18z" fill="#ffb04a" ${SK}/><text x="34" y="72" font-size="22" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">₿</text>`,
    hood: `<ellipse cx="50" cy="96" rx="30" ry="3.5" fill="#000" opacity=".3"/><path d="M20 96c0-24 12-38 30-38s30 14 30 38z" fill="#2a2440" ${SK}/><path d="M26 50c0-22 10-36 24-36s24 14 24 36c0 8-10 11-24 11s-24-3-24-11z" fill="#3b3360" ${SK}/><ellipse cx="50" cy="46" rx="15" ry="14" fill="#0a0820"/><circle cx="50" cy="45" r="17" fill="#f7931a" opacity=".22"/><text x="50" y="55" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="25" fill="#f7931a">?</text><text x="50" y="86" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="12" fill="#f7931a" opacity=".85">₿</text>`,
    oldme: `<ellipse cx="50" cy="96" rx="34" ry="3.5" fill="#000" opacity=".3"/><path d="M20 96c0-18 10-28 23-28s23 10 23 28z" fill="#7c8199" ${SK}/><path d="M33 70l10 7 10-7" fill="none" stroke="#5d6278" stroke-width="2"/><circle cx="43" cy="44" r="17" fill="#b8bccb" ${SK}/><path d="M26.5 40q2.5-15.5 17.5-14.5q12.5 1 15 13q-5-6.5-15-7q-10 .5-17.5 8.5z" fill="#6b6f84" ${SK}/><path d="M35 46q3 2 6 0M46 46q3 2 6 0M39 55q4-2 8 0" fill="none" stroke="#0d1230" stroke-width="2.4" stroke-linecap="round"/><text x="60" y="28" font-family="Arial Black,Arial,sans-serif" font-size="9" fill="#9aa2d6">z</text><text x="66" y="21" font-family="Arial Black,Arial,sans-serif" font-size="7" fill="#9aa2d6" opacity=".7">z</text><ellipse cx="76" cy="84" rx="13" ry="9.5" fill="#d9a0b0" ${SK}/><rect x="72" y="76" width="7" height="2" rx="1" fill="#0d1230"/><circle cx="88" cy="83" r="3" fill="#d9a0b0" stroke="#0d1230" stroke-width="2.4"/><circle cx="71" cy="83" r="1.1" fill="#8a90b0"/><circle cx="78" cy="88" r="1" fill="#8a90b0"/><circle cx="82" cy="80" r=".9" fill="#8a90b0"/>`,
    mirror: `<g stroke="#ffc94d" stroke-width="2.5" stroke-linecap="round" opacity=".55"><path d="M50 2v6M84 14l-5 5M16 14l5 5M96 46h-7M4 46h7"/></g><rect x="25" y="9" width="50" height="84" rx="25" fill="#0d1230" stroke="#c8902a" stroke-width="5"/><rect x="29" y="13" width="42" height="76" rx="21" fill="#1b2160"/><path d="M34 26q7-7 14-5" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".3"/><path d="M33 89c0-17 7-27 17-27s17 10 17 27z" fill="#ffb84d" ${SK}/><circle cx="50" cy="41" r="11" fill="#ffc94d" ${SK}/><circle cx="46" cy="40" r="1.6" fill="#0d1230"/><circle cx="54" cy="40" r="1.6" fill="#0d1230"/><path d="M45.5 45q4.5 3.5 9 0" fill="none" stroke="#0d1230" stroke-width="2" stroke-linecap="round"/><text x="50" y="83" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="11" fill="#0d1230">₿</text>`,
    satoshi: `<path d="M22 96c0-26 12-40 28-40s28 14 28 40z" fill="#3a3f5c" ${SK}/><path d="M28 50c0-22 10-36 22-36s22 14 22 36c0 8-10 12-22 12s-22-4-22-12z" fill="#4b5072" ${SK}/><ellipse cx="50" cy="46" rx="14" ry="13" fill="#141833"/><circle cx="44" cy="45" r="2.6" fill="#ffc94d"/><circle cx="56" cy="45" r="2.6" fill="#ffc94d"/><text x="50" y="88" font-size="18" font-weight="900" text-anchor="middle" fill="#f7931a" font-family="Arial">₿</text>`,
    hal: `<path d="M22 96c0-24 12-36 28-36s28 12 28 36z" fill="#34d982" ${SK}/><circle cx="50" cy="38" r="20" fill="#ffd0a0" ${SK}/><path d="M30 34c2-14 12-18 20-18s18 4 20 18c-6-6-12-8-20-8s-14 2-20 8z" fill="#8a5a2b" ${SK}/><circle cx="42" cy="40" r="6" fill="#fff" ${SK}/><circle cx="58" cy="40" r="6" fill="#fff" ${SK}/><path d="M48 40h4" ${SK}/><circle cx="42" cy="40" r="2" fill="#0d1230"/><circle cx="58" cy="40" r="2" fill="#0d1230"/><path d="M43 50q7 6 14 0" fill="none" ${SK}/>`,
    coin: coinP(50, 50, 38),
    pizza: `<path d="M50 90L14 22q36-16 72 0z" fill="#ffd76a" ${SK}/><path d="M14 22q36-16 72 0l-4 9q-32-13-64 0z" fill="#d98a3a" ${SK}/><circle cx="40" cy="44" r="7" fill="#ff5c73" ${SK}/><circle cx="60" cy="40" r="6" fill="#ff5c73" ${SK}/><circle cx="50" cy="64" r="6" fill="#ff5c73" ${SK}/>`,
    bag: `<path d="M38 22h24l-6 12h-12z" fill="#c9a26b" ${SK}/><path d="M44 34h12c22 8 30 26 26 42-3 10-12 14-32 14s-29-4-32-14c-4-16 4-34 26-42z" fill="#e0b97a" ${SK}/><text x="50" y="76" font-size="30" font-weight="900" text-anchor="middle" fill="#8a5a2b" font-family="Arial">₿</text>${hl(34, 50, 5, 9)}`,
    scale: `<path d="M50 18v62M30 86h40" fill="none" ${SK}/><path d="M14 30h72" ${SK}/><path d="M14 30l-10 24h20zM86 30l-10 24h20z" fill="#ffc94d" ${SK}/><circle cx="50" cy="18" r="5" fill="#ffc94d" ${SK}/>`,
    dollar: `<path d="M10 28h80v44H10z" fill="#9ee6a8" ${SK}/><circle cx="50" cy="50" r="13" fill="#34d982" ${SK}/><text x="50" y="57" font-size="20" font-weight="900" text-anchor="middle" fill="#0d1230" font-family="Arial">$</text>`,
    scissors: `<circle cx="28" cy="72" r="12" fill="#ff5c73" ${SK}/><circle cx="28" cy="34" r="12" fill="#ff5c73" ${SK}/><path d="M38 66L88 30M38 40l50 36" stroke="#c0c0cc" stroke-width="9" stroke-linecap="round"/><path d="M38 66L88 30M38 40l50 36" fill="none" stroke="#0d1230" stroke-width="2"/><circle cx="56" cy="53" r="4" fill="#0d1230"/>`,
    pick: `<path d="M30 84L68 30" stroke="#8a5a2b" stroke-width="10" stroke-linecap="round"/><path d="M30 84L68 30" fill="none" stroke="#0d1230" stroke-width="2"/><path d="M40 20q30-6 48 22q-22-12-44-6z" fill="#c0c0cc" ${SK}/>`,
    bank2: `<path d="M50 10l40 20H10z" fill="#ffc94d" ${SK}/><path d="M14 30h72v6H14zM14 80h72v8H14z" fill="#f2f4ff" ${SK}/><path d="M22 38h8v40h-8zM40 38h8v40h-8zM58 38h8v40h-8zM74 38h8v40h-8z" fill="#f2f4ff" ${SK}/>`,
    bank: `<path d="M50 10l40 20H10z" fill="#ffc94d" ${SK}/><path d="M14 30h72v6H14zM14 80h72v8H14z" fill="#f2f4ff" ${SK}/><path d="M22 38h8v40h-8zM40 38h8v40h-8zM58 38h8v40h-8zM74 38h8v40h-8z" fill="#f2f4ff" ${SK}/><path d="M46 46l6 10-5 8 7 12" fill="none" stroke="#ff5c73" stroke-width="3"/>`,
    split: `<path d="M12 50h30l40-28M42 50l40 28" fill="none" stroke="#0d1230" stroke-width="12" stroke-linecap="round"/><path d="M12 50h30l40-28" fill="none" stroke="#f7931a" stroke-width="6" stroke-linecap="round"/><path d="M42 50l40 28" fill="none" stroke="#9aa2d6" stroke-width="6" stroke-linecap="round"/>`,
    rocket: `<path d="M50 8c16 14 20 34 14 58H36C30 42 34 22 50 8z" fill="#f2f4ff" ${SK}/><circle cx="50" cy="36" r="8" fill="#7cc4ff" ${SK}/><path d="M36 54l-12 18 14-4zM64 54l12 18-14-4z" fill="#ff5c73" ${SK}/><path d="M42 66q8 22 16 0" fill="#ffc94d" ${SK}/>`,
    volcano: `<path d="M6 92l30-50h28l30 50z" fill="#8a5a2b" ${SK}/><path d="M36 42q14 10 28 0l-4 14q-10 6-20 0z" fill="#ff5c73" ${SK}/><path d="M44 30q-6-14 4-22M56 30q6-12-2-20" fill="none" stroke="#c9cbe0" stroke-width="5" stroke-linecap="round"/><path d="M58 60l-10 14h8l-6 12 14-18h-8l6-8z" fill="#ffe066" ${SK}/>`,
    flag: `<path d="M18 10v84" ${SK}/><path d="M18 14h66v54H18z" fill="#fff" ${SK}/><path d="M20 16h62v15H20zM20 51h62v15H20z" fill="#2f6fd6"/><circle cx="51" cy="41" r="6" fill="#ffc94d" stroke="#0d1230" stroke-width="2"/>`,
    phone: `<path d="M30 8h40v84H30z" fill="#2b3478" ${SK} rx="8"/><path d="M35 16h30v62H35z" fill="#7cc4ff"/><path d="M54 26l-12 20h10l-6 18 16-24H52l6-14z" fill="#ffe066" stroke="#0d1230" stroke-width="2"/>`,
    bolt: `<path d="M58 6L26 54h20l-8 40 36-54H52l10-34z" fill="#ffe066" ${SK}/>`,
    sprout: `<path d="M50 92V48" stroke="#1a9e5a" stroke-width="7" stroke-linecap="round"/><path d="M50 56C30 58 16 44 16 26c22 0 34 12 34 30zM50 46c4-18 18-28 36-26 0 20-16 30-36 26z" fill="#34d982" ${SK}/><path d="M22 92h56" ${SK}/>`,
    tower: `<path d="M26 14h48v78H26z" fill="#7cc4ff" ${SK}/><path d="M34 24h10v10H34zM56 24h10v10H56zM34 44h10v10H34zM56 44h10v10H56zM34 64h10v10H34zM56 64h10v10H56z" fill="#2b3478"/><path d="M26 14h48v8H26z" fill="#ff5c73" ${SK}/>`,
    boom: `<path d="M50 6l9 22 22-12-8 24 22 6-22 10 14 20-24-6-4 24-12-20-16 18 2-24-22 2 16-18-18-14 24-2-6-24 20 12z" fill="#ffe066" ${SK}/><path d="M50 28l5 14 14-6-6 14 12 6-14 4 6 12-14-4-4 12-6-12-10 8 2-12-12-2 10-10-8-10 14 2z" fill="#ff5c73"/>`,
    bull: `<path d="M24 26q-14-4-14-18 10 4 20 12M76 26q14-4 14-18-10 4-20 12" fill="#fff4d6" ${SK}/><circle cx="50" cy="48" r="30" fill="#34d982" ${SK}/><ellipse cx="50" cy="64" rx="20" ry="14" fill="#b6f5cf" ${SK}/><circle cx="43" cy="62" r="3" fill="#0d1230"/><circle cx="57" cy="62" r="3" fill="#0d1230"/><circle cx="50" cy="80" r="5" fill="none" stroke="#ffc94d" stroke-width="4"/><path d="M34 40h12v8H34zM54 40h12v8H54zM46 43h8" fill="#0d1230" stroke="#0d1230" stroke-width="2"/>${hl(36, 30, 8, 3)}`,
    trophy: `<path d="M30 14h40v22c0 16-8 26-20 26s-20-10-20-26z" fill="#ffc94d" ${SK}/><path d="M30 22H16c0 14 6 20 16 20M70 22h14c0 14-6 20-16 20" fill="none" ${SK}/><path d="M44 62h12v12H44zM32 74h36v12H32z" fill="#e0a000" ${SK}/><text x="50" y="44" font-size="20" font-weight="900" text-anchor="middle" fill="#b86e00" font-family="Arial">₿</text>${hl(40, 22, 5, 2)}`,
  };
  const art = n => `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">${ART[n]}</svg>`;

  // Zeichnung je Welt (Weltsymbol und Karte im Lernpfad)
  const CARD = {whitepaper: "scroll", start: "go", konsens: "shake", zyklen: "coaster", besitzer: "pie", kaufen: "cart", mythen: "myth", kritik: "scale", privatsphaere: "shades", script: "term", entropie: "dice", blockbau: "block", hyperinflation: "printer", goldstandard: "trophy", vorlaeufer: "laptop", krimis: "hood", satoshi: "satoshi", offline: "phone", psycho: "mirror", lnnetz: "bolt", ableitung: "factory", sha256: "gear", kurven: "curve", signaturen: "pen", adressen: "tag", merkle: "tree", quanten: "atom", geld: "shell", geldgeschichte: "trophy", geldschoepfung: "printer", cantillon: "tower", knappheit: "gauge", doppelt: "copy", wert: "coin", risiken: "eye", reise: "phone", eigenschaften: "scale", inflation: "dollar", halving: "scissors", geschichte: "pizza", wallets: "bank2", seed: "letter", senden: "phone", betrug: "mask", krypto: "rocket",
    sparplan: "pig", fomo: "boom", hebel: "volcano", utxo: "bag", bahnhof: "train", lightning: "bolt", hashing: "finger", schluessel: "key", blockchain: "chain", mining: "pick", nodes: "server"};

  // ---------- Tages-Challenge mit Serie ----------
  const DAILY = [
    ["Was ist das Doppelausgabe-Problem?", ["Digitales Geld könnte kopiert und zweimal ausgegeben werden", "Man zahlt doppelte Gebühren", "Man braucht zwei Wallets"], 0, "Bitcoin löst es mit einem gemeinsamen Kassenbuch, das alle prüfen."],
    ["Ist Bitcoin anonym?", ["Nein, pseudonym: Adressen statt Namen, aber alles öffentlich", "Ja, komplett", "Nur bei Lightning"], 0, "Wird eine Adresse dir zugeordnet, ist deine Geschichte sichtbar."],
    ["Wie viele neue Bitcoin entstehen derzeit ungefähr pro Tag?", ["Etwa 450", "Etwa 45.000", "Etwa 5"], 0, "144 Blöcke × 3,125 BTC."],
    ["Wie viele Bitcoin wird es höchstens geben?", ["21 Millionen", "100 Millionen", "Unbegrenzt"], 0, "Die Obergrenze von 21 Millionen steht fest im Code."],
    ["Wie heißt die kleinste Bitcoin-Einheit?", ["Satoshi (Sat)", "Bit", "Cent"], 0, "1 Bitcoin = 100 Millionen Sats, benannt nach dem Erfinder."],
    ["Wie oft halbiert sich die Belohnung für Miner?", ["Etwa alle 4 Jahre", "Jedes Jahr", "Nie"], 0, "Alle 210.000 Blöcke, das sind ungefähr 4 Jahre."],
    ["Wer darf deine Seed-Wörter wissen?", ["Niemand", "Der Support deiner Wallet", "Deine Bank"], 0, "Wer die Wörter kennt, hat deine Bitcoin. Echter Support fragt nie danach."],
    ["Wie lange dauert es im Schnitt bis zum nächsten Block?", ["Etwa 10 Minuten", "Etwa 1 Sekunde", "Etwa 1 Tag"], 0, "Die Schwierigkeit passt sich an, damit es im Schnitt bei 10 Minuten bleibt."],
    ["Was passiert mit einer Münze (UTXO), wenn du nur einen Teil zahlst?", ["Sie wird ganz ausgegeben, der Rest kommt als Wechselgeld zurück", "Sie wird geteilt", "Das geht nicht"], 0, "Wie beim Bargeld: ganz ausgeben, Wechselgeld zurück."],
    ["Wann wurde der erste Bitcoin-Block erzeugt?", ["Januar 2009", "Dezember 2017", "März 2000"], 0, "Der Genesis-Block entstand am 3. Januar 2009."],
    ["Wofür steht „HODL“ in der Bitcoin-Welt?", ["Halten statt verkaufen", "Eine Börse", "Ein Wallet-Typ"], 0, "Ursprünglich ein Tippfehler von „hold“ aus einem Forum 2013, heute ein Motto."],
    ["Was macht eine Node?", ["Sie prüft jeden Block nach den Regeln", "Sie druckt neue Bitcoin", "Sie legt den Preis fest"], 0, "Nodes prüfen und verbreiten Blöcke und Transaktionen."],
    ["Was ist Lightning?", ["Ein Netz für schnelle, günstige Zahlungen auf Bitcoin", "Ein neuer Coin", "Eine Börse"], 0, "Lightning nutzt Kanäle, um Zahlungen in Sekunden abzuwickeln."],
    ["Was bedeutet „Nicht deine Schlüssel, nicht deine Bitcoin“?", ["Wer die Schlüssel nicht selbst hat, besitzt nur ein Versprechen", "Man braucht keine Schlüssel", "Schlüssel gehören der Bank"], 0, "Auf einer Börse gehören die Schlüssel der Börse."],
    ["Was zeigt ein Hash?", ["Einen eindeutigen Fingerabdruck von Daten", "Den Bitcoin-Preis", "Deine Adresse"], 0, "Schon ein geändertes Zeichen ergibt einen völlig anderen Hash."],
    ["Was ist ein typisches Betrugs-Signal?", ["Garantierte hohe Gewinne", "Open-Source-Code", "Lange Erfahrung"], 0, "Wer Rendite verspricht, will meistens dein Geld."],
    ["Wer bekommt die Gebühren einer Transaktion?", ["Der Miner, der den Block findet", "Die Bitcoin-Firma", "Der Staat"], 0, "Gebühren und neue Bitcoin bilden den Lohn der Miner."],
    ["Was ist ein Sparplan (DCA)?", ["Regelmäßig den gleichen Betrag kaufen", "Alles auf einmal kaufen", "Mit Hebel kaufen"], 0, "So musst du nicht den perfekten Zeitpunkt treffen."],
    ["Was passiert bei einer Liquidation?", ["Die Börse schließt die Hebel-Wette, der Einsatz ist weg", "Du bekommst Zinsen", "Nichts"], 0, "Bitcoin ohne Hebel kann nie liquidiert werden."],
    ["Wie viele Blöcke liegen zwischen zwei Halvings?", ["210.000", "2.016", "21.000.000"], 0, "2.016 Blöcke ist der Abstand der Schwierigkeits-Anpassung."],
    ["Wer ist Satoshi Nakamoto?", ["Der unbekannte Erfinder von Bitcoin", "Ein japanischer Bankchef", "Ein Börsen-CEO"], 0, "Bis heute weiß niemand, wer dahintersteckt."],
    ["Was kauften 2010 zwei Pizzen?", ["10.000 Bitcoin", "1 Bitcoin", "100 Bitcoin"], 0, "Der 22. Mai ist seitdem der Bitcoin-Pizza-Tag."],
    ["Was ist eine Soft Fork?", ["Ein Upgrade mit strengeren Regeln, alte Nodes bleiben kompatibel", "Eine Abspaltung in zwei Coins", "Ein Hackerangriff"], 0, "SegWit und Taproot waren Soft Forks."],
    ["Was ist eine Hardware-Wallet?", ["Ein Gerät, das den Schlüssel offline hält", "Eine Börse", "Ein USB-Stick mit Bitcoin drauf"], 0, "Die Bitcoin liegen in der Blockchain, das Gerät schützt nur den Schlüssel."],
    ["Was heißt FOMO?", ["Angst, etwas zu verpassen", "Ein Mining-Gerät", "Eine Gebühr"], 0, "FOMO verleitet dazu, teuer zu kaufen."],
    ["Womit unterschreibst du eine Bitcoin-Zahlung?", ["Mit deinem privaten Schlüssel", "Mit deiner Adresse", "Mit deinem Passwort bei der Börse"], 0, "Prüfen kann jeder mit dem öffentlichen Schlüssel."],
    ["Was verbindet die Blöcke miteinander?", ["Jeder Block enthält den Hash des vorherigen", "Ein Server", "Die Uhrzeit"], 0, "Deshalb fällt jede Änderung an alten Blöcken sofort auf."],
    ["Welche Einheit nutzt man für Gebühren?", ["sat/vB (Sats pro virtuellem Byte)", "Euro pro Bitcoin", "Prozent vom Betrag"], 0, "Die Gebühr hängt von der Größe der Transaktion ab, nicht vom Betrag."],
    ["Was ist die Mempool?", ["Der Warteraum für unbestätigte Transaktionen", "Ein Mining-Pool", "Eine Wallet"], 0, "Miner suchen sich dort die Transaktionen mit den höchsten Gebühren aus."],
    ["Welches Land machte Bitcoin 2021 zum Zahlungsmittel?", ["El Salvador", "Deutschland", "Japan"], 0, "El Salvador war das erste Land der Welt."],
    ["Was ist Inflation?", ["Dein Geld verliert an Kaufkraft", "Der Bitcoin-Kurs steigt", "Banken zahlen Zinsen"], 0, "Dieselben Dinge kosten mit der Zeit mehr Geld."],,
    ["Was kostet beim Kauf oft mehr als die sichtbare Gebühr?", ["Der Spread, ein Aufschlag auf den Kurs", "Die Wallet", "Das Internet"], 0, "Prüf immer die Gesamtkosten."],
    ["Wem gehören Bitcoin auf einer Börse?", ["Erstmal der Börse", "Immer dir", "Dem Staat"], 0, "Erst in deiner eigenen Wallet gehören sie wirklich dir."],
    ["Wie lange dauerte es nach großen Crashs meist bis zum neuen Rekord?", ["2 bis 3 Jahre", "2 Wochen", "Nie"], 0, "Geduld war bisher Pflicht. Garantie gibt es keine."],
    ["Wann kommt der digitale Euro frühestens für alle?", ["2029", "2025", "Er ist schon da"], 0, "Wenn sich die EU rechtzeitig einigt."],
    ["Wie viele Bitcoin hat Satoshi geschätzt?", ["Etwa 1,1 Millionen", "Genau 21", "Keine"], 0, "Sie haben sich seit 2009 nie bewegt."],
    ["Woran erkennt man oft das Wechselgeld einer Zahlung?", ["Am krummen Betrag", "Am runden Betrag", "Gar nicht"], 0, "Zahlungen sind oft runde Beträge."],
    ["Wie viele Runden hat SHA-256?", ["64", "2", "1.000"], 0, "Jede Runde mischt die Bits weiter durch."],
    ["Wie viel Zufall steckt in 12 Seed-Wörtern?", ["128 Bit", "12 Bit", "2048 Bit"], 0, "Mehr Möglichkeiten als Sandkörner auf der Erde."],
    ["Was macht eine Schnorr-Signatur besonders?", ["Mehrere Schlüssel lassen sich zu einem bündeln", "Sie ist unendlich groß", "Sie braucht keinen Schlüssel"], 0, "Kam 2021 mit Taproot."],
    ["Was steht im Block-Kopf, um alle Zahlungen zusammenzufassen?", ["Die Merkle-Root", "Alle Namen", "Der Seed"], 0, "Ein einziger Hash über alle Zahlungen."],
    ["Was bedeutet 2-von-3 Multisig?", ["2 von 3 Schlüsseln müssen unterschreiben", "2 Bitcoin für 3 Personen", "3 Adressen, 2 Seeds"], 0, "Ideal für Familie und Erbschaft."],
    ["Welches alte Problem löst Bitcoin mit Proof of Work?", ["Das Problem der byzantinischen Generäle", "Das Rätsel der Sphinx", "Das Ziegenproblem"], 0, "Wie sich Fremde einigen, wenn manche lügen."],
    ["Was passiert mit einem verwaisten Block?", ["Seine Zahlungen landen in einem späteren Block", "Das Geld ist weg", "Er wird gelöscht und alle Zahlungen verfallen"], 0, "Verwaiste Blöcke sind normal und harmlos."],
    ["Wie lange dauert eine Difficulty-Periode ungefähr?", ["2 Wochen", "2 Minuten", "2 Jahre"], 0, "2.016 Blöcke à 10 Minuten."]
  ];
  const DK = "satsland-daily", ymd = d => d.toLocaleDateString("sv-SE"), today = () => ymd(new Date());
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return ymd(d); };
  function streak(){ let d = {}; try { d = JSON.parse(localStorage.getItem(DK)) || {}; } catch(e){}
    if (d.last !== today() && d.last !== yesterday()) d.streak = 0; return d; }
  function daily(box){
    const day = Math.floor(new Date(today()).getTime()/864e5), [q, opts, ok, why] = DAILY[day % DAILY.length], d = streak(), doneToday = d.last === today();
    const order = opts.map((o, i) => [((day*7 + i*13) % 11), i, o]).sort((a, b) => a[0] - b[0]);
    box.innerHTML = `<div class="dh"><span class="fl ${d.streak ? "on" : ""}">🔥 <b>${d.streak || 0}</b></span><span>Tag${d.streak === 1 ? "" : "e"} in Folge${d.best ? ` · Rekord ${d.best}` : ""}</span></div>
      <p class="dq">${q}</p><div class="opts">${order.map(([, i, o]) => `<button type="button" data-i="${i}" ${doneToday ? "disabled" : ""} class="${doneToday && i === ok ? "ok" : ""}">${o}</button>`).join("")}</div>
      <p class="why" ${doneToday ? "" : "hidden"}>${doneToday ? (d.ok ? "✓ Heute geschafft! " : "Heute war's knapp. ") + why + " Morgen gibt's eine neue Frage." : ""}</p>`;
    if (doneToday) return;
    box.querySelector(".opts").onclick = e => { const b = e.target.closest("button"); if (!b) return;
      const right = +b.dataset.i === ok, s = streak();
      s.streak = (s.last === yesterday() ? s.streak || 0 : 0) + 1; s.best = Math.max(s.best || 0, s.streak); s.last = today(); s.ok = right;
      try { localStorage.setItem(DK, JSON.stringify(s)); } catch(e){}
      daily(box); if (!right) box.querySelector(`[data-i="${b.dataset.i}"]`).classList.add("no");
      if ([3, 7, 14, 30, 100].includes(s.streak)){ confetti(); toast(`🔥 ${s.streak} Tage in Folge! Weiter so.`); }
      else toast(right ? "🔥 Richtig! Serie: " + s.streak : "🔥 Serie gehalten: " + s.streak + ". Mitmachen zählt!");
      say(right ? "Stark! Bis morgen bei der nächsten Frage." : "Fast! Wichtig ist, dass du dranbleibst."); titles();
    };
  }

  // ---------- Planki als Begleiter: bleibt klein und reitet auf deinem Rang-Tier mit ----------
  const TIPS = {
    "": "Folge dem Pfad Level für Level. Mit jedem Level wächst du ein Stück, bis du ein Wal bist. Ich reite mit!",
    whitepaper: "Neun Seiten, die die Welt verändert haben. Lies mit mir!",
    start: "Willkommen! In 6 Szenen zeige ich dir das große Bild.",
    konsens: "Tausende Fremde, ein Kassenbuch. Wie geht das ohne Chef?",
    zyklen: "Anschnallen! Bitcoin fährt Achterbahn, seit es ihn gibt.",
    besitzer: "21 Millionen Bitcoin, aber wer hat sie eigentlich?",
    kaufen: "Bitcoin kaufen ist leicht. Richtig kaufen lernst du hier!",
    mythen: "Kriminalität, Strom, Schneeball? Prüfen wir die Gerüchte!",
    kritik: "Jetzt die Gegenseite: Was spricht wirklich gegen Bitcoin?",
    privatsphaere: "Psst! Jede Zahlung ist öffentlich. Werde zum Spuren-Detektiv.",
    script: "Jede Zahlung hat ein kleines Programm. Lass uns den Stapel füttern!",
    entropie: "Zufall ist dein bester Bodyguard. Wirf mal ein paar Würfel!",
    ableitung: "Hier siehst du, was deine Wallet heimlich rechnet: von 12 Wörtern bis zur Adresse.",
    sha256: "Wir schrauben die Hash-Maschine auf. Keine Angst, Runde für Runde!",
    kurven: "Punkte addieren auf einer Kurve? Klingt verrückt, schützt aber alle Bitcoin.",
    signaturen: "Zwei Unterschriften treten gegeneinander an. Wer gewinnt?",
    adressen: "1…, 3…, bc1q…, bc1p…: Willkommen im Adress-Zoo!",
    merkle: "Wie passen tausende Zahlungen in einen Hash? Mit einem Baum!",
    blockbau: "Jetzt bist du Miner! Welche Zahlungen packst du ein?",
    hyperinflation: "Ein Brot für 201 Milliarden Mark? Das ist wirklich passiert!",
    goldstandard: "Gold war mal Geld. Bis die Regeln geändert wurden …",
    vorlaeufer: "Bitcoin hatte Vorfahren. Bau es aus ihren Teilen zusammen!",
    krimis: "Sechs Akten, sechs echte Fälle. Kannst du sie lösen?",
    satoshi: "Wer ist Satoshi wirklich? Ermittle selbst!",
    offline: "Internet weg? Bitcoin findet einen Weg, sogar per Brieftaube!",
    psycho: "Drei Experimente, und du bist die Versuchsperson!",
    lnnetz: "Finde den Weg durchs Blitz-Netz, ohne dass ein Kanal leerläuft!",
    quanten: "Quantencomputer: Panik oder Popcorn? Schauen wir nüchtern hin.",
    geld: "Hi, ich bin Planki! Bevor es um Bitcoin geht: Was ist eigentlich Geld?",
    geldgeschichte: "5.000 Jahre Geld in 9 Stationen. Achte darauf, was immer wieder schiefging.",
    geldschoepfung: "Spiel Bank und vergib einen Kredit. Du wirst staunen, woher das Geld kommt.",
    cantillon: "Wer bekommt neues Geld zuerst? Schau genau hin.",
    knappheit: "Knapper als Gold? Schieb mal das Jahr nach vorne.",
    doppelt: "Versuch mal, eine Münze zweimal auszugeben.",
    wert: "Warum zahlen Menschen für Bitcoin? Kipp mal die Waage.",
    risiken: "Was kann wirklich schiefgehen? Alle Risiken auf einen Blick.",
    reise: "Begleite deine Zahlung durch alle 7 Stationen. Das ist das große Ganze!",
    eigenschaften: "Rate, welches Geld gewinnt. Tipp: Gold ist ein harter Gegner.",
    inflation: "Schau, wie dein Einkaufswagen schrumpft. Genau das ist Inflation.",
    halving: "Alle 4 Jahre halbiert sich die Belohnung. Das macht Bitcoin knapp.",
    geschichte: "Drück auf ▶ Abspielen, dann zeige ich dir die Geschichte von Bitcoin.",
    wallets: "Nicht deine Schlüssel, nicht deine Bitcoin. Merk dir das!",
    seed: "Deine Seed-Wörter sind alles. Nie abfotografieren, nie online speichern!",
    senden: "Erst Anfang und Ende der Adresse prüfen, dann senden. Immer!",
    betrug: "Satoshi schreibt dir nie. Wer sich als Satoshi ausgibt, ist ein Betrüger.",
    krypto: "Es gibt Tausende Coins. Prüf jeden mit den sechs Fragen.",
    sparplan: "Regelmäßig kaufen schlägt Timing. Probier verschiedene Startjahre.",
    fomo: "Kannst du ruhig bleiben, wenn alle schreien? Ich bin gespannt.",
    hebel: "Hebel ist wie eine Lupe. Auch für deine Verluste!",
    utxo: "Bitcoin ist wie Bargeld: Du bekommst Wechselgeld zurück.",
    bahnhof: "Wer mehr Gebühr zahlt, fährt im nächsten Zug mit.",
    lightning: "Mit Lightning zahlst du in Sekunden, fast gratis.",
    hashing: "Ändere nur ein einziges Zeichen und staune.",
    schluessel: "Mit dem privaten Schlüssel unterschreibst du. Den kennt nur dein Gerät.",
    blockchain: "Versuch mal, einen alten Block zu fälschen. Viel Glück!",
    mining: "Probier selbst zu minen. Ganz schön viel Arbeit, oder?",
    nodes: "Nodes gehorchen niemandem, nur den Regeln.",
  };
  const GK = "satsland-guide-off";
  let gTimer = 0;
  function say(text, ms = 7000){ if (window.__sweep) return;
    const g = document.querySelector(".guide"); if (!g) return;
    const b = g.querySelector(".gb"); b.querySelector("span").textContent = text; g.classList.add("talk");
    clearTimeout(gTimer); gTimer = setTimeout(() => g.classList.remove("talk"), ms);
  }
  function guide(){
    let off = false; try { off = localStorage.getItem(GK) === "1"; } catch(e){}
    if (off || !(here in TIPS) && here) return;
    const g = document.createElement("div"); g.className = "guide";
    g.innerHTML = `<div class="gb"><span></span><button type="button" class="gx" aria-label="Sprechblase schließen">×</button></div><button type="button" class="gs" aria-label="Planki fragen">${art("plankton")}</button>`;
    document.body.appendChild(g);
    const tip = () => !here && !count(load()) ? "Willkommen! Ich bin Planki und begleite dich. Tipp oben auf den gelben Knopf, dann geht's mit Level 1 los." : TIPS[here] || TIPS[""];
    g.querySelector(".gs").onclick = () => say(tip());
    g.querySelector(".gx").onclick = () => { clearTimeout(gTimer); g.classList.remove("talk"); };   // × schließt nur die Blase, Planki bleibt
    g.querySelector(".gb span").onclick = () => g.classList.remove("talk");   // Antippen schließt die Blase
    // Jeder Tipp kommt nur beim ersten Besuch der Seite von selbst, danach nur auf Antippen
    let seen = []; try { seen = JSON.parse(localStorage.getItem("satsland-tipseen")) || []; } catch(e){}
    if (!seen.includes(here)) setTimeout(() => { if (document.querySelector(".intro")) return; say(tip(), 5500); try { localStorage.setItem("satsland-tipseen", JSON.stringify(seen.concat(here))); } catch(e){} }, 900);
  }
  // Dein Rang-Tier mit Planki als kleinem Reiter obendrauf
  const SEAT = {shrimp: [27, 24], crab: [32, 4], fish: [32, -3], dolphin: [27, -2], shark: [22, 3], humpback: [32, -2], whale: [40, -6]};   // Sitzplatz auf dem Rücken (links, oben in %)
  const ride = k => `<span class="ride">${art(k)}${SEAT[k] ? `<span class="rider" style="left:${SEAT[k][0]}%;top:${SEAT[k][1]}%">${art("plankton")}</span>` : ""}</span>`;
  const PRAISE = ["Stark! 💪", "Genau so!", "Du hast's drauf!", "Richtig! Weiter so."], OOPS = ["Fast! Lies kurz die Erklärung.", "Kein Problem, so lernt man.", "Knapp daneben. Jetzt weißt du's!"];
  const pickOne = a => a[Math.floor(Math.random()*a.length)];


  // ---------- Comic-Intro je Welt: kurzes animiertes Panel unter der Überschrift ----------
  const sa = (n, x, y, z, an = "", d = 0, st = "") => `<span class="a" style="left:${x}%;top:${y}%;width:${z}px;height:${z}px;${an ? `animation:${an};${d ? `animation-delay:${d}s;` : ""}` : ""}${st}">${art(n)}</span>`;
  const sl = (t, x, y, d = 0) => `<span class="lbl" style="left:${x}%;top:${Math.min(y, 82)}%;animation-delay:${d}s">${t}</span>`;
  const sf = (n, fx, fy, x, y, z, d) => sa(n, x, y, z, "fly 1.3s cubic-bezier(.3,.7,.3,1) both", d, `--fx:${fx}%;--fy:${fy}%`);
  const INTRO = {
    geld: ["day", "Fisch gegen Brot? Schwierig …", sa("shell", 24, 60, 56, "grow .5s both", .2) + sa("bag", 50, 56, 66, "grow .5s both", .6) + sa("coin", 78, 60, 56, "grow .5s both", 1) + sl("Was ist Geld?", 50, 88, 1.4)],
    geldschoepfung: ["night", "Woher kommt eigentlich Geld?", sa("bank2", 30, 60, 76) + sf("dollar", 30, 60, 74, 56, 56, .8) + sl("Kredit = neues Geld", 70, 88, 1.6)],
    cantillon: ["dusk", "Das neue Geld kommt …", sa("printer", 16, 60, 56) + sf("coin", 16, 60, 40, 56, 30, .5) + sf("coin", 16, 60, 62, 60, 30, 1) + sf("coin", 16, 60, 84, 64, 30, 1.5) + sl("… nicht bei allen gleich", 60, 88, 2)],
    knappheit: ["night", "Wie knapp ist knapp?", sa("gauge", 34, 56, 86, "grow .5s both") + sa("coin", 74, 60, 56, "bobA 1.4s ease-in-out infinite") + sl("Bestand ÷ Neues", 70, 88, 1)],
    doppelt: ["night", "Strg+C, Strg+V?", sa("coin", 30, 46, 60) + sa("copy", 66, 46, 64, "grow .5s both", .6) + sl("Aus 1 werden 2?!", 50, 88, 1.2)],
    wert: ["day", "Was ist Bitcoin wert?", sa("scale", 50, 52, 76, "tilt 1.6s cubic-bezier(.3,1.6,.5,1) both", .2, "transform:translate(-50%,-50%) rotate(-12deg)") + sa("bag", 22, 42, 36, "grow .4s both", .6) + sa("coin", 78, 42, 36, "grow .4s both", .9) + sl("Angebot ⚖️ Nachfrage", 50, 88, 1.4)],
    risiken: ["night", "Was kann schiefgehen?", sa("gauge", 50, 50, 86, "grow .6s both", .2) + sa("key", 16, 64, 44, "bobA 1.6s ease-in-out infinite") + sa("coaster", 84, 64, 50, "bobA 1.8s ease-in-out infinite", .4) + sl("Ehrlich, ohne Panik", 50, 88, 1)],
    eigenschaften: ["day", "Wer ist das beste Geld?", sa("dollar", 22, 60, 64, "grow .5s both", .2) + sa("trophy", 50, 56, 74, "grow .5s both", .5) + sa("coin", 78, 60, 64, "grow .5s both", .8) + sl("Das Duell beginnt!", 50, 88, 1.2)],
    inflation: ["dusk", "Alles wird teurer …", sa("dollar", 34, 60, 84, "shrink 2.4s ease .6s both") + sa("bag", 72, 60, 64) + sl("Kaufkraft schrumpft", 50, 88, 1)],
    halving: ["night", "Schnipp, schnapp: halbiert!", sa("coin", 24, 62, 70) + sa("scissors", 50, 58, 60, "cut .6s ease 3", .3) + sa("coin", 76, 66, 40, "grow .5s both", 1.8) + sl("50 → 25 → … → 3,125", 50, 88, 1.4)],
    wallets: ["day", "Hol dir deine Schlüssel!", sa("bank2", 22, 60, 76) + sf("key", 22, 60, 76, 58, 52, .6) + sa("phone", 80, 62, 60) + sl("Nicht deine Schlüssel …", 50, 88, 1.6)],
    seed: ["dusk", "12 oder 24 Wörter = alles", sa("letter", 32, 60, 72, "grow .5s both", .2) + sa("key", 70, 58, 64, "bobA 1.6s ease-in-out infinite", .8) + sl("Offline aufschreiben!", 50, 88, 1)],
    senden: ["day", "Zahlung unterwegs!", sa("phone", 30, 60, 70, "bobA 1.6s ease-in-out infinite") + sa("coin", 68, 58, 56, "bobA 1.4s ease-in-out infinite", .5) + sl("Adresse prüfen!", 50, 88, 1)],
    betrug: ["night", "Psst … gratis Bitcoin?", sa("mask", 30, 50, 64, "sshake .5s ease .6s 3") + sa("phone", 74, 50, 52) + sl("Achtung, Falle!", 50, 88, 1.4)],
    krypto: ["day", "1000x garantiert!!!", sa("rocket", 30, 62, 66, "rocket 3s ease-in-out .3s both") + sa("coin", 72, 60, 66, "grow .5s both", .4) + sl("Lieber erst prüfen", 50, 88, 1.6)],
    sparplan: ["dawn", "Jeden Monat ein bisschen", sa("pig", 64, 62, 80) + sf("coin", 64, -20, 64, 40, 34, .3) + sf("coin", 64, -20, 64, 40, 34, 1.3) + sf("coin", 64, -20, 64, 40, 34, 2.3) + sl("Klein, aber regelmäßig", 30, 88, 1)],
    fomo: ["dusk", "Kaufen?! Verkaufen?!", `<svg class="line" viewBox="0 0 400 170"><path d="M10 112 C120 108 200 98 250 40 C270 28 280 36 300 98 L390 112" stroke="#f7931a"/></svg>` + sa("fomo", 16, 52, 56, "bobA 1s ease-in-out infinite") + sl("Ruhig bleiben!", 76, 86, 2.4)],
    hebel: ["dusk", "10× Hebel? Easy!", sa("volcano", 34, 50, 72) + sa("boom", 66, 44, 64, "grow .4s both", 1.6) + sl("BOOM. Einsatz weg.", 66, 88, 2)],
    utxo: ["day", "Wechselgeld, bitte!", sa("bag", 22, 60, 66) + sf("coin", 22, 60, 60, 56, 40, .5) + sf("coin", 22, 60, 82, 62, 30, 1) + sl("Rest kommt zurück", 70, 88, 1.6)],
    bahnhof: ["night", "Mehr Gebühr, früher dran", sa("train", 50, 64, 80, "halt 7s ease-in-out .2s infinite")],
    lightning: ["night", "Bezahlt in 1 Sekunde", sa("phone", 18, 48, 56) + sa("phone", 82, 48, 56) + sa("bolt", 50, 42, 48, "szap 1s ease .3s 3") + sl("⚡ fast gratis", 50, 88, 1.2)],
    hashing: ["night", "Jeder Text: ein Fingerabdruck", sa("news", 22, 60, 66) + sf("finger", 22, 60, 76, 58, 66, .6) + sl("Ein Zeichen anders = alles anders", 50, 90, 1.6)],
    schluessel: ["dawn", "Unterschrift mit Schlüssel", sa("key", 28, 48, 64, "bobA 1.4s ease-in-out infinite") + sa("letter", 72, 48, 64, "grow .5s both", .5) + sl("✓ echt", 72, 88, 1.4)],
    blockchain: ["night", "Block an Block an Block", sa("block", 20, 62, 54, "drop .7s cubic-bezier(.3,1.4,.5,1) both", .2, "top:62%") + sa("block", 44, 62, 54, "drop .7s cubic-bezier(.3,1.4,.5,1) both", .7, "top:62%") + sa("block", 68, 62, 54, "drop .7s cubic-bezier(.3,1.4,.5,1) both", 1.2, "top:62%") + sa("chain", 32, 62, 26, "grow .4s both", 1.4) + sa("chain", 56, 62, 26, "grow .4s both", 1.6) + sa("chain", 82, 62, 26, "grow .4s both", 1.8, "opacity:.45")],
    mining: ["dusk", "Raten, raten … Treffer!", sa("pick", 34, 48, 64, "swing .5s ease-in-out 4") + sa("block", 66, 50, 56, "grow .5s both", 2.2) + sl("Neuer Block!", 66, 88, 2.4)],
    nodes: ["night", "Tausende Wächter prüfen alles", sa("server", 18, 62, 52, "grow .4s both", .1) + sa("server", 39, 62, 52, "grow .4s both", .3) + sa("server", 61, 62, 52, "grow .4s both", .5) + sa("server", 82, 62, 52, "grow .4s both", .7) + sl("✓ ✓ ✓ ✓", 50, 22, 1.2)],
    // Profi-Vertiefungen
    whitepaper: ["night", "9 Seiten, die alles änderten", sa("scroll", 34, 50, 64, "grow .5s both", .2) + sa("satoshi", 72, 50, 56, "bobA 1.6s ease-in-out infinite", .6) + sl("31.10.2008", 50, 88, 1.2)],
    sha256: ["night", "Die Maschine aufschrauben", sa("gear", 30, 56, 64, "grow .5s both", .2) + sa("factory", 68, 58, 72, "grow .5s both", .6) + sl("64 Runden", 50, 88, 1.2)],
    kurven: ["dusk", "Springen auf der Kurve", sa("curve", 50, 48, 72, "grow .6s both", .2) + sa("key", 16, 64, 40, "bobA 1.4s ease-in-out infinite", .8) + sl("y² = x³ + 7", 50, 88, 1.2)],
    signaturen: ["dawn", "Zwei Arten zu unterschreiben", sa("pen", 32, 56, 64, "grow .5s both", .2) + sa("letter", 68, 56, 64, "grow .5s both", .6) + sl("ECDSA ⚔️ Schnorr", 50, 88, 1.2)],
    adressen: ["day", "1…, 3…, bc1…?", sa("letter", 30, 58, 64, "grow .5s both", .2) + sa("tag", 70, 56, 56, "grow .5s both", .6) + sl("Tippfehler? Erwischt!", 50, 88, 1.2)],
    merkle: ["night", "Tausende Zahlungen, ein Hash", sa("tree", 50, 52, 66, "grow .6s both", .2) + sl("Merkle-Root", 50, 88, 1.2)],
    script: ["night", "Schlösser aus Code", sa("term", 32, 56, 66, "grow .5s both", .2) + sa("key", 70, 58, 52, "bobA 1.4s ease-in-out infinite", .6) + sl("wahr ✓", 70, 88, 1.2)],
    quanten: ["night", "Gefahr aus der Zukunft?", sa("atom", 34, 56, 72, "grow .5s both", .2) + sa("key", 70, 58, 52, "sshake .5s ease 1s 3") + sl("Nüchtern betrachtet", 50, 88, 1.4)],
    entropie: ["day", "Würfel statt Bauchgefühl", sa("dice", 28, 58, 60, "grow .5s both", .2) + sa("dice", 54, 52, 52, "grow .5s both", .5) + sa("dice", 76, 60, 44, "grow .5s both", .8) + sl("Echter Zufall", 50, 88, 1.2)],
    ableitung: ["dusk", "Aus Wörtern werden Schlüssel", sa("letter", 20, 58, 56, "grow .5s both", .2) + sf("key", 20, 58, 52, 50, 40, .6) + sf("key", 20, 58, 70, 44, 40, 1) + sf("key", 20, 58, 86, 60, 40, 1.4) + sl("m/84'/0'/0'/0/0", 50, 88, 1.6)],
    blockbau: ["dusk", "Jetzt bist du Miner!", sa("pick", 28, 52, 56, "swing .5s ease-in-out 3") + sa("block", 66, 58, 64, "grow .5s both", 1.4) + sl("Was passt rein?", 50, 88, 1.8)],
    lnnetz: ["night", "Der Weg durchs Blitz-Netz", sa("phone", 14, 58, 46) + sa("server", 50, 46, 46, "grow .4s both", .4) + sa("phone", 86, 58, 46) + sa("bolt", 32, 50, 30, "szap 1s ease .8s 3") + sa("bolt", 68, 50, 30, "szap 1s ease 1.2s 3") + sl("Station für Station", 50, 88, 1.6)],
    offline: ["night", "Internet weg? Kein Problem!", sa("phone", 18, 58, 52) + sf("letter", 18, 58, 50, 40, 36, .5) + sf("letter", 50, 40, 82, 58, 36, 1.3) + sa("server", 82, 60, 50, "grow .4s both", .2) + sl("Funk, Satellit, Taube", 50, 88, 1.8)],
    hyperinflation: ["dusk", "Ein Brot: 201 Milliarden Mark", sa("printer", 26, 54, 56, "sshake .5s ease .3s 3") + sf("dollar", 26, 54, 60, 46, 34, .6) + sf("dollar", 26, 54, 80, 58, 34, 1) + sf("dollar", 26, 54, 62, 66, 34, 1.4) + sl("Deutschland 1923", 50, 88, 1.8)],
    goldstandard: ["day", "Gold gegen Papier", sa("trophy", 30, 56, 64, "grow .5s both", .2) + sa("dollar", 70, 58, 64, "grow .5s both", .6) + sl("Bis 1971", 50, 88, 1.2)],
    vorlaeufer: ["night", "Bitcoin hatte Vorfahren", sa("laptop", 22, 60, 54, "grow .4s both", .2) + sa("scroll", 50, 56, 52, "grow .4s both", .5) + sa("coin", 78, 60, 54, "grow .4s both", 1) + sl("1982 → 2008", 50, 88, 1.4)],
    satoshi: ["night", "Wer bin ich wirklich?", sa("satoshi", 44, 50, 68, "bobA 1.6s ease-in-out infinite") + sl("???", 74, 40, 1)],
    krimis: ["night", "Sechs echte Fälle", sa("hood", 30, 50, 60, "sshake .5s ease .6s 3") + sa("bank2", 72, 52, 56, "grow .5s both", .3) + sl("Fall gelöst?", 50, 88, 1.4)],
    psycho: ["dusk", "Was denkt dein Kopf?", sa("mirror", 34, 50, 62, "grow .5s both", .2) + sa("fomo", 72, 52, 52, "bobA 1s ease-in-out infinite", .5) + sl("Drei Experimente", 50, 88, 1.2)],
  };
  function intro(){
    const I = INTRO[here], h = document.querySelector("h1"); if (!I || !h) return;
    const st = document.createElement("div"); st.className = `scn intro ${I[0]}`; st.setAttribute("aria-hidden", "true"); st.title = "Nochmal abspielen";
    const play = () => { st.innerHTML = `<span class="say">${I[1]}</span>` + I[2]; };
    play(); st.onclick = play; h.parentElement.after(st);
  }

  // ---------- Kapitel-Bosse: 5 Fragen auf Zeit, Boss hat 4 Leben, du 2 ----------
  const BOSSES = [
    ["squid", "Der Druck-Kalmar", "Ich spritze einfach mehr Geld ins Meer. Hahaha!", [
      ["Warum ist reiner Tauschhandel so mühsam?", ["Man muss jemanden finden, der genau das will, was man hat", "Weil Tauschen verboten ist", "Weil es zu viele Waren gibt"], "Genau dafür wurde Geld erfunden."],
      ["Du sparst für die Zukunft. Welche Aufgabe von Geld ist das?", ["Wertspeicher", "Recheneinheit", "Tauschmittel"], "Gutes Geld behält seinen Wert."],
      ["Was endete am 15. August 1971?", ["Der Umtausch von Dollar in Gold", "Die D-Mark", "Der Tauschhandel"], "Seitdem ist Geld nur noch durch Vertrauen gedeckt."],
      ["Wie entsteht der größte Teil unseres Geldes?", ["Wenn Banken Kredite vergeben", "Durch Gelddruckmaschinen", "Durch Mining"], "Ein Kredit schreibt neues Guthaben auf ein Konto."],
      ["Wer verliert beim Cantillon-Effekt meist?", ["Wer das neue Geld zuletzt bekommt", "Wer es zuerst bekommt", "Niemand"], "Er zahlt schon die höheren Preise."],
      ["Was unterscheidet den digitalen Euro von Bitcoin?", ["Er wird von der Zentralbank herausgegeben und ist vermehrbar", "Er ist auf 21 Millionen begrenzt", "Ihn gibt es schon seit 2009"], "Der digitale Euro bleibt ein Euro."],
      ["Was bedeutet Deflation?", ["Die Preise sinken im Durchschnitt, Geld kauft mehr", "Die Preise steigen besonders schnell", "Die Zentralbank druckt mehr Geld"], "Das Gegenteil von Inflation."],
      ["Wer kann Stablecoin-Guthaben einfrieren?", ["Der Herausgeber, eine Firma", "Niemand", "Die Miner"], "Darum sind Stablecoins nicht zensurresistent."]]],
    ["shipg", "Das Geisterschiff", "Ich bringe jede Münze zweimal an Land. Mindestens!", [
      ["Wie verhindert Bitcoin, dass derselbe Betrag zweimal ausgegeben wird?", ["Alle Nodes prüfen dasselbe Kassenbuch, die zweite Ausgabe ist ungültig", "Eine Bank passt auf", "Gar nicht"], "Was zuerst im Block steht, gilt."],
      ["Wie viele Bitcoin gibt es höchstens?", ["21 Millionen", "21 Milliarden", "Unbegrenzt"], "Die Grenze steht fest im Code."],
      ["Was misst Stock-to-Flow?", ["Bestand geteilt durch neue Menge pro Jahr", "Den Preis pro Gramm", "Die Zahl der Wallets"], "Je höher, desto knapper."],
      ["Wo hat Gold einen Vorteil gegenüber Bitcoin?", ["Es ist seit Jahrtausenden bewährt", "Es ist leichter zu verschicken", "Es ist besser teilbar"], "Bitcoin gibt es erst seit 2009."],
      ["Warum hat Bitcoin überhaupt einen Preis?", ["Weil Menschen ihn wollen und die Menge fest ist", "Weil eine Bank ihn festlegt", "Weil er an Gold gekoppelt ist"], "Angebot und Nachfrage: Das Angebot ist fest, also bewegt die Nachfrage den Preis."],
      ["Wann wurde der erste Bitcoin-Block erzeugt?", ["Im Januar 2009", "Im Jahr 2017", "Im Jahr 1999"], "Am 3. Januar 2009 startete Satoshi Nakamoto das Netz mit dem Genesis-Block."]]],
    ["kraken", "Der 51-%-Kraken", "Ich habe die meiste Rechenleistung. Ich ändere die Regeln!", [
      ["Was ist ein Hash?", ["Ein digitaler Fingerabdruck von Daten", "Ein Passwort", "Eine Adresse"], "Ein Zeichen anders, und der Hash ist ein völlig anderer."],
      ["Jemand ändert einen alten Block. Was passiert?", ["Sein Hash ändert sich, die Kette passt nicht mehr", "Niemand merkt es", "Der Block wird gelöscht"], "Jeder Block enthält den Hash des vorherigen."],
      ["Kann eine Miner-Mehrheit mehr als 21 Mio. Bitcoin erzeugen?", ["Nein, die Nodes lehnen solche Blöcke ab", "Ja, ab 51 %", "Ja, ab 90 %"], "Nodes stimmen nicht ab, sie prüfen die Regeln."],
      ["Warum braucht Bitcoin-Mining Strom?", ["Weil Miner raten müssen, bis ein Hash passt", "Für die Kühlung von Börsen", "Für das Drucken von Coins"], "Proof of Work: echter Aufwand schützt das Netz."],
      ["Welche Kette gilt bei zwei Versionen?", ["Die mit der meisten Rechenarbeit", "Die ältere", "Die mit den meisten Zahlungen"], "Der andere Block verwaist."],
      ["Warum bleiben Miner ehrlich?", ["Weil Betrug teurer ist und den eigenen Gewinn zerstört", "Weil es eine Polizei gibt", "Weil Satoshi zuschaut"], "Spieltheorie: Eigennutz führt zu Ehrlichkeit."],
      ["Wie oft wird die Schwierigkeit angepasst?", ["Alle 2.016 Blöcke", "Jeden Block", "Nie"], "Damit ein Block im Schnitt 10 Minuten dauert."],
      ["Was halbiert sich beim Halving?", ["Die neuen Bitcoin pro Block", "Der Bitcoin-Preis", "Die Zahl der Nodes"], "Etwa alle 4 Jahre."],
      ["Wer prüft jede Bitcoin-Zahlung?", ["Tausende Nodes auf der ganzen Welt", "Eine Bank", "Satoshi persönlich"], "Jeder kann eine Node betreiben."]]],
    ["angler", "Phil, der Anglerfisch", "Schau, wie schön das leuchtet … Gib mir kurz deine Seed-Wörter!", [
      ["Der „Support“ fragt im Chat nach deinen Seed-Wörtern. Was tust du?", ["Niemals herausgeben, das ist Betrug", "Herausgeben, er will helfen", "Nur die Hälfte schicken"], "Echter Support fragt nie nach dem Seed."],
      ["Wo bewahrst du Seed-Wörter am besten auf?", ["Offline auf Papier oder Metall", "Als Foto in der Cloud", "In einer E-Mail an dich selbst"], "Alles Digitale kann gehackt werden."],
      ["Deine Börse geht pleite. Wer ist sicher?", ["Wer seine Bitcoin in der eigenen Wallet hat", "Wer sie auf der Börse lässt", "Niemand"], "Nicht deine Schlüssel, nicht deine Bitcoin."],
      ["Ein Coin verspricht „1000x garantiert“. Das ist …", ["Ein großes Warnsignal", "Eine sichere Sache", "Normal"], "Garantierte Gewinne gibt es nicht."],
      ["Was speichert eine Hardware-Wallet?", ["Deine privaten Schlüssel", "Deine Bitcoin selbst", "Dein Bankkonto"], "Die Bitcoin liegen in der Blockchain, das Gerät schützt die Schlüssel."],
      ["Womit wird eine Bitcoin-Zahlung unterschrieben?", ["Mit dem privaten Schlüssel", "Mit dem öffentlichen Schlüssel", "Mit dem Börsen-Passwort"], "Geprüft wird mit dem öffentlichen Schlüssel."]]],
    ["zollhai", "Der Zoll-Hai", "Hier schwimmt keiner durch ohne Gebühr!", [
      ["Wovon hängt die Bitcoin-Gebühr vor allem ab?", ["Von der Größe der Transaktion in vByte", "Vom Betrag", "Von der Uhrzeit"], "Miner werden pro vByte bezahlt."],
      ["Du hast eine 0,05-BTC-Münze und zahlst 0,01 BTC. Was passiert?", ["Sie wird ganz ausgegeben, der Rest kommt als Wechselgeld zurück", "Sie wird geteilt", "Das geht nicht"], "Wie beim Bargeld."],
      ["Was ist die Mempool?", ["Der Warteraum für unbestätigte Transaktionen", "Ein Mining-Pool", "Eine Börse"], "Miner nehmen zuerst die Transaktionen mit hoher Gebühr."],
      ["Warum ist Lightning so günstig?", ["Zahlungen laufen über Kanäle außerhalb der Blockchain", "Weil es ein anderer Coin ist", "Weil Miner verzichten"], "Nur Öffnen und Schließen eines Kanals kosten Platz in der Blockchain."],
      ["Wer bekommt die Gebühr?", ["Der Miner, der den Block findet", "Eine Bitcoin-Firma", "Der Staat"], "Gebühren sind Teil des Miner-Lohns."],
      ["Warum für jede Zahlung eine neue Adresse?", ["Damit Fremde deine Zahlungen nicht verknüpfen können", "Weil Adressen ablaufen", "Es spart Gebühren"], "Gute Wallets machen das automatisch."],
      ["Woran erkennen Analysten oft das Wechselgeld?", ["Am krummen Betrag", "Am Namen", "An der Uhrzeit"], "Zahlungen sind oft runde Beträge."]]],
    ["siren", "Die FOMO-Sirene", "Schau, wie sie glänzt … KAUF JETZT!", [
      ["Rekordhoch, alle reden von Bitcoin. Was lehrt die Geschichte?", ["Dann ist es oft schon teuer, ruhig bleiben", "Sofort alles kaufen", "Kredit aufnehmen"], "In der Euphorie kaufen viele zu teuer."],
      ["Was ist ein Sparplan?", ["Regelmäßig den gleichen Betrag kaufen", "Einmal alles kaufen", "Mit Hebel kaufen"], "So musst du keinen perfekten Zeitpunkt treffen."],
      ["10× Hebel, der Kurs fällt um 10 %. Was passiert?", ["Der Einsatz ist komplett weg", "Du verlierst 1 %", "Nichts"], "100 % geteilt durch 10 = 10 %."],
      ["Minus 70 %, überall Panik. Was war in der Vergangenheit oft ein Fehler?", ["In Panik alles verkaufen", "Ruhig bleiben", "Einen Plan haben"], "Wer panisch verkauft, macht den Verlust endgültig."],
      ["Wer kann nie liquidiert werden?", ["Wer ohne Hebel kauft", "Wer mit 2× Hebel handelt", "Wer nur nachts handelt"], "Ohne geliehenes Geld gibt es nichts zu liquidieren."],
      ["Was ist ein Spread?", ["Ein versteckter Aufschlag auf den Kurs", "Eine Wallet-Art", "Ein Bitcoin-Upgrade"], "Achte auf die Gesamtkosten, nicht nur die Gebühr."],
      ["Was machst du vor der ersten großen Auszahlung?", ["Eine kleine Test-Auszahlung", "Den Seed fotografieren", "Nichts"], "So prüfst du Adresse und Wallet."],
      ["Wie stark fiel Bitcoin in früheren Crashs?", ["Mehrmals um 75 bis 90 %", "Nie mehr als 10 %", "Er fiel noch nie"], "Crashs gehören zu Bitcoin dazu."],
      ["Wie viele Bitcoin gelten als verloren?", ["Etwa 3 bis 4 Millionen", "Keine", "Genau 21"], "Verlorene Seeds machen Bitcoin noch knapper."],
      ["Wer hat mehr Bitcoin: Satoshi oder alle Staaten zusammen?", ["Satoshi", "Alle Staaten", "Gleich viel"], "Satoshi hat geschätzt 1,1 Millionen."],
      ["Wird Bitcoin vor allem für Kriminalität genutzt?", ["Nein, der illegale Anteil liegt unter 1 %", "Ja, zu 90 %", "Ja, ausschließlich"], "Weil alles öffentlich ist, werden viele Täter gefasst."]]]
  ];
  const FINAL = ["pool", "Dein Spiegelbild", "Schau ins Wasser. Wer bin ich? Komm näher …", []];
  // Endboss-Sprüche je Welt: [Spruch, [richtige Antwort, falsch, falsch], Erklärung] · 2 pro Welt + Finale
  const MYTHS = [
    [["Mein Geld auf dem Konto verliert nie an Wert.", ["Doch, Inflation frisst jedes Jahr Kaufkraft", "Stimmt, 100 € bleiben 100 €", "Nur wenn die Bank pleitegeht"], "Bei 2 % Inflation ist nach 35 Jahren die Hälfte weg."],
     ["Die Zentralbank druckt nur so viel Geld, wie nötig ist.", ["Wer bestimmt, was nötig ist? Eine feste Grenze gibt es nicht", "Stimmt, es gibt eine feste Obergrenze", "Geld wird gar nicht mehr neu geschaffen"], "Euro und Dollar haben keine feste Obergrenze."],
     ["Geld war schon immer nur Papier.", ["Nein, lange waren es Muscheln, Gold oder Silber", "Stimmt, seit der Steinzeit", "Geld war schon immer digital"], "Ungedecktes Papiergeld gibt es weltweit erst seit 1971."]],
    [["Bitcoin kann man doch einfach kopieren.", ["Den Code ja, aber nicht das Netzwerk und die Kette", "Stimmt, Rechtsklick und fertig", "Ja, Miner kopieren ständig Coins"], "Jede Kopie ist ein neuer Coin ohne Bitcoins Netz."],
     ["Irgendwann gibt es einfach mehr als 21 Millionen.", ["Nein, die Nodes lehnen solche Blöcke ab", "Ja, Satoshi kann das jederzeit", "Ja, beim nächsten Halving"], "Die Grenze prüft jede Node selbst."],
     ["Bitcoin nutzen doch nur Kriminelle.", ["Nein, der illegale Anteil liegt unter 1 %", "Stimmt, zu 90 %", "Bitcoin gibt es nur im Darknet"], "Die meisten nutzen Bitcoin zum Sparen und Bezahlen."]],
    [["Meine Seed-Wörter speichere ich als Foto, das ist sicher.", ["Nein, offline auf Papier oder Metall", "Ja, in der Cloud ist alles sicher", "Ja, das Handy hat ja eine PIN"], "Alles Digitale kann gehackt werden."],
     ["Der Support braucht kurz meine Seed-Wörter.", ["Niemals, echter Support fragt nie danach", "Okay, er will ja helfen", "Nur die ersten sechs Wörter"], "Wer deinen Seed hat, hat deine Bitcoin."],
     ["Auf der Börse liegen meine Bitcoin doch sicher.", ["Nicht deine Schlüssel, nicht deine Bitcoin", "Ja, Börsen gehen nie pleite", "Ja, der Staat haftet dafür"], "Pleite-Börsen haben schon Milliarden an Kundengeld verloren."]],
    [["Ich setze alles mit Hebel, dann werde ich schneller reich.", ["Mit Hebel kann der ganze Einsatz weg sein", "Hebel ist risikofrei", "Hebel verdoppelt immer den Gewinn"], "10× Hebel: 10 % Minus, und alles ist weg."],
     ["Ich warte einfach auf den perfekten Zeitpunkt.", ["Den trifft fast niemand, ein Sparplan hilft", "Den sieht man im Chart ganz genau", "Am besten nur bei Rekordhochs kaufen"], "Regelmäßig kaufen glättet den Preis."],
     ["Bei minus 70 % verkaufe ich alles, sicher ist sicher.", ["Panikverkauf macht den Verlust endgültig", "Richtig, danach geht es nie wieder hoch", "So macht man immer Gewinn"], "Bitcoin fiel mehrmals um über 75 % und erholte sich bisher."]],
    [["Eine Bitcoin-Zahlung kann ich jederzeit zurückholen.", ["Nein, eine Rückbuchung gibt es nicht", "Ja, über die Hotline", "Ja, innerhalb von 14 Tagen"], "Es gibt keine Stelle, die zurückbucht. Nach einigen Bestätigungen gilt eine Zahlung praktisch als endgültig. Darum vor dem Senden die Adresse prüfen."],
     ["Bitcoin ist viel zu langsam zum Bezahlen.", ["Mit Lightning zahlt man in Sekunden", "Stimmt, jede Zahlung dauert Tage", "Bezahlen geht mit Bitcoin gar nicht"], "Lightning ist fürs schnelle Bezahlen gebaut."],
     ["Je größer der Betrag, desto höher die Gebühr.", ["Nein, die Gebühr hängt von der Größe in vByte ab", "Stimmt, es ist immer 1 %", "Gebühren gibt es bei Bitcoin nicht"], "1 Million kann günstiger sein als 10 €."]],
    [["Irgendeine Firma kontrolliert doch Bitcoin.", ["Nein, tausende Nodes prüfen die Regeln selbst", "Ja, die Bitcoin AG", "Ja, Satoshis Firma"], "Bitcoin hat keinen Chef und keine Zentrale."],
     ["Wer 51 % hat, kann sich einfach fremde Bitcoin nehmen.", ["Nein, dafür bräuchte er den privaten Schlüssel", "Ja, dann gehört ihm alles", "Ja, er kann auch neue drucken"], "Ohne gültige Signatur ist keine Ausgabe gültig."],
     ["Mining verbrennt Strom für nichts.", ["Der Aufwand macht Angriffe auf das Netz teuer", "Stimmt, der Strom hat keinen Zweck", "Mining braucht gar keinen Strom"], "Über den Stromverbrauch wird gestritten, aber er hat einen Zweck: Proof of Work."]]];
  const FINALM = ["Bitcoin ist doch nur Betrug.", ["Betrug gibt es drumherum, Bitcoin selbst ist offener, prüfbarer Code", "Stimmt, ein großes Schneeballsystem", "Stimmt, Satoshi hat alle abgezockt"], "Prüfen statt glauben: Jeder kann Code und Kette selbst prüfen."];
  const BK = "satsland-boss";
  // Bosse bleiben Schatten, bis man ihnen im Kampf begegnet
  const SEEN = "satsland-seen";
  function seen(k){ let o = {}; try { o = JSON.parse(localStorage.getItem(SEEN)) || {}; } catch(e){} return k === undefined ? o : !!(o[k] || (k === "f" ? bossWon().f : bossWon()[k])); }
  const bossName = k => seen(k) ? (k === "f" ? FINAL : BOSSES[k])[1] : "???";
  const bossArt = k => { const a = art(k === "f" ? FINAL[0] : BOSSES[k][0]); return seen(k) ? a : `<span class="shd">${a}</span>`; };
  function markSeen(k){ if (seen(k)) return false; const o = seen(); o[k] = 1; try { localStorage.setItem(SEEN, JSON.stringify(o)); } catch(e){} return true; }
  function bossWon(){ let o = {}; try { o = JSON.parse(localStorage.getItem(BK)) || {}; } catch(e){}
    if (!o.v2){ const n = {v2: 1}; Object.entries(o).forEach(([k, v]) => { if (k === "5") n.f = v; else if (/^\d$/.test(k)) n[+k + 1] = v; }); o = n; try { localStorage.setItem(BK, JSON.stringify(o)); } catch(e){} }
    // v3 (Nov. 2026): Welten neu sortiert, Bosse ziehen mit ihrem Thema um (alt → neu)
    if (!o.v3){ const M = {0: 0, 1: 1, 2: 3, 3: 5, 4: 4, 5: 2}, n = {v2: 1, v3: 1}; Object.entries(o).forEach(([k, v]) => { if (k in M) n[M[k]] = v; else if (k === "f") n.f = v; }); o = n; try { localStorage.setItem(BK, JSON.stringify(o)); } catch(e){} }
    return o; }
  // Arena-Farben und Sprüche je Boss (0–5, f = Endboss)
  const BTH = {0: ["#1f6b4a", "#0b2420"], 1: ["#4a2a8a", "#120c30"], 3: ["#0f5a8a", "#061a33"], 5: ["#8a2232", "#2a0a14"], 4: ["#6a4520", "#1d1208"], 2: ["#4a5070", "#12141f"], f: ["#8a6510", "#2a1a05"]};
  const BLINES = {
    0: [["Meine Tinte wird knapp!", "Die Inflation … sinkt?!", "Mein Geldstrahl versiegt!"], ["Ich spritz mir neue Punkte!", "Kaufkraft? Verwässert! Hahaha!", "Noch ’ne Milliarde ins Meer!"]],
    1: [["Die Blockchain sieht mich!", "Buuuh … mein Segel reißt!", "Nicht doppelt treffen!"], ["Doppelt an Land, doppelt gewonnen!", "Buuuh! Daneben!", "Ich segle überall gleichzeitig!"]],
    3: [["Du siehst meinen Trick?!", "Meine Lampe flackert!", "Kein Biss heute …"], ["Klick doch auf den Link!", "Nur kurz deine 12 Wörter …", "Hab dich am Haken!"]],
    5: [["Du hörst nicht auf mein Lied?!", "Mein Haken … ist zu sehen!", "Grrr, so geduldig …"], ["Zu spät! Alle anderen sind reich!", "Komm schon, nur ein Klick!", "Der Kurs schwimmt dir davon!"]],
    4: [["Hey, das kostet extra!", "Du schwimmst an mir vorbei?!", "Meine Schranke klemmt!"], ["Das macht 500 sat Strafe!", "Zurück in die Warteschlange!", "Happs! Höhere Gebühr, bitte!"]],
    2: [["Die Nodes lehnen mich ab?!", "Meine Tentakel erlahmen!", "Regeln sind Regeln?!"], ["Ich schreibe die Geschichte um!", "Meine Kette ist länger!", "51 % … ich zieh dich runter!"]],
    f: [["Hm … stimmt eigentlich.", "Okay, das wusste ich nicht.", "Du hast echt was gelernt."], ["Siehst du? Ich hatte recht!", "Ha, ich werd wieder stärker!", "Bleib doch, wie du warst."]]};
  const KO = {squid: "Blubb … in meiner eigenen Tinte!", shipg: "Buuuh … ich löse mich auf!", kraken: "Ich versinke … glub, glub!", angler: "Meine Lampe … geht aus …", zollhai: "Aua! Ich schwimm ja schon!", siren: "Mein Köder! Du hast die Falle gesehen!"};
  function boss(k){
    // k = 0–5: Welt-Boss (5 Fragen, 4 Treffer nötig, du 2 Leben, 15 s) · k = "f": Endboss „Dein Spiegelbild“ (12 Sprüche + Finale, immer alle, 13 Zweifel-Balken, richtig −1, falsch +1, Finale −5, 15 s)
    const fin = k === "f", [img, name, taunt, Q] = fin ? FINAL : BOSSES[k], HP = fin ? 13 : 4, LIVES = fin ? 0 : 2, TIME = 15, first = markSeen(k);
    const [c1, c2] = BTH[k] || BTH.f, [HIT, MISS] = BLINES[k] || BLINES.f;
    const bg = document.createElement("div"); bg.className = "bossbg";
    let i = 0, hp = HP, lives = LIVES, t = 0, timer = 0, lock = false, combo = 0, miss = 0, gone = false;
    const mixQ = a => [...a].sort(() => Math.random() - .5), order = fin ? [...mixQ(MYTHS.flatMap(w => mixQ(w).slice(0, 2))), FINALM] : mixQ(Q).slice(0, 5);
    bg.innerHTML = `<div class="boss" role="dialog" aria-label="Boss-Kampf gegen ${name}" style="--c1:${c1};--c2:${c2}">
      <div class="bt"><span class="bnum">${fin ? "ENDBOSS" : "BOSS " + (k + 1)}</span><b class="bname">${first ? "???" : name}</b><button class="bx" type="button" aria-label="Schließen">×</button></div>
      <div class="arena"><div class="rays"></div>
        <div class="bhp">${fin ? '<b class="zw">ZWEIFEL</b>' : ""}<div class="hp"><i class="gh"></i><i class="cur"></i></div><small>${"<s></s>".repeat(HP)}</small></div>
        <div class="bubble${first ? " hid" : ""}">${taunt}</div><div class="bimg idle${first ? " bshd" : ""}">${art(img)}</div><div class="floor"></div>
        <div class="me"><span class="lives"></span><span class="combo"></span></div>
        <div class="fx" aria-hidden="true"></div>
      </div><div id="bq"></div></div>`;
    document.body.appendChild(bg);
    const B = bg.querySelector(".boss"), A = bg.querySelector(".arena"), im = bg.querySelector(".bimg"), bub = bg.querySelector(".bubble"), box = bg.querySelector("#bq"), fx = bg.querySelector(".fx");
    const close = () => { gone = true; clearInterval(timer); bg.remove(); document.removeEventListener("keydown", esc); };
    const esc = e => { if (e.key === "Escape") close(); }; document.addEventListener("keydown", esc);
    bg.querySelector(".bx").onclick = close;
    const re = (el, c) => { el.classList.remove(c); void el.offsetWidth; el.classList.add(c); };
    const say2 = txt => { bub.textContent = txt; re(bub, "pop"); };
    const float = (txt, cls) => { const e = document.createElement("span"); e.className = "ft " + cls; e.textContent = txt; fx.appendChild(e); setTimeout(() => e.remove(), 1400); };
    const hud = () => { const w = Math.min(100, hp/HP*100) + "%"; bg.querySelector(".hp .cur").style.width = w; setTimeout(() => { const g = bg.querySelector(".hp .gh"); if (g) g.style.width = w; }, 450);
      if (fin) return; bg.querySelector(".lives").innerHTML = Array.from({length: LIVES}, (_, n) => `<i class="${n < lives ? "" : "lost"}">${n < lives ? "❤️" : "🖤"}</i>`).join("");
      bg.querySelector(".combo").textContent = combo >= 2 ? `🔥 ${combo}er-Combo` : ""; };
    function ask(){
      if (gone) return;
      if (hp <= 0 || (!fin && lives <= 0) || i >= order.length) return end();
      const [q, opts] = order[i], mix = opts.map((o, n) => [Math.random(), n, o]).sort((a, b) => a[0] - b[0]);
      if (fin) say2(`„${q}“`);
      box.innerHTML = `<div class="tm"><i style="width:100%"></i></div><p class="bq"><span>${fin ? (i === order.length - 1 ? "Finale · der letzte Schlag" : `Spruch ${i + 1} von ${order.length}`) : `Frage ${i + 1}`}</span>${fin ? "Was antwortest du deinem alten Ich?" : q}</p><div class="opts">${mix.map(([, n, o]) => `<button type="button" data-n="${n}">${o}</button>`).join("")}</div><p class="why" hidden></p>`;
      t = TIME; lock = false; clearInterval(timer);
      const bar = box.querySelector(".tm");
      timer = setInterval(() => { t -= .1; bar.firstChild.style.width = Math.max(0, t/TIME*100) + "%"; bar.classList.toggle("low", t < TIME*.3); if (t <= 0) answer(-1); }, 100);
      box.querySelector(".opts").onclick = e => { const b = e.target.closest("button"); if (b) answer(+b.dataset.n); };
    }
    function answer(n){
      if (lock || gone) return; lock = true; clearInterval(timer);
      const ok = n === 0, [, , why] = order[i], fast = ok && t > TIME*.7;
      box.querySelectorAll(".opts button").forEach(b => { b.disabled = true; if (+b.dataset.n === 0) b.classList.add("ok"); else if (+b.dataset.n === n) b.classList.add("no"); });
      const w = box.querySelector(".why"); w.hidden = false; w.innerHTML = `<b>${n < 0 ? "⏰ Zeit um!" : ok ? "✅ Treffer!" : "💥 Autsch."}</b> ${why}`;
      if (ok && img === "siren"){ const h = Math.min(1, (HP - hp + 1)/HP); setTimeout(() => { im.style.setProperty("--hk", h); if (h <= 1/HP + .01) float("🪝 Da ist ein Haken!", "cmb"); }, 420); }
      if (!ok && img === "siren") setTimeout(() => sfx("sour"), 200);
      if (ok){ const last = fin && i === order.length - 1; hp = last ? Math.max(0, hp - 5) : fin ? Math.max(1, hp - 1) : hp - 1; combo++;
        sfx("coin"); const z = document.createElement("span"); z.className = "zap"; z.innerHTML = art("coin"); fx.appendChild(z); setTimeout(() => z.remove(), 700);
        setTimeout(() => { sfx("hit"); re(im, "ouch"); re(A, "flash"); float(last ? "FINALSCHLAG!" : fast ? "SUPERSCHNELL!" : "TREFFER!", "hit"); if (combo >= 2) float(`${combo}× COMBO`, "cmb"); if (fin) setTimeout(() => say2(pickOne(HIT)), 500); else say2(pickOne(HIT)); hud(); }, 380);
      } else if (fin){ sfx("no"); miss++; combo = 0; hp++; re(B, "hit"); re(A, "dmg"); re(im, "laugh"); float(n < 0 ? "ZEIT UM! +1 ZWEIFEL" : "+1 ZWEIFEL", "miss"); setTimeout(() => say2(pickOne(MISS)), 900); hud();
      } else { sfx("no"); lives--; combo = 0; re(B, "hit"); re(A, "dmg"); re(im, "laugh"); float(n < 0 ? "ZEIT UM!" : "−1 ❤️", "miss"); say2(pickOne(MISS)); hud(); }
      i++; setTimeout(ask, 2300);
    }
    function end(){
      clearInterval(timer); const win = hp <= 0, perf = fin ? miss === 0 : lives === LIVES;
      sfx(win ? "ko" : "lose"); if (!(fin && win)){ const st = document.createElement("div"); st.className = "stamp " + (win ? "ko" : "go"); st.textContent = win ? "K.O.!" : "GAME OVER"; A.appendChild(st); }
      if (win && fin){ const s = load(), lv = level(count(s)); A.classList.add("won", "mirW"); bub.style.opacity = 0; im.classList.remove("idle"); im.innerHTML = art("mirror"); re(im, "rise");
        A.insertAdjacentHTML("beforeend", `<div class="mirr"><b>„Du hast dein altes Ich besiegt.“</b><span>${lv.ico} ${lv.name} · ${count(s)} Level · 6 Bosse</span></div>`); }
      if (win){ if (!fin){ im.classList.remove("idle"); im.classList.add("down", "ko-" + img); A.classList.add("won"); say2(KO[img] || "Neiiin … besiegt!"); if (img === "squid") A.insertAdjacentHTML("beforeend", '<i class="ink"></i>'); if (img === "siren") im.style.setProperty("--hk", 1); } const w = bossWon(); w[k] = perf ? "perfect" : (w[k] === "perfect" ? "perfect" : true); try { localStorage.setItem(BK, JSON.stringify(w)); } catch(e){} setTimeout(confetti, 500); if (fin) toast("🪞 Dein Spiegelbild ist besiegt! Die goldene Karte gehört dir."); titles(); }
      else { re(im, "laugh"); say2(pickOne(MISS)); }
      box.innerHTML = `<div class="end"><b>${win ? (fin ? "🪞 Das bist jetzt du." : "🏆 Boss besiegt!") : fin ? "😴 Dein Spiegelbild bleibt noch" : "💀 Der Boss gewinnt diesmal"}</b><p class="muted">${win ? fin ? (perf ? "Ohne einen Fehler! ✨ Die goldene Karte gehört dir, dazu deine Urkunde." : "Die goldene Karte liegt jetzt in deinem Album. Hol dir jetzt deine Urkunde.") : (perf ? "Ohne einen Fehler! ✨ Du bekommst die Glanz-Bosskarte." : "Die Boss-Karte liegt jetzt in deinem Album. Ohne Fehler gibt es die Glanzkarte.") : "Lies die Erklärungen in den Leveln nochmal und versuch es erneut."}</p>
        ${win && fin ? '<label class="muted sm" style="display:block;margin-top:8px">Name für die Urkunde (bleibt auf deinem Gerät)<input id="shN" maxlength="28" autocomplete="off" style="display:block;width:100%;margin-top:4px;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:rgba(0,0,0,.3);color:inherit;font:inherit"></label>' : ""}
        <div class="acts" style="justify-content:center;display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">${win ? `<button class="btn" type="button" data-a="share">📤 ${fin ? "Urkunde" : "Teilen"}</button>` : '<button class="btn" type="button" data-a="again">↺ Nochmal</button>'}<button class="btn ghost" type="button" data-a="close">Schließen</button></div></div>`;
      box.querySelector(".end").onclick = e => { const a = e.target.closest("button"); if (!a) return;
        if (a.dataset.a === "share"){ const n = box.querySelector("#shN"); shareCard(k, perf, n ? n.value.trim() : ""); return; }
        close(); if (a.dataset.a === "again") boss(k); else if (win) location.reload(); };
    }
    hud();
    if (first) setTimeout(() => { if (gone) return; im.classList.remove("bshd"); im.classList.add("rvl"); bub.classList.remove("hid"); re(bub, "pop"); bg.querySelector(".bname").textContent = name; float(name + "!", "cmb"); sfx("star"); }, 1000);
    if (fin){ setTimeout(() => { if (gone) return; im.innerHTML = art("oldme"); re(im, "rise"); sfx("hit"); say2("Ich bin du. Von früher. Ich glaub das alles nicht."); }, 1600); setTimeout(ask, 4200); }
    else { if (img === "siren"){ im.style.setProperty("--hk", 0); setTimeout(() => { if (!gone) sfx("lure"); }, first ? 1300 : 300); }
      setTimeout(ask, first ? 2300 : 1200); }
  }
  // Teilen-Karte nach Bosssieg bzw. Urkunde nach dem Endboss (Bild, nur auf dem Gerät erzeugt)
  function shareCard(k, perfect, who){
    const fin = k === "f", [img0, name] = fin ? FINAL : BOSSES[k], img = fin ? "mirror" : img0, s = load(), lv = level(count(s)), S = 1080;
    const c = document.createElement("canvas"); c.width = c.height = S; const g = c.getContext("2d");
    const bg = g.createLinearGradient(0, 0, 0, S); bg.addColorStop(0, fin ? "#3a2a08" : "#1d2463"); bg.addColorStop(1, "#0b0f2a"); g.fillStyle = bg; g.fillRect(0, 0, S, S);
    g.strokeStyle = fin ? "#ffc94d" : "#f7931a"; g.lineWidth = 14; g.strokeRect(40, 40, S - 80, S - 80); g.lineWidth = 3; g.strokeRect(66, 66, S - 132, S - 132);
    const txt = (t, y, size, col, w = 900) => { g.font = `${w} ${size}px "Arial Black", Arial, sans-serif`; g.fillStyle = col; g.textAlign = "center"; g.fillText(t, S/2, y); };
    const im = new Image(); im.onload = () => {
      if (fin){ txt("URKUNDE", 190, 92, "#ffc94d"); txt("Satsea durchgespielt", 260, 46, "#ffffff", 700); if (who) txt(who, 400, 70, "#ffffff");
        g.drawImage(im, S/2 - 170, who ? 450 : 330, 340, 340); txt("Alle 6 Welten · alle Bosse · Spiegelbild besiegt", who ? 860 : 760, 34, "#dfe3ff", 700); }
      else { txt(perfect ? "✨ BOSS BESIEGT – OHNE FEHLER" : "🏆 BOSS BESIEGT", 180, 52, "#ffc94d"); g.drawImage(im, S/2 - 210, 230, 420, 420);
        txt(name, 740, 64, "#ffffff"); txt(`Welt ${k + 1} · ${CHAPTERS[k][0]} ${CHAPTERS[k][1]}`, 810, 38, "#dfe3ff", 700); }
      txt(`${lv.ico} Rang: ${lv.name} · ${count(s)} von ${PATH.length} Level`, 930, 34, "#9aa2d6", 700);
      txt("orange-trail.github.io", 990, 34, fin ? "#ffc94d" : "#f7931a");
      c.toBlob(async b => { if (!b) return; const f = new File([b], fin ? "satsea-urkunde.png" : `satsland-boss-${k + 1}.png`, {type: "image/png"});
        try { if (navigator.canShare && navigator.canShare({files: [f]})){ await navigator.share({files: [f], text: fin ? "Ich habe Satsea durchgespielt! 👑" : `Boss besiegt: ${name} 🏆`}); return; } } catch(e){ if (e && e.name === "AbortError") return; }
        const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); toast("📥 Bild gespeichert"); }, "image/png"); };
    im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">${ART[img]}</svg>`);
  }
  function finalCard(){ const won = bossWon().f;
    return `<span class="tcard bosscard goldcard ${won ? "got" : "lock"}"><span class="tn">★</span><span class="tart">${won ? art("mirror") : "?"}</span><b>${won ? "Dein Spiegelbild" : "Endboss"}</b><small>${won ? "👑 Goldene Karte" : "Alle Bosse besiegen"}</small></span>`; }
  function bossCard(k){ const won = bossWon()[k], [img, name] = BOSSES[k];
    return `<span class="tcard bosscard ${won ? "got" : "lock"} ${won === "perfect" ? "shiny" : ""}"><span class="tn">B${k + 1}</span><span class="tart${!won && seen(k) ? " seen" : ""}">${won || seen(k) ? art(img) : "?"}</span><b>${won || seen(k) ? name : "Boss " + (k + 1)}</b><small>${won === "perfect" ? "✨ Glanzkarte" : won ? "🏆 besiegt" : "Welt " + (k + 1)}</small></span>`; }

  // ---------- Bitcoin-Lexikon: [Begriff, Suchmuster, Erklärung, Welt] ----------
  const GLOSSAR = [["51-%-Angriff", "51[ -]?%-?Angriff", "Wenn jemand mehr als die Hälfte der Rechenleistung hätte, könnte er eigene, frische Zahlungen rückgängig machen oder Zahlungen blockieren. Regeln ändern oder fremde Coins nehmen kann er trotzdem nicht.", "nodes"], ["Adresse", "Adressen?", "Wie eine Kontonummer, an die man Bitcoin schicken kann. Sie wird aus deinem öffentlichen Schlüssel berechnet und beginnt heute meist mit „bc1“. Für jede Zahlung kann man eine neue nutzen.", "utxo"], ["Bestätigung", "Bestätigungen|Bestätigung", "Steht deine Zahlung in einem Block, hat sie 1 Bestätigung. Jeder weitere Block darauf ist eine weitere. Ab etwa 6 gilt eine Zahlung nach verbreiteter Faustregel als sicher.", "bahnhof"], ["BIP", "BIPs?", "Bitcoin Improvement Proposal: ein schriftlicher Vorschlag, wie Bitcoin verbessert werden könnte. Wird öffentlich diskutiert, oft jahrelang.", "nodes"], ["Bitcoin Core", "Bitcoin Core", "Die meistgenutzte Bitcoin-Software für Nodes. Open Source, entwickelt von Freiwilligen und gesponserten Entwicklern weltweit.", "nodes"], ["Block", "Blöcken|Blöcke|Blocks|Block", "Ein Paket aus vielen Zahlungen, das ein Miner etwa alle 10 Minuten an die Blockchain anhängt. Jeder Block enthält den Fingerabdruck (Hash) des vorherigen.", "blockchain"], ["Blockchain", "Blockchain", "Das gemeinsame Kassenbuch von Bitcoin: eine Kette aus Blöcken, in der alle Zahlungen seit 2009 stehen. Jede Node hat eine eigene Kopie.", "blockchain"], ["Börse", "Börsen|Börse", "Ein Unternehmen, bei dem man Bitcoin gegen Euro kaufen und verkaufen kann. Solange deine Bitcoin dort liegen, hat die Börse die Schlüssel, nicht du.", "wallets"], ["DCA / Sparplan", "Sparplans?|DCA", "Dollar-Cost-Averaging: regelmäßig den gleichen Betrag kaufen, egal wie der Kurs steht. So muss man keinen perfekten Zeitpunkt treffen.", "sparplan"], ["Deflation", "Deflation", "Das Gegenteil von Inflation: Die Preise sinken im Durchschnitt, Geld kauft mit der Zeit mehr. Notenbanken fürchten sie, weil Menschen Käufe aufschieben und Schulden schwerer wiegen.", "inflation"], ["Dezentral", "dezentral(e[nmrs]?)?|Dezentralität", "Es gibt keine zentrale Stelle, die bestimmt. Tausende unabhängige Computer (Nodes) setzen gemeinsam die Regeln durch.", "nodes"], ["Doppelausgabe", "Doppelausgaben?", "Das Problem, dieselbe digitale Münze zweimal auszugeben. Bitcoin verhindert es, weil alle Nodes dasselbe Kassenbuch prüfen.", "doppelt"], ["ETF", "ETFs?", "Ein börsengehandelter Fonds. Bitcoin-ETFs halten Bitcoin für ihre Anleger, man kauft Anteile über die Bank statt echte Bitcoin.", "geschichte"], ["FOMO", "FOMO", "Fear Of Missing Out: die Angst, etwas zu verpassen. Verleitet dazu, zu kaufen, wenn alle jubeln und der Kurs schon hoch ist.", "fomo"], ["Fork", "Soft Fork|Hard Fork|Forks?", "Eine Regeländerung. Soft Fork: Regeln werden strenger, alte Nodes bleiben kompatibel. Hard Fork: Regeln werden lockerer, die Kette kann sich spalten.", "nodes"], ["FUD", "FUD", "Fear, Uncertainty and Doubt: Angst, Unsicherheit und Zweifel, oft gezielt verbreitet, damit andere in Panik verkaufen.", "fomo"], ["Gebühr", "Gebühren|Gebühr", "Was du für eine Zahlung bezahlst. In der Blockchain bekommt sie der Miner, damit er deine Zahlung in einen Block packt. Sie richtet sich nach der Größe in vByte, nicht nach dem Betrag. Bei Lightning bekommen sie die Stationen, die deine Zahlung weiterleiten, meist nur wenige sats.", "bahnhof"], ["Genesis-Block", "Genesis-Block", "Der allererste Bitcoin-Block vom 3. Januar 2009, von Satoshi Nakamoto erzeugt.", "geschichte"], ["Halving", "Halvings?", "Etwa alle 4 Jahre (alle 210.000 Blöcke) halbiert sich die Zahl neuer Bitcoin pro Block. Seit 2024 sind es 3,125 BTC.", "halving"], ["Hardware-Wallet", "Hardware-Wallets?", "Ein kleines Gerät, das deine privaten Schlüssel offline aufbewahrt. Zahlungen bestätigst du am Gerät selbst, Viren auf dem Computer kommen nicht an den Schlüssel.", "wallets"], ["Hash", "Hashes|Hash(?!rate)", "Ein digitaler Fingerabdruck: Aus beliebigen Daten wird eine Zeichenkette fester Länge. Ein geändertes Zeichen ergibt einen völlig anderen Hash, und zurückrechnen geht nicht.", "hashing"], ["Hashrate", "Hashrate|Rechenleistung", "Wie viele Hashes pro Sekunde alle Miner zusammen ausprobieren. Je höher, desto sicherer ist das Netz.", "mining"], ["Hebel", "Hebels?", "Mit geliehenem Geld handeln. Verstärkt Gewinne und Verluste. Bei Hebel 10 ist dein Einsatz nach 10 % Kursverlust weg.", "hebel"], ["HODL", "HODL", "Bitcoin-Slang für „halten statt verkaufen“. Entstand 2013 aus einem Tippfehler in einem Forum.", "fomo"], ["Inflation", "Inflation", "Geld verliert an Kaufkraft: Für denselben Betrag bekommst du mit der Zeit weniger. Passiert, wenn die Geldmenge schneller wächst als das, was man dafür kaufen kann.", "inflation"], ["KYC", "KYC", "Know Your Customer: Börsen müssen deine Identität prüfen. Dadurch weiß die Börse, wem welche Abhebe-Adresse gehört.", "kaufen"], ["Lightning", "Lightning(-Netz(werk)?)?", "Ein Netz auf Bitcoin für schnelle, fast kostenlose Zahlungen. Läuft über Kanäle zwischen Nutzern, nur Öffnen und Schließen landen in der Blockchain.", "lightning"], ["Liquidation", "Liquidationen|Liquidation|liquidiert", "Bei Hebel-Wetten: Ist dein Einsatz aufgebraucht, schließt die Börse die Wette automatisch. Dein Geld ist weg.", "hebel"], ["CPFP", "CPFP", "Child Pays For Parent: Eine Folgezahlung mit hoher Gebühr zieht eine festhängende Zahlung mit in den Block. Miner schauen auf beide zusammen.", "blockbau"], ["Goldstandard", "Goldstandards?", "Ein System, in dem Geldscheine gegen eine feste Menge Gold eingetauscht werden konnten. Der letzte Rest endete 1971.", "goldstandard"], ["Hashcash", "Hashcash", "Ein Arbeitsnachweis gegen Spam von Adam Back (1997). Bitcoin nutzt die Idee beim Mining.", "vorlaeufer"], ["Hyperinflation", "Hyperinflation", "Preise steigen um mehr als 50 % im Monat. Geld verliert dann in kurzer Zeit fast seinen ganzen Wert, wie in Deutschland 1923.", "hyperinflation"], ["HTLC", "HTLC", "Das Schloss mit Geheimnis bei Lightning: Weiterleiter bekommen ihr Geld nur, wenn sie das Geheimnis des Empfängers kennen. So kommt eine Zahlung ganz an oder gar nicht.", "lnnetz"], ["Mempool", "Mempool", "Der Warteraum für Zahlungen, die noch in keinem Block stehen. Miner wählen dort die Zahlungen mit der höchsten Gebühr pro vByte aus.", "bahnhof"], ["Miner", "Minern|Miners?|Mining", "Computer, die neue Blöcke bauen. Sie raten Milliarden Zahlen, bis ein passender Hash herauskommt (Proof of Work), und bekommen dafür neue Bitcoin plus Gebühren.", "mining"], ["Mining-Pool", "Mining-Pools?|Pools", "Ein Zusammenschluss vieler Miner, die gemeinsam rechnen und sich die Belohnung teilen. So bekommen auch kleine Miner regelmäßig etwas.", "mining"], ["Multisig", "Multisig", "Eine Wallet, bei der mehrere Schlüssel nötig sind, z. B. 2 von 3. Geht ein Schlüssel verloren oder wird gestohlen, sind die Bitcoin trotzdem sicher.", "wallets"], ["Node", "Nodes?", "Ein Computer mit der Bitcoin-Software, der die komplette Blockchain speichert und jede Zahlung und jeden Block selbst nach den Regeln prüft. Jeder kann eine betreiben.", "nodes"], ["Nonce", "Nonce", "Die Zahl, die Miner beim Mining immer wieder verändern, bis der Block-Hash genug Nullen hat.", "mining"], ["Öffentlicher Schlüssel", "öffentliche[nmrs]? Schlüssel", "Wird aus dem privaten Schlüssel berechnet und darf jeder sehen. Damit kann jeder prüfen, ob eine Unterschrift von dir stammt. Daraus entsteht die Adresse.", "schluessel"], ["Open Source", "Open Source", "Der Programmcode ist öffentlich. Jeder kann ihn lesen, prüfen und Verbesserungen vorschlagen.", "nodes"], ["Passphrase", "Passphrase", "Ein zusätzliches, selbst gewähltes Wort zum Seed. Wer nur die Seed-Wörter findet, kommt ohne Passphrase nicht an die Bitcoin.", "seed"], ["Privater Schlüssel", "private[nmrs]? Schlüssel", "Eine geheime Zufallszahl, mit der du Zahlungen unterschreibst. Wer ihn hat, besitzt die Bitcoin. Niemals teilen.", "schluessel"], ["Proof of Work", "Proof of Work", "Arbeitsnachweis: Miner müssen echte Rechenarbeit (Strom) investieren, um einen Block zu finden. Das macht Fälschungen extrem teuer.", "mining"], ["Pseudonym", "pseudonym", "Nicht unter echtem Namen, aber auch nicht unsichtbar. Bei Bitcoin stehen Adressen statt Namen in der Blockchain, alles ist öffentlich.", "privatsphaere"], ["Satoshi (Sat)", "Sats|sat/vB", "Die kleinste Einheit: 1 Bitcoin = 100 Millionen Satoshi (Sats). Benannt nach dem Erfinder.", "utxo"], ["Satoshi Nakamoto", "Satoshi Nakamoto|Satoshis(?! Geist)(?!\\))", "Der unbekannte Erfinder von Bitcoin. Veröffentlichte 2008 das Whitepaper und verschwand 2011.", "geschichte"], ["Schwierigkeit", "Schwierigkeit|Difficulty", "Wie schwer es ist, einen Block zu finden. Passt sich alle 2016 Blöcke an, damit im Schnitt alle 10 Minuten ein Block kommt.", "mining"], ["SegWit", "SegWit", "Upgrade von 2017 (Soft Fork): mehr Platz pro Block, günstigere Gebühren, Grundlage für Lightning.", "nodes"], ["Seed", "Seed-Wörtern|Seed-Wörter|Seeds?", "Die 12 oder 24 Wörter, aus denen deine Wallet alle Schlüssel berechnet. Wer den Seed hat, hat alle Bitcoin. Offline aufschreiben, niemals teilen.", "seed"], ["Signatur", "Signaturen|Signatur", "Die digitale Unterschrift unter einer Zahlung, erstellt mit deinem privaten Schlüssel. Jeder kann sie mit deinem öffentlichen Schlüssel prüfen.", "schluessel"], ["Taproot", "Taproot", "Upgrade von 2021 (Soft Fork): bessere Signaturen (Schnorr), mehr Privatsphäre und flexiblere Verträge.", "nodes"], ["Transaktion", "Transaktionen|Transaktion", "Eine Bitcoin-Zahlung: Bitcoin-Beträge (UTXOs) gehen rein, neue Beträge an Empfänger und Wechselgeld gehen raus, unterschrieben mit deinem Schlüssel.", "utxo"], ["UTXO", "UTXOs?", "Unspent Transaction Output: ein einzelner Bitcoin-Betrag in deiner Wallet. Dein Guthaben ist die Summe deiner UTXOs. Sie werden immer ganz ausgegeben, der Rest kommt als Wechselgeld zurück.", "utxo"], ["vByte", "vBytes?", "Virtuelles Byte: Maß für die Größe einer Zahlung. Die Gebühr wird in Sats pro vByte (sat/vB) angegeben.", "bahnhof"], ["Wallet", "Wallets?", "Die App oder das Gerät, das deine Schlüssel verwahrt. Die Bitcoin selbst liegen in der Blockchain, die Wallet beweist, dass sie dir gehören.", "wallets"], ["Whitepaper", "Whitepaper", "Das 9-seitige Dokument, mit dem Satoshi Nakamoto 2008 Bitcoin vorstellte.", "geschichte"], ["Base58", "Base58(Check)?", "Die Schreibweise alter Adressen (1… und 3…): 58 Zeichen ohne die Verwechsler 0, O, I und l, plus eine Prüfsumme gegen Tippfehler.", "adressen"], ["Bech32", "Bech32m?", "Die Schreibweise moderner Adressen (bc1…): nur Kleinbuchstaben und Ziffern, mit starker Prüfsumme, die Tippfehler sicher erkennt.", "adressen"], ["Ableitungspfad", "Ableitungspfade?", "Die „Hausnummer“ eines Schlüssels in deiner Wallet, z. B. m/84'/0'/0'/0/0. Aus einem Seed entstehen so beliebig viele Schlüssel, immer in derselben Reihenfolge.", "ableitung"], ["Entropie", "Entropie", "Wie viel echter Zufall in etwas steckt, gemessen in Bit. Ein Seed aus 12 Wörtern hat 128 Bit, das sind mehr Möglichkeiten als Sandkörner auf der Erde.", "entropie"], ["Elliptische Kurve", "[Ee]lliptische[n]? Kurven?|secp256k1", "Die Rechenformel hinter den Bitcoin-Schlüsseln (y² = x³ + 7). Vorwärts rechnen ist leicht, rückwärts praktisch unmöglich.", "kurven"], ["Schnorr-Signatur", "Schnorr(-Signatur(en)?)?", "Die modernere Unterschrift seit dem Taproot-Upgrade 2021: kleiner als ECDSA, und mehrere Schlüssel lassen sich zu einem zusammenrechnen.", "signaturen"], ["Merkle-Baum", "Merkle-B(aum|äume)|Merkle-Root", "Ein Baum aus Hashes: Tausende Zahlungen werden paarweise zusammengehasht, bis nur ein einziger Hash übrig bleibt, der im Block-Kopf steht.", "merkle"], ["Prüfsumme", "Prüfsummen?", "Ein paar zusätzliche Zeichen, die aus dem Rest berechnet werden. Vertippst du dich, passt die Prüfsumme nicht mehr und die Wallet warnt.", "adressen"], ["Quantencomputer", "Quantencomputern?", "Ein neuartiger Rechner, der bestimmte Aufgaben extrem schnell lösen könnte, darunter das Knacken heutiger Signaturen. Für Bitcoin noch weit entfernt, aber ein Thema für die Zukunft.", "quanten"], ["SHA-256", "SHA-256", "Die Hash-Funktion von Bitcoin: macht aus beliebigen Daten einen 256-Bit-Fingerabdruck, in 64 Runden voller Bit-Tricks.", "sha256"], ["Fiatgeld", "Fiatgeld(es)?|Fiat-Geld", "Geld, das nur per Gesetz gilt und nicht durch Gold gedeckt ist, z. B. Euro und Dollar. Zentralbanken können davon beliebig viel erzeugen.", "geldgeschichte"], ["Geldmenge", "Geldmengen?", "Wie viel Geld insgesamt im Umlauf ist, inklusive Kontoguthaben. Im Euroraum hat sie sich seit 1999 fast vervierfacht.", "geldschoepfung"], ["Cantillon-Effekt", "Cantillon-Effekt(s|es)?", "Wer neues Geld zuerst bekommt, kauft noch zu alten Preisen. Wer es zuletzt bekommt, zahlt schon die höheren.", "cantillon"], ["Stock-to-Flow", "Stock-to-Flow", "Bestand geteilt durch neue Menge pro Jahr. Misst, wie knapp ein Gut ist. Je höher, desto schwerer zu verwässern.", "knappheit"], ["Spread", "Spreads?", "Der Aufschlag auf den echten Kurs beim Kauf. Man sieht ihn nicht als Gebühr, zahlt ihn aber trotzdem.", "kaufen"], ["MiCA", "MiCA(R)?", "Die EU-Regeln für Krypto-Anbieter. Anbieter brauchen damit eine Lizenz, in Deutschland über die BaFin.", "kaufen"], ["CoinJoin", "CoinJoins?", "Viele Nutzer bündeln ihre Zahlungen zu einer gemeinsamen. So lässt sich schwerer verfolgen, wer wem gezahlt hat.", "privatsphaere"], ["Wechselgeld", "Wechselgeld(es)?", "Der Rest einer Zahlung, der an eine neue Adresse des Absenders zurückgeht, wie Wechselgeld an der Kasse.", "privatsphaere"], ["Script", "Script", "Die kleine Programmiersprache in jeder Bitcoin-Zahlung. Sie legt fest, wer einen Betrag ausgeben darf.", "script"], ["Zeitschloss", "Zeitschl(oss|össer)|Timelocks?", "Eine Regel im Script: Der Betrag darf erst ab einem bestimmten Block oder Datum ausgegeben werden.", "script"], ["Stablecoin", "Stablecoins?", "Ein Token, dessen Wert an eine Währung gebunden ist, meist 1 Dollar. Herausgegeben von Firmen, die Guthaben auch einfrieren können.", "eigenschaften"], ["Digitaler Euro", "[Dd]igitale[nr]? Euro", "Geplantes digitales Zentralbankgeld der EZB, frühestens ab 2029. Ein echter Euro, mit Haltegrenze und Offline-Funktion.", "eigenschaften"], ["Allzeithoch", "Allzeithochs?|Rekordhochs?", "Der höchste Kurs, den Bitcoin je erreicht hat. Danach folgten in der Geschichte oft lange Crashs.", "zyklen"], ["Bärenmarkt", "Bärenmarkts?|Bärenmärkte", "Eine lange Phase fallender Kurse. Bei Bitcoin dauerten sie bisher oft ein Jahr und länger.", "zyklen"], ["Erbplan", "Erbplan|Notfall-?[Pp]lan", "Ein Plan, damit deine Familie im Notfall an deine Bitcoin kommt, ohne dass der Seed offen herumliegt.", "seed"], ["Konsens", "Konsens(es|regeln)?", "Die Einigung aller Nodes auf dieselbe Blockchain und dieselben Regeln, ganz ohne Chef.", "konsens"], ["Byzantinische Generäle", "[Bb]yzantinische[n]? Generäle|Generäle-Problem|Problem der Generäle", "Das klassische Problem: Wie einigen sich Teilnehmer, wenn manche lügen? Bitcoin löst es mit Proof of Work.", "konsens"], ["Difficulty-Anpassung", "Difficulty-Anpassung|Schwierigkeitsanpassung", "Alle 2.016 Blöcke passt Bitcoin die Schwierigkeit an, damit ein Block im Schnitt 10 Minuten dauert.", "konsens"], ["Verwaister Block", "[Vv]erwaiste[rn]? Bl(ock|öcke)", "Ein gültiger Block, der verliert, weil die andere Kette länger wurde. Seine Zahlungen landen in einem späteren Block.", "konsens"]];
  // Begriffe im Text antippbar machen: je Seite nur das erste Vorkommen, nicht in Überschriften, Knöpfen, Quiz und Szenen
  const BASE = document.querySelector('link[href^="../lern.css"]') ? "../" : "";   // Unterordner-Seite oder Startseite
  // Chips wie „(Welt 6)“ mit folgendem Satzzeichen zusammenhalten, damit keine Zeile mit „.“ beginnt
  function glue(){
    // Zahl und Einheit nie trennen („75 %“, „3 Jahre“, „z. B.“)
    const RX = /(\d) (?=(%|‰|€|\$|BTC|sats?\b|sat\/vB|Mio\.|Mrd\.|Bio\.|Jahre|Jahren|Tage|Min\.|Minuten|Byte|Bit\b|vB|TWh|Wörter|Level|Bestätigung|Bestätigungen|Block|Blöcke))|z\. B\./g, tw = document.createTreeWalker(document.querySelector(".wrap") || document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) if (/\d |z\. B\./.test(n.nodeValue) && !n.parentElement.closest("script,style,textarea")) n.nodeValue = n.nodeValue.replace(RX, (m, d) => d ? d + "\u00a0" : "z.\u00a0B.");
    // Begriffe und Chips wie „(Welt 6)“ mit folgendem Satzzeichen zusammenhalten, damit keine Zeile mit „.“ beginnt (auch durch <b>…</b> hindurch)
    const INL = /^(B|STRONG|EM|I|U|A|SPAN)$/, last = e => { let x = e.nextSibling; while (x && x.nodeType === 3 && !x.nodeValue.length) x = x.nextSibling; return !x; }, first = e => { let x = e.previousSibling; while (x && x.nodeType === 3 && !x.nodeValue.length) x = x.previousSibling; return !x; };
    document.querySelectorAll(".wrap .gl, .wrap .later").forEach(c => {
      let top = c; while (top.parentElement && INL.test(top.parentElement.tagName) && !top.parentElement.classList.contains("glw") && last(top) && first(top)) top = top.parentElement;
      if (top.parentElement && top.parentElement.classList.contains("glw") && last(top)) top = top.parentElement;
      let n = top.nextSibling; while (n && n.nodeType === 3 && !n.nodeValue.length) n = n.nextSibling;
      let pv = top.previousSibling; while (pv && pv.nodeType === 3 && !pv.nodeValue.length) pv = pv.previousSibling;
      const m = n && n.nodeType === 3 && n.nodeValue.match(/^[.,;:!?)“"]+/), lm = pv && pv.nodeType === 3 && pv.nodeValue.match(/[(„"‚]+$/);
      if (!m && !lm) return;
      const w = document.createElement("span"); w.className = "glw"; top.before(w);
      if (lm) w.appendChild(pv.splitText(pv.nodeValue.length - lm[0].length)); w.appendChild(top);
      if (m){ n.splitText(m[0].length); w.appendChild(n); } });
  }
  function glossify(){
    const skip = "h1,h2,h3,a,button,.opts,.lbl,.say,.scn,code,input,label,.foot,.top,svg,.tcard,.mode,.num,script,style,.gl,.guide,.toast,.bossbg,.lvup,.cn,.kv,.chainS,.addrs,select,textarea,.ledger,.nd,.pts,table,.nogl,summary";
    const root = document.querySelector(".wrap"); if (!root || /\/lexikon\//.test(location.pathname)) return;
    const off = (document.body.dataset.nogl || "").split(",");   // Begriffe, die auf dieser Seite etwas anderes bedeuten
    const used = new Set(), walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => n.nodeValue.trim().length > 2 && !n.parentElement.closest(skip) ? 1 : 2});
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    const RX = GLOSSAR.map((g, i) => [i, off.includes(g[0]) ? /(?!)/ : new RegExp(`(^|[^\\wäöüÄÖÜß-])(${g[1]})(?![\\wäöüÄÖÜß])`)]);
    nodes.forEach(tn => {
      for (const [i, rx] of RX){
        if (used.has(i)) continue;
        const m = tn.nodeValue.match(rx); if (!m) continue;
        used.add(i);
        const at = m.index + m[1].length; let after = tn.splitText(at); after.nodeValue = after.nodeValue.slice(m[2].length);
        const b = document.createElement("button"); b.type = "button"; b.className = "gl"; b.dataset.g = i; b.textContent = m[2];
        tn.parentNode.insertBefore(b, after);
        // Satzzeichen direkt davor/danach (z. B. „Mempool,“) an den Begriff kleben, damit keine Zeile mit Komma beginnt
        const lm = tn.nodeValue.match(/\S+$/), tm = after.nodeValue.match(/^\S+/);
        if (lm || tm){ const w = document.createElement("span"); w.className = "glw"; b.parentNode.insertBefore(w, b);
          if (lm) w.appendChild(tn.splitText(tn.nodeValue.length - lm[0].length)); w.appendChild(b);
          if (tm){ const rest = after.splitText(tm[0].length); w.appendChild(after); after = rest; } }
        tn = after;   // im Rest weitersuchen
      }
    });
    document.addEventListener("click", e => {
      const b = e.target.closest(".gl"), pop = document.querySelector(".glpop");
      if (pop && !e.target.closest(".glpop")) pop.remove();
      if (!b) return;
      tcount("words"); titles();
      const [t, , d, w] = GLOSSAR[+b.dataset.g], p = document.createElement("div"), r = b.getBoundingClientRect();
      p.className = "glpop"; p.innerHTML = `<b>📖 ${t}</b><span>${d}</span>${w && w !== here && (() => { const ids = PATH.map(x => x[0]), hi = ids.indexOf(here), wi = ids.indexOf(w); return hi < 0 || wi < 0 || wi < hi; })() ? `<a href="${BASE}${w}/">Mehr dazu →</a>` : ""}<a href="${BASE}lexikon/" class="all">Alle Begriffe</a>`;
      document.body.appendChild(p);
      const x = Math.min(Math.max(8, r.left + scrollX - 20), document.documentElement.clientWidth - p.offsetWidth - 8);
      p.style.left = x + "px"; p.style.top = (r.bottom + scrollY + 8) + "px";
    });
  }


  // ---------- Titel (Erfolge): werden aus dem Fortschritt berechnet und einmalig gemeldet ----------
  const TK = "satsland-titles";
  const tget = () => { try { return JSON.parse(localStorage.getItem(TK)) || {}; } catch(e){ return {}; } };
  const tset = o => { try { localStorage.setItem(TK, JSON.stringify(o)); } catch(e){} };
  const TITLES_LIST = [
    ["🧭", "Entdecker", "Alle Welten mindestens einmal besucht", (s) => PATH.every(([id]) => s[id])],
    ["🎯", "Fehlerlos", "Ein Welt-Quiz ohne Fehler geschafft", (s) => PATH.some(([id]) => s[id] && s[id].quiz && s[id].quiz === s[id].total)],
    ["💎", "Perfektionist", "Alle Welt-Quizze ohne Fehler", (s) => PATH.every(([id]) => s[id] && s[id].quiz && s[id].quiz === s[id].total)],
    ["🍕", "Pizza-Kenner", "Die Zeitreise geschafft", (s) => done(s, "geschichte")],
    ["🔥", "Funkenschlag", "3 Tage Tages-Challenge in Folge", (s, d) => (d.best || 0) >= 3],
    ["☄️", "Dauerbrenner", "7 Tage Tages-Challenge in Folge", (s, d) => (d.best || 0) >= 7],
    ["⚔️", "Bossjäger", "Den ersten Boss besiegt", (s, d, b) => BOSSES.some((x, k) => b[k])],
    ["✨", "Glanzsammler", "3 Glanz-Bosskarten", (s, d, b) => BOSSES.filter((x, k) => b[k] === "perfect").length >= 3],
    ["🏆", "Bezwinger", "Alle Welt-Bosse besiegt", (s, d, b) => BOSSES.every((x, k) => b[k])],
    ["👑", "Satoshis Erbe", "Den Endboss besiegt", (s, d, b) => !!b.f],
    ["🐋", "Wal", "Alle Welten geschafft", (s) => PATH.every(([id]) => done(s, id))],
    ["📚", "Wortschatz", "10 Begriffe im Lexikon nachgeschlagen", (s, d, b, t) => (t.words || 0) >= 10],
    ["🔬", "Tüftler", "Die erste Profi-Vertiefung geschafft", (s) => PRO.flat().some(id => done(s, id))],
    ["🧙", "Cypherpunk", "Alle Profi-Vertiefungen geschafft", (s) => PRO.flat().every(id => done(s, id))],
    ["📜", "Whitepaper-Leser", "Alle 13 Abschnitte des Whitepapers gelesen", (s, d, b, t) => (t.wp || []).length >= 13],
    ["🦉", "Nachteule", "Zwischen Mitternacht und 4 Uhr gelernt", (s, d, b, t) => !!t.owl],
  ];
  // Prüft alle Titel; neue werden gespeichert und als Meldung gezeigt
  function titles(){
    const t = tget(), s = load(), d = streak(), b = bossWon(), had = t.got || {};
    const now = TITLES_LIST.filter(x => x[3](s, d, b, t)).map(x => x[1]), fresh = now.filter(n => !had[n]);
    if (fresh.length){ fresh.forEach(n => had[n] = Date.now()); t.got = had; tset(t);
      fresh.forEach((n, i) => { const x = TITLES_LIST.find(y => y[1] === n); setTimeout(() => toast(`🏅 Neuer Titel: ${x[0]} <b>${n}</b>`), 600 + i*3800); }); }
    return had;
  }
  const tcount = key => { const t = tget(); t[key] = (t[key] || 0) + 1; tset(t); };


  // ---------- Fortschritt mitnehmen: alles als Code, ohne Konto und ohne Server ----------
  const SYNC_KEYS = ["bvb-lernen", "satsland-boss", "satsland-seen", "satsland-daily", "satsland-titles", "satsland-rep", "satsland-tresor"];
  function syncExport(){
    const o = {}; SYNC_KEYS.forEach(k => { try { const v = localStorage.getItem(k); if (v) o[k] = JSON.parse(v); } catch(e){} });
    return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  // Zusammenführen statt überschreiben: von beiden Geräten zählt jeweils das Bessere
  function syncImport(code){
    if (typeof code !== "string" || !code.trim() || code.length > 50000) return false;
    let o; try { o = JSON.parse(decodeURIComponent(escape(atob(code.trim().replace(/-/g, "+").replace(/_/g, "/"))))); } catch(e){ return false; }
    // Fremde Codes nie blind übernehmen: nur bekannte Bereiche, harmlose Schlüssel und einfache Werte (Zahlen, Ja/Nein, kurze Texte)
    const KEYOK = k => /^[\w-]{1,40}$/.test(k) && !["__proto__", "constructor", "prototype"].includes(k);
    const clean = (v, d) => {
      if (typeof v === "number") return Number.isFinite(v) && Math.abs(v) < 1e13 ? v : undefined;
      if (typeof v === "boolean") return v;
      if (typeof v === "string") return v.length <= 40 && /^[\w .:\-äöüÄÖÜß]*$/.test(v) ? v : undefined;
      if (d > 3 || !v || typeof v !== "object") return undefined;
      if (Array.isArray(v)) return v.slice(0, 500).map(x => clean(x, d + 1)).filter(x => x !== undefined && typeof x !== "object");
      const r = {}; Object.keys(v).slice(0, 500).forEach(k => { if (!KEYOK(k)) return; const c = clean(v[k], d + 1); if (c !== undefined) r[k] = c; }); return r;
    };
    if (!o || typeof o !== "object" || Array.isArray(o)) return false;
    o = Object.fromEntries(SYNC_KEYS.filter(k => o[k] && typeof o[k] === "object" && !Array.isArray(o[k])).map(k => [k, clean(o[k], 0)]));
    if (!Object.keys(o).length) return false;
    const isObj = x => x && typeof x === "object" && !Array.isArray(x);
    ["bvb-lernen", "satsland-rep"].forEach(k => { if (o[k]) Object.keys(o[k]).forEach(id => { if (!isObj(o[k][id])) delete o[k][id]; }); });
    const get = k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch(e){ return {}; } }, put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
    const L = get("bvb-lernen"); Object.entries(o["bvb-lernen"] || {}).forEach(([id, v]) => { const a = L[id] || {}; L[id] = Object.assign({}, a, v, {quiz: Math.max(a.quiz || 0, v.quiz || 0) || undefined, total: v.total || a.total}); }); put("bvb-lernen", L);
    const B = get("satsland-boss"); const B0 = bossWon(); localStorage.setItem("satsland-boss", JSON.stringify(Object.assign({}, o["satsland-boss"] || {}))); const B1 = bossWon(); Object.entries(B1).forEach(([k, v]) => { if (v === "perfect" || !B0[k]) B0[k] = v; }); put("satsland-boss", B0);
    const D = get("satsland-daily"), d2 = o["satsland-daily"] || {}; if ((d2.last || "") > (D.last || "") || (d2.streak || 0) > (D.streak || 0)) put("satsland-daily", Object.assign({}, D, d2, {best: Math.max(D.best || 0, d2.best || 0)}));
    const T = get("satsland-titles"), t2 = o["satsland-titles"] || {}; T.got = Object.assign({}, t2.got || {}, T.got || {}); T.words = Math.max(T.words || 0, t2.words || 0); T.owl = T.owl || t2.owl; T.wp = [...new Set([...(T.wp || []), ...(t2.wp || [])])]; put("satsland-titles", T);
    const Tr = get("satsland-tresor"), tr2 = o["satsland-tresor"] || {}; Object.keys(tr2).forEach(k => { if (tr2[k] === 1) Tr[k] = 1; }); put("satsland-tresor", Tr);
    const Rp = get("satsland-rep"); Object.entries(o["satsland-rep"] || {}).forEach(([k, v]) => { if (!Rp[k] || (v.b || 0) > (Rp[k].b || 0)) Rp[k] = v; }); put("satsland-rep", Rp);
    return true;
  }

  // ---------- Wiederholen: Lernkartei mit wachsenden Abständen ----------
  // Fach 0 = morgen, dann 3, 7, 21, 60 Tage. Falsch = zurück in Fach 0.
  const RK = "satsland-rep", RINT = [1, 3, 7, 21, 60], DAY = 864e5;
  const repGet = () => { try { return JSON.parse(localStorage.getItem(RK)) || {}; } catch(e){ return {}; } }, repSet = o => { try { localStorage.setItem(RK, JSON.stringify(o)); } catch(e){} };
  function repAdd(id, qi, [q, opts, ok, why], right){
    const R = repGet(), k = id + ":" + qi; if (R[k]) return;
    const box = right ? 1 : 0; R[k] = {id, q, o: opts, ok, w: why, b: box, d: Date.now() + RINT[box]*DAY}; repSet(R);
  }
  const repDue = () => Object.entries(repGet()).filter(([, r]) => r.d <= Date.now()).sort((a, b) => a[1].d - b[1].d);
  function review(box, onChange){
    const due = repDue(), all = Object.keys(repGet()).length;
    if (!due.length){ box.innerHTML = `<p class="muted" style="margin:0">${all ? `✓ Alles wiederholt! Neue Fragen kommen zurück, bevor du sie vergisst. <b>${all}</b> Fragen in deiner Lernkartei.` : "Hier landen deine Quizfragen aus den Leveln. Sie kommen nach 1, 3, 7 und 21 Tagen zurück, damit das Wissen hängen bleibt."}</p>`; onChange && onChange(0); return; }
    const [k, r] = due[0], order = r.o.map((o, i) => [Math.random(), i, o]).sort((a, b) => a[0] - b[0]);
    box.innerHTML = `<p class="muted sm" style="margin:0 0 6px">Noch <b>${due.length}</b> fällig · aus „${TITLES[r.id] ? TITLES[r.id][0] : r.id}“</p><p class="dq">${r.q}</p>
      <div class="opts">${order.map(([, i, o]) => `<button type="button" data-i="${i}">${o}</button>`).join("")}</div><p class="why" hidden></p>`;
    onChange && onChange(due.length);
    box.querySelector(".opts").onclick = e => { const b = e.target.closest("button"); if (!b || b.disabled) return;
      const right = +b.dataset.i === r.ok, R = repGet(), c = R[k];
      box.querySelectorAll(".opts button").forEach(x => { x.disabled = true; if (+x.dataset.i === r.ok) x.classList.add("ok"); }); if (!right) b.classList.add("no");
      c.b = right ? Math.min(c.b + 1, RINT.length - 1) : 0; c.d = Date.now() + RINT[c.b]*DAY; repSet(R); sfx(right ? "ok" : "no");
      const w = box.querySelector(".why"); w.hidden = false; w.innerHTML = (right ? `✓ Sitzt! Wieder in ${RINT[c.b]} Tagen. ` : "Nicht ganz, morgen kommt sie wieder. ") + r.w + ` <button class="btn ghost" type="button" style="margin-top:8px">Weiter →</button>`;
      w.querySelector("button").onclick = () => review(box, onChange); };
  }

  // ---------- Spaß-Schicht: Level, Konfetti, Einblenden ----------
  // Sats-Level nach geschafften Welten (angelehnt an die Bitcoin-Tierwelt von Garnele bis Wal)
  const LEVELS = [[0, "🦠", "Plankton", "plankton"], [1, "🦐", "Garnele", "shrimp"], [3, "🦀", "Krabbe", "crab"], [7, "🐟", "Fisch", "fish"], [12, "🐬", "Delfin", "dolphin"], [20, "🦈", "Hai", "shark"], [28, "🐳", "Buckelwal", "humpback"], [37, "🐋", "Wal", "whale"]];
  const count = s => PATH.filter(([id]) => done(s, id)).length;
  function level(n){ let L = LEVELS[0]; for (const l of LEVELS) if (n >= l[0]) L = l; return {n, ico: L[1], name: L[2], art: L[3]}; }
  // „Weniger Bewegung“ ist ein eigener Schalter (Fußzeile der Startseite): Firmen-PCs melden die Systemeinstellung oft, obwohl Animationen gewünscht sind
  const CK = "satsland-calm", calm = (() => { try { return localStorage.getItem(CK) === "1"; } catch(e){ return false; } })();
  if (calm) document.documentElement.classList.add("calm");
  function calmToggle(){ try { localStorage.setItem(CK, calm ? "0" : "1"); } catch(e){} location.reload(); }
  function confetti(){ if (window.__sweep) return;
    if (calm) return;
    const c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c);
    const x = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight, C = ["#f7931a", "#ffc94d", "#34d982", "#7cc4ff", "#ff5c73"];
    const P = Array.from({length: 130}, () => ({x: W/2, y: H*.4, vx: (Math.random() - .5)*16, vy: -Math.random()*13 - 4, r: Math.random()*6 + 4, c: C[Math.random()*5 | 0], a: Math.random()*6, b: Math.random() < .25}));
    let t = 0;
    (function f(){ x.clearRect(0, 0, W, H);
      P.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += .15; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c;
        if (p.b){ x.font = `bold ${p.r*3}px sans-serif`; x.fillText("₿", 0, 0); } else x.fillRect(-p.r/2, -p.r/3, p.r, p.r*.6); x.restore(); });
      if (++t < 160) requestAnimationFrame(f); else c.remove(); })();
  }
  function toast(html){ if (window.__sweep) return; const t = document.createElement("div"); t.className = "toast"; t.innerHTML = html; document.body.appendChild(t); setTimeout(() => t.classList.add("out"), 3400); setTimeout(() => t.remove(), 3900); }
  // ---------- Ton & Vibration (ohne Audio-Dateien, per Web Audio erzeugt; abschaltbar) ----------
  const SND = "satsland-sound"; let AC = null;
  const sndOn = () => { try { return localStorage.getItem(SND) !== "0"; } catch(e){ return true; } };
  function tone(f, d, type = "sine", v = .12, delay = 0, slide = 0){
    const t0 = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + d);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + .01); g.gain.exponentialRampToValueAtTime(.001, t0 + d);
    o.connect(g).connect(AC.destination); o.start(t0); o.stop(t0 + d + .05); }
  const VIB = {ok: 15, no: [40, 40, 40], hit: 30, ko: [60, 40, 140], lose: [150], lvl: [20, 40, 20]};
  const SFX = {click: () => tone(700, .05, "triangle", .04),
    ok: () => { tone(660, .12, "triangle", .12); tone(990, .2, "triangle", .12, .08); },
    no: () => tone(240, .28, "square", .05, 0, 130),
    coin: () => { tone(988, .07, "square", .04); tone(1319, .22, "square", .04, .06); },
    hit: () => { tone(160, .2, "square", .09, 0, 55); tone(1400, .06, "triangle", .06); },
    ko: () => { tone(90, .5, "sawtooth", .07, 0, 40); [523, 659, 784, 1047].forEach((f, i) => tone(f, .25, "triangle", .11, .15 + i*.1)); },
    lose: () => [392, 330, 262, 196].forEach((f, i) => tone(f, .28, "triangle", .1, i*.15)),
    lvl: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .2, "triangle", .1, i*.08)),
    star: () => tone(1100 + Math.random()*300, .18, "sine", .1),
    lure: () => [784, 988, 1175, 988, 1319].forEach((f, i) => tone(f, .32, "sine", .07, i*.16)),
    sour: () => { tone(622, .3, "sine", .06, 0, 560); tone(659, .3, "sine", .05, 0, 520); }};
  function sfx(k){ if (window.__sweep) return;
    if (!sndOn()) return;
    try { if (navigator.vibrate && VIB[k]) navigator.vibrate(VIB[k]); } catch(e){}
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); (SFX[k] || (() => {}))(); } catch(e){}
  }
  // Stand der fachlichen Prüfung unter jeder Quellenangabe (ein Ort zum Aktualisieren)
  const STAND = "November 2026";
  function stand(){ document.querySelectorAll("details.foot > p").forEach(p => p.insertAdjacentHTML("beforeend", `<br><span class="muted" style="font-size:12px">Stand der fachlichen Prüfung: ${STAND}. Vereinfachungen für Einsteiger sind bewusst gewählt, Details in den Quellen.</span>`)); }
  function sndBtn(){
    const top = document.querySelector(".top"); if (!top || top.querySelector(".snd")) return;
    const lx = top.querySelector('a[href*="lexikon"]'); if (lx && !lx.querySelector(".tx")) lx.innerHTML = lx.innerHTML.replace(/^(\S+)\s+(.+)$/, '$1<span class="tx"> $2</span>');
    const b = document.createElement("button"); b.type = "button"; b.className = "snd";
    const upd = () => { b.textContent = sndOn() ? "🔊" : "🔇"; b.title = sndOn() ? "Ton & Vibration aus" : "Ton & Vibration an"; b.setAttribute("aria-label", b.title); };
    b.onclick = () => { try { localStorage.setItem(SND, sndOn() ? "0" : "1"); } catch(e){} upd(); sfx("click"); }; upd(); top.appendChild(b);
  }
  document.addEventListener("click", e => { if (e.target.closest(".btn:not(.q .btn)")) sfx("click"); });

  // ---------- Level geschafft: Sterne und großer Weiter-Knopf ----------
  function lvDone(right, total, first, rankUp, L){
    const st = Math.round(right/total*3), nx = document.querySelector("#next a"), nb = document.querySelector("#next b");
    const fail = !right, msg = fail ? "Lies die Erklärungen unter den Fragen und versuch es gleich nochmal. Ab 1 richtigen Antwort ist das Level abgehakt." : st === 3 ? "Perfekt, alles richtig!" : st === 2 ? "Stark! Lies die eine Erklärung nochmal, dann sitzt alles." : "Geschafft! Wiederhole das Quiz für mehr Sterne.";
    const o = document.createElement("div"); o.className = "lvdone"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Level geschafft");
    o.innerHTML = `<div class="ldb"><small>${fail ? "Noch nicht geschafft" : first ? "Level geschafft!" : "Quiz wiederholt"}</small><div class="stars">${[0, 1, 2].map(i => `<span class="${i < st ? "on" : ""}" style="animation-delay:${.25 + i*.28}s">★</span>`).join("")}</div>
      <b class="sc">${right} von ${total} richtig</b><p>${msg}</p>${(() => { const nx2 = LEVELS.find(l => l[0] > L.n);
        const t = rankUp ? (rankUp.art === "whale" ? "<b>Du bist ein Wal!</b> Planki ist mächtig stolz auf dich." : `<b>Du bist gewachsen!</b> Du bist jetzt ${rankUp.ico} ${rankUp.name}, und Planki reitet mit.`)
          : fail ? "Planki glaubt an dich. Gleich nochmal!" : nx2 ? `Noch ${nx2[0] - L.n} Level, dann wirst du zum ${nx2[1]} ${nx2[2]}.` : "Du bist schon ein Wal, Planki genießt die Aussicht.";
        return `<div class="pk${rankUp ? " up" : ""}"><span class="pka">${ride(L.art)}</span><p>${t}<small>${L.n} von ${PATH.length} Level geschafft</small></p></div>`; })()}
      <div class="acts">${st < 3 ? `<button class="btn${fail ? "" : " ghost"}" type="button" data-again>🔄 Quiz nochmal</button>` : ""}${nx && !fail ? `<a class="btn" href="${nx.getAttribute("href")}">Weiter: ${nb ? nb.textContent : "nächstes Level"} →</a>` : ""}<button class="btn ghost" type="button" data-stay>Hier bleiben</button></div></div>`;
    document.body.appendChild(o);
    const close = () => o.remove(), again = o.querySelector("[data-again]");
    o.querySelector("[data-stay]").onclick = close; if (again) again.onclick = () => { location.hash = "quiz"; location.reload(); }; o.onclick = e => { if (e.target === o) close(); }; const esc = e => { if (e.key === "Escape"){ close(); removeEventListener("keydown", esc); } }; addEventListener("keydown", esc);
    sfx(fail ? "no" : "lvl"); for (let i = 0; i < st; i++) setTimeout(() => sfx("star"), 300 + i*280);
    if (st === 3) setTimeout(confetti, 900);
    (o.querySelector("a.btn") || again || o.querySelector("button")).focus();
  }

  // Level-Anzeige im Kopf jeder Seite
  function badge(){
    const L = level(count(load())), el = document.querySelector(".lvl") || document.createElement("a");
    el.className = "lvl"; el.href = here ? "../" : "#pth"; el.title = "Dein Rang: mehr Level schaffen, um aufzusteigen";
    el.innerHTML = `<span class="li">${art(L.art)}</span><span><b>${L.name}</b><small>${L.n} von ${PATH.length} Level</small></span><i><u style="width:${L.n/PATH.length*100}%"></u></i>`;
    if (!el.parentNode){ const top = document.querySelector(".top"), back = document.querySelector(".wrap > .back");
      if (top) top.insertBefore(el, top.children[1] || null); else if (back) back.after(el); }
  }
  // Welten erscheinen beim Scrollen
  // Kennzahlen zählen beim Hereingleiten kurz hoch (nur Text, Format bleibt)
  function countUp(card){
    if (!card.matches || !card.matches(".card") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Kurven in Diagrammen zeichnen sich einmal ein
    card.querySelectorAll("svg polyline, svg path").forEach(l => {
      const st = getComputedStyle(l); if (st.fill !== "none" || st.strokeDasharray !== "none" || +st.strokeWidth < 1.5 || l.closest(".scn, .a, .wico") || l.getTotalLength() < 150) return;
      l.setAttribute("pathLength", 1); l.style.strokeDasharray = 1; l.animate([{strokeDashoffset: 1}, {strokeDashoffset: 0}], {duration: 1100, easing: "cubic-bezier(.4,0,.2,1)"})
        .onfinish = () => { l.style.strokeDasharray = ""; l.removeAttribute("pathLength"); };
    });
    const RX = /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/;
    card.querySelectorAll(".kv b, .kv strong").forEach(el => {
      const tn = [...el.childNodes].find(n => n.nodeType === 3 && RX.test(n.nodeValue)); if (!tn) return;
      const orig = tn.nodeValue, m = orig.match(RX), raw = m[0], grp = raw.includes("."), dec = (raw.split(",")[1] || "").length, val = parseFloat(raw.replace(/\./g, "").replace(",", "."));
      if (!(val >= 2) || (!grp && !dec && val >= 1900 && val < 2200)) return;   // Jahreszahlen und Kleinkram nicht zählen
      const fmt = v => v.toLocaleString("de-DE", {minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: grp});
      const t0 = performance.now(), D = 900; let mine = orig; el.classList.add("cu");
      const step = t => { if (tn.nodeValue !== mine || !tn.isConnected){ el.classList.remove("cu"); return; }   // Seite hat den Wert inzwischen selbst geändert
        const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
        mine = k < 1 ? orig.replace(raw, fmt(val * e)) : orig; tn.nodeValue = mine;
        if (k < 1) requestAnimationFrame(step); else el.classList.remove("cu"); };
      requestAnimationFrame(step);
    });
  }
  function reveal(){
    if (calm || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); countUp(e.target); } }), {rootMargin: "0px 0px -6% 0px"});
    const vh = innerHeight;   // was beim Start schon sichtbar ist, steht sofort da; nur Weiter-unten-Inhalte gleiten beim Scrollen herein
    document.querySelectorAll(".wrap > .card, .learn > div, a.w").forEach((el, i) => { if (el.getBoundingClientRect().top < vh * .92) return; el.classList.add("rv"); el.style.setProperty("--d", (i % 4)*70 + "ms"); io.observe(el); });
    setTimeout(() => document.querySelectorAll(".rv").forEach(el => el.classList.add("in")), 5000);   // Sicherheitsnetz
  }
  const seg = location.pathname.split("/").filter(Boolean), last = seg[seg.length - 1], here = PATH.some(([id]) => id === last) || proOf(last) >= 0 ? last : "";
  function init(){
    badge(); sndBtn(); intro(); stand(); glossify(); glue(); reveal(); guide(); setTimeout(titles, 1500);
    if (here && CARD[here]){ const h = document.querySelector("h1"); if (h && !h.previousElementSibling){ const i = document.createElement("span"); i.className = "wico"; i.setAttribute("aria-hidden", "true"); i.innerHTML = art(CARD[here]); h.before(i);
      const pk = proOf(here), k = pk >= 0 ? pk : chapterOf(here), c = CHAPTERS[k], p = document.createElement("p"); p.className = "chap"; p.innerHTML = pk >= 0 ? `🔬 Profi-Pfad · Welt ${k + 1} · ${c[0]} ${c[1]} · Vertiefung ${PRO[k].indexOf(here) + 1} von ${PRO[k].length}` : `Welt ${k + 1} · ${c[0]} ${c[1]} · Level ${k + 1}-${c[3].indexOf(here) + 1} von ${c[3].length}`; i.after(p); } }
  }

  // SHA-256, synchron (für Blockchain und Mining: schnell genug für viele Versuche pro Bild)
  const K = new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
  const enc = new TextEncoder(), W = new Uint32Array(64);
  function sha256(str){
    const msg = enc.encode(str), len = msg.length, n = ((len + 9 + 63) >> 6) << 6, buf = new Uint8Array(n);
    buf.set(msg); buf[len] = 0x80; const bits = len*8; buf[n - 4] = bits >>> 24; buf[n - 3] = bits >>> 16; buf[n - 2] = bits >>> 8; buf[n - 1] = bits;
    let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
    for (let o = 0; o < n; o += 64){
      for (let i = 0; i < 16; i++) W[i] = (buf[o+4*i] << 24) | (buf[o+4*i+1] << 16) | (buf[o+4*i+2] << 8) | buf[o+4*i+3];
      for (let i = 16; i < 64; i++){ const a = W[i-15], b = W[i-2]; const s0 = ((a>>>7)|(a<<25)) ^ ((a>>>18)|(a<<14)) ^ (a>>>3), s1 = ((b>>>17)|(b<<15)) ^ ((b>>>19)|(b<<13)) ^ (b>>>10); W[i] = (W[i-16] + s0 + W[i-7] + s1) | 0; }
      let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
      for (let i = 0; i < 64; i++){
        const S1 = ((e>>>6)|(e<<26)) ^ ((e>>>11)|(e<<21)) ^ ((e>>>25)|(e<<7)), ch = (e & f) ^ (~e & g), t1 = (h + S1 + ch + K[i] + W[i]) | 0;
        const S0 = ((a>>>2)|(a<<30)) ^ ((a>>>13)|(a<<19)) ^ ((a>>>22)|(a<<10)), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h0=(h0+a)|0; h1=(h1+b)|0; h2=(h2+c)|0; h3=(h3+d)|0; h4=(h4+e)|0; h5=(h5+f)|0; h6=(h6+g)|0; h7=(h7+h)|0;
    }
    return [h0,h1,h2,h3,h4,h5,h6,h7].map(v => (v >>> 0).toString(16).padStart(8, "0")).join("");
  }

  init();
  return {DATA, DSTAND, height, heightF, PRICE: {USD: 64800, EUR: 58800}, api, sfx, review, repDue, shareCard, calm, calmToggle, PRO, proOf, TITLES, syncExport, syncImport, TITLES_LIST, titles, finalCard, GLOSSAR, nextStep, PATH, CHAPTERS, ART, art, BOSSES, boss, bossWon, bossCard, seen, bossName, bossArt, ride, CARD, daily, streak, say, GK, chapterOf, LEVELS, level, count, load, done, visit, quiz, renderNext, nextAfter, sha256, confetti, toast};
})();
// Offline-Betrieb und „Zum Startbildschirm hinzufügen“: Service Worker der ganzen Seite anmelden
try { const me = document.currentScript && document.currentScript.src; if (me && "serviceWorker" in navigator && /^https:|^http:\/\/localhost/.test(location.href))
  addEventListener("load", () => navigator.serviceWorker.register(new URL("sw.js", me).href).catch(() => {})); } catch(e){}
// Seitenstart: sobald alle Skripte gelaufen sind, Inhalt in einem Zug einblenden
document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(() => document.documentElement.classList.remove("boot")));
// Sofortige Seitenwechsel: Seiten im Hintergrund vorladen, sobald man einen Link berührt (Chrome, Edge), das nächste Level gleich vorab
document.addEventListener("DOMContentLoaded", () => { try { if (HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")){ const nx = document.querySelector("#next a, .next a");
  const sr = document.createElement("script"); sr.type = "speculationrules";
  sr.textContent = JSON.stringify({prefetch: [{where: {and: [{href_matches: "/*"}, {not: {selector_matches: "[href^='#']"}}]}, eagerness: "moderate"}].concat(nx ? [{urls: [nx.href], eagerness: "eager"}] : [])});
  document.head.appendChild(sr); } } catch(e){} });
// Ruhige Regler: Wert-Anzeigen neben Reglern bekommen ihre größte Breite (sonst springt die Skala),
// Felder mit data-hold ihre größte Höhe (sonst springt der Inhalt darunter). Einmal still alle Werte durchspielen.
(() => {
  let w0 = 0;
  function hold(){
    const rs = [...document.querySelectorAll('input[type="range"]:not([data-nosweep])')]; if (!rs.length || innerWidth === w0) return; w0 = innerWidth;
    const hs = [...new Set([...document.querySelectorAll("[data-hold]")].map(h => getComputedStyle(h).display === "inline" ? h.parentElement : h))];
    const vs = rs.flatMap(r => [...r.parentElement.children].filter(x => x !== r && x.id && /^(B|OUTPUT|SPAN|STRONG|EM)$/.test(x.tagName) && x.offsetParent));
    if (!hs.length && !vs.length) return;
    hs.forEach(h => h.style.minHeight = ""); vs.forEach(v => { v.style.minWidth = ""; if (getComputedStyle(v).display === "inline") v.style.display = "inline-block"; v.style.textAlign = "right"; });
    const mh = hs.map(h => h.offsetHeight), mw = vs.map(v => v.getBoundingClientRect().width);
    const fire = r => r.dispatchEvent(new Event("input", {bubbles: true})), see = () => { hs.forEach((h, i) => mh[i] = Math.max(mh[i], h.offsetHeight)); vs.forEach((v, i) => mw[i] = Math.max(mw[i], v.getBoundingClientRect().width)); };
    window.__sweep = 1;
    const v0 = rs.map(r => r.value), set = (r, v) => { r.value = v; fire(r); };
    try { for (const ctx of [null, "min", "max"]){   // jeder Regler einzeln, die anderen auf Start, ganz links und ganz rechts
      if (ctx && rs.length < 2) break;
      rs.forEach((r, j) => { const sec = r.closest("section, .card") || document.body, mates = rs.filter((o, i) => i !== j && sec.contains(o));
        if (ctx && !mates.length) return;   // Regler in anderen Abschnitten beeinflussen sich nicht
        rs.forEach((o, i) => i !== j && set(o, ctx && mates.includes(o) ? o[ctx] : v0[i]));
        const st = +r.step || 1, n = Math.max(1, Math.min(ctx ? 24 : 60, Math.round((r.max - r.min)/st)));
        for (let k = 0; k <= n; k++){ set(r, +r.min + (r.max - r.min)*k/n); see(); } set(r, v0[j]); }); }
      rs.forEach((r, i) => set(r, v0[i])); } catch(e){}
    window.__sweep = 0;
    hs.forEach((h, i) => h.style.minHeight = mh[i] + "px"); vs.forEach((v, i) => { v.style.minWidth = Math.ceil(mw[i]) + "px"; v.dataset.tick = 1; });
  }
  addEventListener("load", () => setTimeout(hold, 60));
  let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(hold, 250); });
})();

// Lebendige Zahlen: Ändert sich ein Wert durch dich (Tippen, Regler), leuchtet er kurz auf
(() => {
  let last = -1e9; const SEL = ".kv b, .kv strong, output, [data-tick]";
  ["pointerdown", "keydown", "input", "change"].forEach(ev => addEventListener(ev, e => { if (e.isTrusted) last = performance.now(); }, {capture: true, passive: true}));
  const flash = el => { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); };
  const cands = n => n.nodeType !== 1 ? [] : n.matches(SEL) ? [n] : [...n.querySelectorAll(SEL)];
  addEventListener("DOMContentLoaded", () => { const root = document.querySelector(".wrap"); if (!root) return;
    new MutationObserver(ms => {
      if (performance.now() - last > 2500 || window.__sweep || document.documentElement.classList.contains("calm")) return;
      const done = new Set();
      for (const m of ms){
        if ([...m.addedNodes].some(n => n.classList && n.classList.contains("em"))) continue;   // Emoji-Tausch ist keine Wertänderung
        const t = m.target.nodeType === 3 ? m.target.parentElement : m.target, own = t && t.closest(SEL);
        if (own && own.classList.contains("cu")) continue;
        if (own){ if (done.has(own)) continue; done.add(own);
          const old = m.type === "characterData" ? m.oldValue : [...m.removedNodes].map(n => n.textContent).join("");
          if (old !== own.textContent && (m.type === "characterData" || m.removedNodes.length)) flash(own); continue; }
        if (m.type !== "childList") continue;
        const o = [...m.removedNodes].flatMap(cands), nw = [...m.addedNodes].flatMap(cands);
        nw.forEach((el, i) => { if (!done.has(el) && o[i] && o[i].textContent !== el.textContent){ done.add(el); flash(el); } });
      }
    }).observe(root, {subtree: true, childList: true, characterData: true, characterDataOldValue: true});
  });
})();

// Regler: Füllstand der Spur folgt dem Wert, auch wenn eine Seite den Wert per Code setzt
(() => {
  const fill = r => { const lo = +r.min || 0, hi = r.max === "" ? 100 : +r.max, p = hi > lo ? Math.min(1, Math.max(0, (r.valueAsNumber - lo) / (hi - lo))) : 0;
    r.style.setProperty("--p", `calc(${(p * 100).toFixed(2)}% + ${((.5 - p) * 22).toFixed(1)}px)`); };
  const all = () => document.querySelectorAll("input[type=range]").forEach(fill);
  const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  Object.defineProperty(HTMLInputElement.prototype, "value", {...d, set(v){ d.set.call(this, v); if (this.type === "range") fill(this); }});
  addEventListener("input", e => e.target.type === "range" && fill(e.target), true);
  addEventListener("click", () => requestAnimationFrame(all), true);
  addEventListener("DOMContentLoaded", all); addEventListener("load", () => setTimeout(all, 120));
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && (n.matches("input[type=range]") ? fill(n) : n.querySelectorAll && n.querySelectorAll("input[type=range]").forEach(fill)))))
    .observe(document.documentElement, {childList: true, subtree: true});
})();
// Lesefortschritt: dünne Linie oben auf Level-Seiten
(() => {
  if (location.pathname.split("/").filter(Boolean).length === 0) return;
  addEventListener("DOMContentLoaded", () => { if (!document.querySelector(".wrap")) return;
    const b = document.createElement("div"); b.className = "sprog"; b.setAttribute("aria-hidden", "true"); document.body.appendChild(b);
    let q = 0; const upd = () => { q = 0; const h = document.documentElement.scrollHeight - innerHeight; b.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
    addEventListener("scroll", () => q || (q = requestAnimationFrame(upd)), {passive: true}); addEventListener("resize", upd); upd(); });
})();
// Lichtkegel: Karten folgen auf dem Computer sanft der Maus
(() => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  addEventListener("pointermove", e => { const c = e.target.closest && e.target.closest(".wrap > .card"); if (!c) return; const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); }, {passive: true});
})();

// Partnerlinks: hier eintragen, sobald die Programme freigegeben sind. Dann wird automatisch als Werbung gekennzeichnet.
const PARTNER = {bitbox: "", trezor: ""};
addEventListener("DOMContentLoaded", () => {
  let any = false;
  document.querySelectorAll("a[data-hw]").forEach(a => { const u = PARTNER[a.dataset.hw]; if (u){ a.href = u; a.insertAdjacentHTML("afterend", '<small class="muted" style="display:block;text-align:center;font-size:12px">Partnerlink · Werbung</small>'); any = true; } });
  const n = document.getElementById("hwAd"); if (n && any) n.textContent = " Bei den Partnerlinks erhält Satsea eine kleine Provision, für dich ändert sich am Preis nichts.";
});

// Einheitliche Comic-Symbole: Emoji werden auf jedem Gerät durch dieselben Zeichnungen ersetzt (eigene Dateien in /e/, nichts Fremdes)
(() => {
  const me = document.currentScript; if (!me || !me.src) return;
  const BASE = new URL("e/", me.src).href;
  const RX = /\p{RI}\p{RI}|\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\p{EMod})?(?:\u200D\p{Extended_Pictographic}\uFE0F?(?:\p{EMod})?)*/gu;
  const KEEP = new Set([..."✓✗↺↻↩★☆✕✔↗↔➡⬆➕↘↙↖⬇⬅©®™‼⁉↪"]);
  const SKIP = "script,style,textarea,input,select,option,svg,title,canvas,.noem,[contenteditable]";
  const name = s => [...s].map(c => c.codePointAt(0).toString(16)).filter(c => c !== "fe0f").join("-");
  const fail = function(){ const t = document.createElement("span"); t.className = "noem"; t.textContent = this.alt; this.replaceWith(t); };   // Fallback ohne Endlosschleife
  function conv(tn){
    const t = tn.nodeValue; if (!t || t.length > 4000) return; RX.lastIndex = 0; let m, last = 0, frag = null;
    while ((m = RX.exec(t))){
      const s = m[0]; if (s.endsWith("\uFE0E") || KEEP.has(s.replace(/\uFE0F/g, ""))) continue;
      frag = frag || document.createDocumentFragment();
      if (m.index > last) frag.append(t.slice(last, m.index));
      const im = document.createElement("img"); im.className = "em"; im.alt = s; im.draggable = false; im.decoding = "async"; im.src = BASE + name(s) + ".svg"; im.onerror = fail;
      frag.append(im); last = m.index + s.length;
    }
    if (!frag) return; if (last < t.length) frag.append(t.slice(last)); tn.replaceWith(frag);
  }
  const ok = n => { const p = n.parentElement; return p && !p.closest(SKIP); };
  function scan(root){
    if (root.nodeType === 3){ if (ok(root)) conv(root); return; }
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = [];
    for (let n; (n = tw.nextNode());) if (/[\u2190-\u2BFF\uD83C-\uD83E\u3030\u303D\u3297\u3299]/.test(n.nodeValue) && ok(n)) list.push(n);
    list.forEach(conv);
  }
  const go = () => { scan(document.body);
    new MutationObserver(ms => ms.forEach(m => m.type === "characterData" ? scan(m.target) : m.addedNodes.forEach(scan)))
      .observe(document.body, {subtree: true, childList: true, characterData: true}); };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", go) : go();
})();

// Fühlbares Feedback überall: Ergebnisboxen (grün/rot) und Erfolge geben Ton + kurze Vibration, nur nach eigener Aktion
(() => {
  let last = -1e9; ["pointerdown", "keydown"].forEach(ev => addEventListener(ev, e => { if (e.isTrusted) last = performance.now(); }, {capture: true, passive: true}));
  const rec = () => performance.now() - last < 15000;
  addEventListener("DOMContentLoaded", () => {
    if (typeof Lern === "undefined" || !Lern.sfx) return; const done = new WeakMap();
    new MutationObserver(ms => { if (!rec() || window.__sweep) return;
      for (const m of ms){ const el = m.target; if (!(el instanceof Element)) continue;
        const k = el.matches(".res.bad, .hx.bad") ? (/Liquidiert/.test(el.textContent) ? "ko" : "no") : el.matches(".res.ok, .res.good, .hx.win") ? "ok" : "";
        if (!k){ done.delete(el); continue; } if (done.get(el) === el.className + k) continue; done.set(el, el.className + k); Lern.sfx(k); }
    }).observe(document.querySelector(".wrap") || document.body, {subtree: true, attributes: true, attributeFilter: ["class"]});
  });
})();
