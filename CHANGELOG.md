# KDS Küchenmonitor – Changelog

## v1.3.0 – 2026-06-07

### ✨ Features
- **Versionsnummer im Header** – aktuelle App-Version (z.B. "v1.3.0") wird neben
  Monitor-Name/IP angezeigt (kommt aus version.json via getHTML).
- **Bestellungsansicht: Test-Bon-Button** – zeigt 3 Beispiel-Bons zum Testen von
  Layout/Schriftgröße ohne echte Bestellungen.
- **Bestellungsansicht: Schriftgrößen-Regler** – −/+ Regler skaliert die Bon-Schrift
  (Tischname, Menge, Produktname, Bon-Nr). EIGENER, getrennter Wert (`kds_order_scale`),
  unabhängig von der Produktansicht-Skalierung.

### 🔧 Repo-Hygiene
- Live-Frontend-Stand (`app.txt` mit Zoom/Test der Produktansicht) ins Repo übernommen –
  Repo und Live-Worker waren beim Frontend auseinandergelaufen, jetzt wieder synchron.

## v1.2.1 – 2026-06-07

### 🔥 Vorfall: Event-Ausfall 06.06.2026 (22:20 Ortszeit / 20:20 UTC)
Waehrend eines Events fielen beide aktiven Monitore GLEICHZEITIG aus –
ab 20:20:21 UTC kamen 0 Tickets mehr an. Backup-Drucker (direkt am LAN) lief weiter.

**Ursache (bewiesen):** Ein Deployment um 20:20:21 UTC mit Source "version_upload"
(also KEIN `wrangler deploy` aus dem Repo, sondern ein nackter API-Upload via Paperclip)
lud Worker-Version 2295b93f hoch und verlor dabei gegenueber der letzten guten
Version (c8d43251, 18:35):
- **R2-Binding `STORAGE` fehlte komplett**
- compatibility_date von 2025-01-01 auf 2024-09-23 zurueckgesetzt

Displays blieben "online/gruen" (GET-Heartbeats brauchen die Binding nicht),
nur die Ticket-POSTs schlugen fehl. Beide Monitore betroffen, weil EIN gemeinsamer Worker.

### ✅ Behoben
- **Rollback** auf gute Version c8d43251 via `wrangler rollback` → STORAGE-Binding +
  compat_date wiederhergestellt, System laeuft wieder auf allen Monitoren.
- Live-Stand des Workers gesichert (Frontend + Server-Bundle) als Referenzabzug.

### 📌 Lehre / Regel
- **NIE per nacktem version_upload deployen.** Immer `wrangler deploy` aus dem Repo,
  damit ALLE Bindings (DB, KDS_ROOM, STORAGE) + compat_date aus wrangler.toml kommen.
- Bei Problemen: `wrangler rollback <version-id>` → letzte gute Version in Sekunden.
- `wrangler deployments list` zeigt die Historie mit Zeitstempeln.

## v1.2.0 – 2026-04-15

### 🐛 Bugfixes
- **Doppeldruck behoben** – Beide Pis holten alle Jobs. Fix: jeder Pi pollt nur `?station=X`-eigene Jobs
- **Falsche Drucker-IP** – Config-Polling las globalen Key statt stationsspezifischem. Fix: Pi übergibt `?station=X` beim Config-Abruf
- **Drucker-Timeout 5s → 8s** – ESC/POS-Daten kamen bei langsamem Drucker zu spät → Fallback auf Auto-Discovery
- **Auto-Discovery überschrieb Config** – Scan-Ergebnis wurde in DB zurückgeschrieben und überschrieb manuelle Einstellung. Behoben
- **Doppelte nftables-Regel** – Port-80-Redirect war 2x eingetragen. Bereinigt + persistent gespeichert
- **cloudflared QUIC blockiert** – monitor1: UDP/QUIC im Netzwerk blockiert. Fix: `--protocol http2` erzwungen
- **monitor1 IP-Wechsel (DHCP)** – IP wechselte .70 → .100. Agent-IP in DB aktualisiert; Monitor zeigt immer aktuelle IP
- **Duplikat-Tickets** – asello-Fehlkonfiguration schickte Bon an beide Pis. Fix: Worker ignoriert Duplikate (gleiche ticket_number + station_id)
- **Config-Änderungen nicht sofort wirksam** – UI speicherte in stationsspezifischen Key, Pi las globalen Key. Jetzt konsistent
- **ws-Package Delay** – WebSocket-Package wurde beim ersten Start auto-installiert (10s). Fix: ws jetzt fix in package.json

