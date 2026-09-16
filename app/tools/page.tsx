import type { Metadata } from "next";
import { TOOLS } from "@/lib/tools/registry";
import { ToolSearch } from "@/components/tools/ToolSearch";
import { Hero } from "@/components/Hero";

export const metadata: Metadata = {
  title: "IT-Tools — ChicoCode",
  description: "Sammlung von IT-Tools: Crypto, Netzwerk, Passwörter, Zertifikate, Testdaten und mehr — alles clientseitig.",
};

export default function ToolsOverview() {
  return (
    <>
      <Hero
        badge="IT-Toolbox"
        title="Tools"
        subtitle={`${TOOLS.length} kostenlose IT-Tools – alle Berechnungen laufen direkt im Browser, es werden keine sensiblen Daten an einen Server geschickt.`}
      />

      <ToolSearch tools={TOOLS} />
    </>
  );
}
