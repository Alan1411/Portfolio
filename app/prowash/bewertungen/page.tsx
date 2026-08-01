import Link from "next/link";
import { Star, Quote, ArrowRight } from "lucide-react";

const REVIEWS = [
  {
    name: "Iris M.",
    rating: 5,
    text: "Absolut top! Mein Auto sieht aus wie frisch vom Händler. Die Keramikversiegelung ist unglaublich – Wasser perlt einfach ab. Sehr professionell und freundlich. Klare Empfehlung!",
    date: "vor 2 Wochen",
    service: "Keramikversiegelung",
  },
  {
    name: "Jens Engelmann",
    rating: 5,
    text: "Prowash hat meinen Leasing-Rückläufer perfekt aufbereitet. Kratzer weg, Innenraum makellos – die Rückgabe lief problemlos. Sehr faire Preise für die Qualität. Danke!",
    date: "vor 1 Monat",
    service: "Leasing-Aufbereitung",
  },
  {
    name: "Onur Gündüz",
    rating: 5,
    text: "Ich bin begeistert! Der Service ist erstklassig, das Ergebnis spricht für sich. Mein schwarzes Fahrzeug glänzt wie ein Spiegel. Werde definitiv wiederkommen!",
    date: "vor 3 Wochen",
    service: "Lackveredelung",
  },
  {
    name: "Marco T.",
    rating: 5,
    text: "Schnell, sauber und super Ergebnis. Die Innenreinigung hat alle Flecken aus dem Stoff entfernt – sieht wirklich aus wie neu. Preis-Leistung top!",
    date: "vor 1 Woche",
    service: "Innenreinigung",
  },
  {
    name: "Sandra K.",
    rating: 5,
    text: "Sehr netter Kontakt, termingerechte Abwicklung. Die Felgen sehen besser aus als beim Neukauf. Bin rundum zufrieden und empfehle Prowash gerne weiter.",
    date: "vor 2 Monaten",
    service: "Felgenaufbereitung",
  },
  {
    name: "Tobias R.",
    rating: 5,
    text: "Die Politur hat alle Swirls und Kratzer entfernt. Der Lack glänzt wie neu. Man merkt, dass hier jemand mit Leidenschaft und Erfahrung arbeitet.",
    date: "vor 5 Wochen",
    service: "Politur & Farbauffrischung",
  },
];

export default function BewertungenPage() {
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
            <span style={{ color: "#e74c3c" }}>Bewertungen</span> unserer
            Kunden.
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl"
            style={{ color: "rgba(255,255,255,0.5)", fontWeight: 300 }}
          >
            Über 25 zufriedene Kunden haben uns auf Google bewertet – mit dem
            perfekten Ergebnis.
          </p>

          <div
            className="mt-10 inline-flex items-center gap-6 rounded-2xl px-8 py-6"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div>
              <p
                className="font-black text-white"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  lineHeight: 1,
                  color: "#e74c3c",
                }}
              >
                5,0
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="#e74c3c" stroke="none" />
                ))}
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                aus 25+ Google-Bewertungen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS GRID */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300"
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
                <div className="flex items-center justify-between">
                  <Quote
                    size={28}
                    style={{ color: "rgba(192,57,43,0.4)" }}
                    fill="rgba(192,57,43,0.4)"
                  />
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#e74c3c" stroke="none" />
                    ))}
                  </div>
                </div>

                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {r.text}
                </p>

                <div
                  className="flex items-center gap-3 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: "rgba(192,57,43,0.18)",
                      color: "#e74c3c",
                    }}
                  >
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{r.name}</p>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {r.date}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(192,57,43,0.12)",
                      color: "#e74c3c",
                    }}
                  >
                    {r.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <h2
            className="font-black text-white mb-4"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
          >
            Werden Sie unser nächster zufriedener Kunde.
          </h2>
          <p
            className="text-sm md:text-base mb-8 max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Vereinbaren Sie jetzt Ihren Termin.
          </p>
          <Link
            href="/prowash/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
            }}
          >
            Termin anfragen <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
