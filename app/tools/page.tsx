import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools/registry";
import { ToolSearch } from "@/components/tools/ToolSearch";

export const metadata: Metadata = {
  title: "IT-Tools — ChicoCode",
  description: "Sammlung von IT-Tools: Crypto, Netzwerk, Passwörter, Zertifikate, Testdaten und mehr — alles clientseitig.",
};

export default function ToolsOverview() {
  return (
    <>
      <section className="hero">
        <p className="badge">IT-Toolbox</p>
        <h1>Tools</h1>
        <p className="subtitle">
          {TOOLS.length} kostenlose IT-Tools – alle Berechnungen laufen direkt im Browser, es werden
          keine sensiblen Daten an einen Server geschickt.
        </p>
      </section>

      <ToolSearch tools={TOOLS} />
    </>
  );
}