### ✨ Features
- **Pi-Offline-Anzeige** – Zahnrad blinkt rot + „OFFLINE" wenn Heartbeat >90s
- **Heartbeat alle 30s** – Pi meldet IP+Hostname; Header zeigt immer aktuelle Pi-IP
- **DB-Cleanup täglich** – 03:00 UTC: Tickets/Jobs/Items/Bon-Logs >24h werden gelöscht. Manuell: `POST /api/admin/cleanup`
- **WebSocket Push** – Pi hält WS-Verbindung zum Worker. Druckauftrag wird sofort gepusht (~50ms)
- **Self-Update package.json** – Self-Update prüft auch package.json und führt `npm install` bei neuen Packages aus
- **Stationen umbenannt** – Schankmonitor (#1), Küchenmonitor (#2), To Go (#3)

### ⚡ Performance
- **Poll-Intervall 3s → 1s** – Max. Druckverzögerung halbiert
- **Config-Reload 5s → 30s** – 6x weniger Worker-Requests pro Minute
- **WebSocket Push** – Direktdruck ~50ms statt bis zu 1s

---

## v1.0.0 – 2026-04-12 (Initiales Release)

- Cloudflare Worker mit D1, R2, Durable Objects (WebSocket-Echtzeit)
- Raspberry Pi Print-Agent: ePOS-Proxy, ESC/POS-Parser, Job-Poller
- Custom Domains: monitor1.team24.training, monitor2.team24.training
- Auto-Deploy GitHub → Cloudflare Build
- Self-Update: Pi holt Code alle 5 Min von GitHub
- Bon-Log, virtuelle Bon-Vorschau, Verlauf-Tab mit Filtern
- Bonierbon-Parser (asello ePOS XML), Backup-Drucker + Auto-Discovery

---

## System-Übersicht

### Infrastruktur
| Komponente | Wert |
|---|---|
| Cloudflare Worker | kds-cloudflare |
| Custom Domains | monitor1.team24.training, monitor2.team24.training |
| D1 Datenbank | kds-db (b76c3d0e-43ec-42cb-9a63-bd3d68c92b15) |
| R2 Storage | kds-storage |
| Account-ID | f1c8788eb10870b12ac498a71b81d1f3 |
| API-Key | kds-smarte-events-2026 |
| GitHub Repo | BerndPauli16/kds-cloudflare |

### Raspberry Pis
| | monitor1 | monitor2 |
|---|---|---|
| Name | Schankmonitor | Küchenmonitor |
| Hostname | schankmonitor | monitor2 |
| User / PW | schankmonitor / So01012022 | monitor2 / So01012022 |
| Station-ID | 1 | 2 |
| Drucker-IP | 192.168.192.136 | 192.168.192.127 |
| Proxy-Port | 8009 (Port 80 via nftables) | 8009 (Port 80 via nftables) |
| Tunnel | kds-printer-tunnel (http2) | kds-monitor2-tunnel |
| IP | DHCP – im Monitor ablesen | 192.168.192.232 (DHCP) |

### Nächste Schritte (offen)
- [ ] Auto-Print – Bon automatisch drucken ohne manuellen Klick
- [ ] Stale-Jobs – Pending-Jobs >10min automatisch zurücksetzen
