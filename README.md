# Bitcoin Voyage

Kostenlose Lernwelt, die Geld und Bitcoin spielerisch erklärt. Statische Website ohne Server, Konto, Cookies oder Tracking.

## Aufbau

| Datei / Ordner | Inhalt |
| --- | --- |
| `index.html` | Startseite: Lernpfad-Karte, Tagesfrage, Wiederholen, Intro-Film, DEV-Menü (vor dem Start entfernen) |
| `lern.js` | Gemeinsame Logik aller Seiten: Lernpfad, Quiz, Bosse, Planki, Lexikon, Fortschritt (Inhaltsverzeichnis am Dateianfang) |
| `lern.css` | Gemeinsamer Stil, in Abschnitte gegliedert |
| `<thema>/index.html` | Eine Lernwelt pro Ordner, jeweils mit eigenem `const QUIZ = [...]` |
| `sw.js` | Service Worker für Offline-Betrieb (wird automatisch erzeugt) |
| `e/` | Emojis als SVG-Bilder |
| `og/` | Vorschaubilder für geteilte Links |
| `impressum/`, `datenschutz/`, `ueber/` | Rechtliches und Infos |
| `dev/` | Nur Entwicklung: Buch-PDF für das DEV-Menü |

## Regeln

- Fortschritt liegt nur im Browser (`localStorage`), Schlüssel beginnen mit `bvb-` oder `satsland-`.
- Keine Daten Dritter im Browser: Kurse und Netzwerkwerte sind feste Monatswerte (`STAND`, `SNAP` in `lern.js`).
- Keine Anlage- oder Steuerberatung.
- Nach Änderungen an `lern.js` / `lern.css` die Versionsnummer (`?v=`) in allen Seiten erhöhen.
