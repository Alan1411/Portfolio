# File Transfer

Öffentlicher Datei-Upload ohne Login und ohne Passwort: Datei hochladen, Link
teilen, Datei löscht sich nach Ablauf selbst.

- Upload-Seite: `/transfer`
- Download-Link: `/t/<slug>`

## Wie es funktioniert

Der Browser meldet den Upload bei `POST /api/transfer` an und bekommt einen
zufälligen Slug plus ein Upload-Token zurück. Danach schickt er die Datei in
8-MB-Häppchen an `POST /api/transfer/<slug>/chunk` — jedes Häppchen wird
serverseitig an die Datei angehängt, der Server prüft dabei den Offset. Am Ende
markiert `POST /api/transfer/<slug>/complete` den Transfer als fertig und
übernimmt die tatsächliche Dateigröße von der Platte.

Dadurch bleibt jeder einzelne HTTP-Request klein — kein Request-Body-Limit und
kein Timeout wird zum Problem, egal wie groß die Datei ist.

Die Dateien liegen auf der Platte des Servers, in Supabase steht nur die
Metadatenzeile (`file_transfers`, Migration `013_file_transfer.sql`).

## Konfiguration

| Variable | Pflicht | Bedeutung |
| --- | --- | --- |
| `TRANSFER_STORAGE_DIR` | ja (praktisch) | Verzeichnis für die Dateien, z.B. `/var/lib/chicoweb/transfers`. Ohne die Variable landet alles in `<projekt>/.data/transfers` — das überlebt kein Deploy. |
| `CRON_SECRET` | ja | Schützt `/api/transfer/cleanup`. Ohne die Variable antwortet der Endpunkt mit 503. |

Verzeichnis anlegen (dem Nutzer gehörend, unter dem die App läuft):

```bash
sudo mkdir -p /var/lib/chicoweb/transfers
sudo chown -R chico:chico /var/lib/chicoweb/transfers
```

### nginx

Die Häppchen sind 8 MB groß, ein bisschen Luft schadet nicht:

```nginx
client_max_body_size 16m;
proxy_request_buffering off;   # Häppchen direkt durchreichen
proxy_read_timeout 300s;
send_timeout 300s;
```

### Aufräumen

Abgelaufene Transfers und abgebrochene Uploads (älter als 6 Stunden) räumt der
Cleanup-Endpunkt weg. Per Cron alle 30 Minuten aufrufen:

```cron
*/30 * * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://chicoweb.de/api/transfer/cleanup >/dev/null
```

Nebenbei wird auch beim Aufruf eines abgelaufenen Links direkt aufgeräumt.

## Grenzen anpassen

Alles in `lib/transfer.ts`:

- `MAX_UPLOAD_BYTES` — maximale Größe pro Datei (aktuell 10 GB)
- `CHUNK_SIZE` — Häppchengröße (aktuell 8 MB, muss zu `client_max_body_size` passen)
- `UPLOADS_PER_IP_PER_HOUR` — Rate-Limit pro IP (aktuell 20)
- `EXPIRY_OPTIONS` / `DOWNLOAD_LIMIT_OPTIONS` — Auswahl in der UI

## Missbrauchsschutz

Ohne Passwort ist der Upload für jeden offen. Dagegen stehen:

- Rate-Limit pro IP (IP wird nur als SHA-256-Hash gespeichert)
- Pflicht-Ablaufdatum (1 Stunde bis 30 Tage), danach wird die Datei gelöscht
- optionales Download-Limit (z.B. Einmal-Link)
- 10-stellige Zufalls-Slugs, Download-Seite auf `noindex`
- Auslieferung immer als `application/octet-stream` + `Content-Disposition:
  attachment` — die Seite lässt sich also nicht als Hoster für HTML/SVG unter
  der eigenen Domain missbrauchen
