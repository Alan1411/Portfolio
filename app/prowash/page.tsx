import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const VIDEO_SRC =
  "https://videos.pexels.com/video-files/6873503/6873503-uhd_1440_2560_25fps.mp4";
const POSTER =
  "https://images.pexels.com/photos/6872152/pexels-photo-6872152.jpeg?auto=compress&cs=tinysrgb&w=1600";

export default function ProwashHome() {
  return (
    <div>
      {/* HERO — video background */}
      <section className="relative h-screen min-h-[640px] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={POSTER}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{ background: "rgba(8,10,12,0.6)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,10,12,0.92) 0%, rgba(8,10,12,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 25% 50%, rgba(192,57,43,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <div className="max-w-2xl flex flex-col gap-7">
              <h1
                className="font-black leading-[1.05] text-white"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                Wir machen <span style={{ color: "#e74c3c" }}>Autos</span>
                <br />
                wieder sichtbar.
              </h1>

              <p
                className="text-base md:text-lg leading-relaxed max-w-lg"
                style={{ color: "rgba(255,255,255,0.7)", fontWeight: 300 }}
              >
                Professionelle Fahrzeugaufbereitung, Keramikversiegelung und
                Leasing-Rückläufer aus Osnabrück – für Fahrzeuge, die auffallen
                wollen.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/prowash/leistungen"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:brightness-110 hover:shadow-2xl active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
                  }}
                >
                  Leistungen ansehen <ArrowRight size={16} />
                </Link>
                <Link
                  href="/prowash/kontakt"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:bg-white hover:text-black active:scale-95"
                  style={{ border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  Kontakt aufnehmen
                </Link>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#e74c3c" stroke="none" />
                  ))}
                </div>
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  5,0 / 5,0 auf Google · 25+ Bewertungen
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
          <div className="w-5 h-9 rounded-full border-2 border-white/20 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </section>

      {/* INTRO / USP STRIP */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {[
              {
                num: "500+",
                label: "Fahrzeuge aufbereitet",
                sub: "mit nachweisbarer Qualität",
              },
              {
                num: "5,0★",
                label: "Google-Bewertung",
                sub: "aus 25+ echten Bewertungen",
              },
              {
                num: "100%",
                label: "Zufriedenheits-Garantie",
                sub: "oder wir machen es nochmal",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p
                  className="font-black mb-2"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    color: "#e74c3c",
                    lineHeight: 1,
                  }}
                >
                  {stat.num}
                </p>
                <p className="text-white font-semibold text-sm md:text-base mb-1">
                  {stat.label}
                </p>
                <p
                  className="text-xs md:text-sm"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section
        className="py-20 md:py-28"
        style={{ background: "rgba(255,255,255,0.015)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div
                className="w-12 h-0.5 mb-5"
                style={{
                  background: "linear-gradient(90deg, #c0392b, #e74c3c)",
                }}
              />
              <h2
                className="font-black text-white"
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Unsere Leistungen.
              </h2>
              <p
                className="mt-3 max-w-md text-sm md:text-base"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Vom Innenraum bis zur Lackversiegelung – alles aus einer Hand.
              </p>
            </div>
            <Link
              href="/prowash/leistungen"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
              style={{ color: "#e74c3c" }}
            >
              Alle ansehen <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.pexels.com/photos/6872164/pexels-photo-6872164.jpeg?auto=compress&cs=tinysrgb&w=800",
                title: "Innenreinigung",
                desc: "Tiefenreinigung aller Oberflächen und Polster.",
              },
              {
                img: "https://images.pexels.com/photos/14231701/pexels-photo-14231701.jpeg?auto=compress&cs=tinysrgb&w=800",
                title: "Lackveredelung & Keramik",
                desc: "Politur und dauerhafter Schutz für tiefen Glanz.",
              },
              {
                img: "https://images.pexels.com/photos/6873129/pexels-photo-6873129.jpeg?auto=compress&cs=tinysrgb&w=800",
                title: "Leasing-Aufbereitung",
                desc: "Optimal vorbereitet für die Rückgabe.",
              },
            ].map((s) => (
              <Link
                key={s.title}
                href="/prowash/leistungen"
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <img
                  src={s.img}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(8,10,12,0.95) 0%, rgba(8,10,12,0.3) 50%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-bold text-lg text-white mb-1">
                    {s.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem" }}>
                    {s.desc}
                  </p>
                  <div
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold transition-all group-hover:gap-2.5"
                    style={{ color: "#e74c3c" }}
                  >
                    Mehr <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(192,57,43,0.12) 0%, rgba(8,10,12,0.6) 100%)",
              border: "1px solid rgba(192,57,43,0.2)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(192,57,43,0.18) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <h2
                className="font-black text-white mb-4"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                Bereit, Ihr Fahrzeug aufzuladen?
              </h2>
              <p
                className="text-sm md:text-base mb-8 max-w-md mx-auto"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Vereinbaren Sie jetzt einen Termin – kostenlos & unverbindlich.
              </p>
              <Link
                href="/prowash/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:brightness-110 hover:shadow-2xl active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
                }}
              >
                Termin anfragen <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
