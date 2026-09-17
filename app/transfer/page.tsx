import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FileTransferUploader } from "@/components/transfer/FileTransferUploader";
import { MAX_UPLOAD_BYTES, formatBytes } from "@/lib/transfer";

export const metadata: Metadata = {
  title: "File Transfer — ChicoCode",
  description:
    "Dateien schnell und ohne Anmeldung teilen: hochladen, Link kopieren, fertig. Links laufen automatisch ab.",
};

export default function TransferPage() {
  return (
    <>
      <Hero
        badge="File Transfer"
        title="Dateien teilen"
        subtitle={`Datei hochladen, Link kopieren, fertig — ohne Anmeldung und ohne Passwort. Bis zu ${formatBytes(
          MAX_UPLOAD_BYTES
        )} pro Datei, der Link läuft automatisch ab.`}
      />

      <section className="transfer-body">
        <FileTransferUploader />

        <ul className="transfer-facts">
          <li>
            <strong>Kein Account nötig</strong>
            <span>Hochladen, Link teilen. Keine Registrierung, keine E-Mail-Adresse.</span>
          </li>
          <li>
            <strong>Läuft von selbst ab</strong>
            <span>Nach Ablauf wird die Datei automatisch vom Server gelöscht.</span>
          </li>
          <li>
            <strong>Nicht erratbare Links</strong>
            <span>Jeder Upload bekommt eine zufällige Adresse — geteilt wird nur, was du weitergibst.</span>
          </li>
        </ul>

        <p className="transfer-note muted">
          Hinweis: Wer den Link hat, kann die Datei herunterladen. Für wirklich
          Vertrauliches vorher verschlüsseln — z.B. mit den{" "}
          <a href="/tools" className="transfer-inline-link">
            Crypto-Tools
          </a>
          .
        </p>
      </section>
    </>
  );
}
