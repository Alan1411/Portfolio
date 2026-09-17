#!/usr/bin/env bash
# Richtet den File-Transfer auf dem Server ein: Speicherverzeichnis, Secret,
# Cleanup-Cron. Idempotent — kann mehrfach laufen.
#
#   sudo bash scripts/setup-file-transfer.sh
#
# Was das Skript NICHT anfasst: die nginx-Konfiguration und die .env der App.
# Für beides gibt es am Ende einen Block zum Kopieren.

set -euo pipefail

APP_USER="${APP_USER:-chico}"
STORAGE_DIR="${TRANSFER_STORAGE_DIR:-/var/lib/chicoweb/transfers}"
SITE_URL="${SITE_URL:-https://chicoweb.de}"
SECRET_FILE="/etc/chicoweb-transfer.secret"

if [[ $EUID -ne 0 ]]; then
  echo "Bitte mit sudo starten." >&2
  exit 1
fi

if ! id "$APP_USER" >/dev/null 2>&1; then
  echo "Benutzer '$APP_USER' existiert nicht. APP_USER=<name> setzen." >&2
  exit 1
fi

echo "==> Speicherverzeichnis: $STORAGE_DIR"
mkdir -p "$STORAGE_DIR"
chown -R "$APP_USER":"$APP_USER" "$STORAGE_DIR"
chmod 700 "$STORAGE_DIR"

echo "==> CRON_SECRET"
if [[ -s "$SECRET_FILE" ]]; then
  echo "    bestehendes Secret aus $SECRET_FILE übernommen"
else
  openssl rand -hex 32 > "$SECRET_FILE"
  chmod 600 "$SECRET_FILE"
  echo "    neues Secret erzeugt"
fi
CRON_SECRET="$(cat "$SECRET_FILE")"

echo "==> Cleanup-Cron (alle 30 Minuten)"
CRON_LINE="*/30 * * * * root curl -fsS -H \"Authorization: Bearer \$(cat $SECRET_FILE)\" $SITE_URL/api/transfer/cleanup >/dev/null 2>&1"
printf '%s\n' "$CRON_LINE" > /etc/cron.d/chicoweb-transfer-cleanup
chmod 644 /etc/cron.d/chicoweb-transfer-cleanup

echo
echo "Fertig. Jetzt noch zwei Dinge von Hand:"
echo
echo "1) In die .env der App (danach App neu starten):"
echo "   TRANSFER_STORAGE_DIR=$STORAGE_DIR"
echo "   CRON_SECRET=$CRON_SECRET"
echo
echo "2) In den nginx-server-Block der Seite:"
cat <<'NGINX'
   client_max_body_size 16m;     # Häppchen sind 8 MB
   proxy_request_buffering off;  # direkt durchreichen statt zwischenpuffern
   proxy_read_timeout 300s;
   send_timeout 300s;
NGINX
echo "   danach: nginx -t && systemctl reload nginx"
echo
echo "3) Migration supabase/migrations/013_file_transfer.sql im Supabase SQL-Editor ausführen."
echo
echo "Test:"
echo "   curl -fsS -H \"Authorization: Bearer $CRON_SECRET\" $SITE_URL/api/transfer/cleanup"
echo "   -> {\"removed\":0}"
