import Link from "next/link";
import {
  ArrowRight,
  Check,
  Droplet,
  Shield,
  Sparkles,
  Car,
  Wind,
  Palette,
} from "lucide-react";

const SERVICES = [
  {
    icon: Car,
    title: "Innenreinigung",
    desc: "Tiefenreinigung von Polstern, Teppichen, Armaturenbrett und allen Oberflächen. Ihr Innenraum erstrahlt wie neu – geruchsfrei und hygienisch.",
    points: [
      "Polster- & Teppichreinigung",
      "Armaturen & Verkleidungen",
      "Fleckenentfernung",
      "Geruchsbeseitigung",
    ],
    price: "ab 89€",
  },
  {
    icon: Sparkles,
    title: "Lackveredelung & Keramikversiegelung",
    desc: "Professionelle Politur und Keramikversiegelung für dauerhaften Glanz und Schutz vor Umwelteinflüssen, UV-Strahlung und Schmutz.",
    points: [
      "Maschinelle Politur",
      "Keramikversiegelung",
      "Schutz bis zu 5 Jahren",
      "Wasserabweisende Schicht",
    ],
    price: "ab 349€",
  },
  {
    icon: Shield,
    title: "Leasing-Aufbereitung",
    desc: "Fahrzeug vor Rückgabe optimal aufbereiten – Kratzer, Flecken und Gebrauchsspuren professionell beseitigen. Vermeiden Sie teure Nachzahlungen.",
    points: [
      "Lackaufbereitung",
      "Innenraumreinigung",
      "Reifenaufbereitung",
      "Rückgabe-Checkliste",
    ],
    price: "ab 199€",
  },
  {
    icon: Droplet,
    title: "Felgenaufbereitung",
    desc: "Gründliche Reinigung und Versiegelung der Felgen für langanhaltenden Glanz und Schutz vor Bremsstaub.",
    points: [
      "Tiefenreinigung",
      "Felgenschutz",
      "Bremsstaub-Entfernung",
      "Glanzlack-Versiegelung",
    ],
    price: "ab 49€",
  },
  {
    icon: Wind,
    title: "Scheibenaufbereitung",
    desc: "Wasserabweisende Beschichtung der Windschutzscheibe für bessere Sicht und einfachere Reinigung.",
    points: [
      "Glaspolitur",
      "Wasserabweisung",
      "Sichtverbesserung",
      "Lotus-Effekt",
    ],
    price: "ab 39€",
  },
  {
    icon: Palette,
    title: "Politur & Farbauffrischung",
    desc: "Entfernung von Kratzern, Swirls und Oxidation. Der Lack erhält seine ursprüngliche Tiefe und Brillianz zurück.",
    points: [
      "Kratzerentfernung",
      "Swirl-Free Finish",
      "Farbvertiefung",
      "Hochglanz-Finish",
    ],
    price: "ab 149€",
  },
];

export default function LeistungenPage() {
  return (
    <div>
      {/* HEADER */}
      <section className="pt-20 md:pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div
            className="w-12 h-0.5 mb-5"
            style={{ background: "linear-gradient(90deg, #c0392b, #e74c3c)" }}
          />
          <h1
            className="font-black text-white mb-4"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Unsere <span style={{ color: "#e74c3c" }}>Leistungen</span>.
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl"
            style={{ color: "rgba(255,255,255,0.5)", fontWeight: 300 }}
          >
            Vom Innenraum bis zur Lackversiegelung – wir bieten Ihnen das
            komplette Spektrum der professionellen Fahrzeugaufbereitung. Über 500
            Fahrzeuge sprechen für sich.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl p-7 md:p-8 flex flex-col gap-5 transition-all duration-300 group"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(192,57,43,0.3)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.025)";
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(192,57,43,0.12)",
                      border: "1px solid rgba(192,57,43,0.25)",
                    }}
                  >
                    <s.icon size={22} style={{ color: "#e74c3c" }} />
                  </div>
                  <span
                    className="text-lg font-black"
                    style={{ color: "#e74c3c" }}
                  >
                    {s.price}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-white mb-2">
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {s.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {s.points.map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(192,57,43,0.15)" }}
                      >
                        <Check size={12} style={{ color: "#e74c3c" }} />
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {p}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/prowash/kontakt"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold mt-2 transition-all hover:gap-2.5"
                  style={{ color: "#e74c3c" }}
                >
                  Anfragen <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(192,57,43,0.12) 0%, rgba(8,10,12,0.6) 100%)",
              border: "1px solid rgba(192,57,43,0.2)",
            }}
          >
            <h2
              className="font-black text-white mb-4"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Unsicher, was Ihr Auto braucht?
            </h2>
            <p
              className="text-sm md:text-base mb-8 max-w-md mx-auto"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Rufen Sie uns an – wir beraten Sie kostenlos und finden die
              passende Lösung.
            </p>
            <Link
              href="/prowash/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
              }}
            >
              Beratung anfragen <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
