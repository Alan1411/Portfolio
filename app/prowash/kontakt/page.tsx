"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";

export default function KontaktPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactItems = [
    {
      icon: Phone,
      label: "Telefon",
      value: "01573 8637912",
      href: "tel:+4915738637912",
    },
    {
      icon: Mail,
      label: "E-Mail",
      value: "info@prowash-osnabrueck.de",
      href: "mailto:info@prowash-osnabrueck.de",
    },
    {
      icon: MapPin,
      label: "Adresse",
      value: "Osnabrück, Niedersachsen",
      href: "https://maps.google.com/?q=Osnabr%C3%BCck",
    },
    {
      icon: Clock,
      label: "Öffnungszeiten",
      value: "Mo–Sa: 09:00 – 18:00 Uhr",
      href: null,
    },
  ];

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
            <span style={{ color: "#e74c3c" }}>Kontakt</span> aufnehmen.
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl"
            style={{ color: "rgba(255,255,255,0.5)", fontWeight: 300 }}
          >
            Schreiben Sie uns oder rufen Sie direkt an – wir melden uns
            schnellstmöglich zurück.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT — Info + Map */}
            <div className="flex flex-col gap-5">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl p-5 flex items-center gap-5"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(192,57,43,0.12)",
                      border: "1px solid rgba(192,57,43,0.25)",
                    }}
                  >
                    <item.icon size={22} style={{ color: "#e74c3c" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm font-medium text-white hover:underline"
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-white">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Map */}
              <div
                className="rounded-2xl overflow-hidden mt-2"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <iframe
                  title="Prowash Standort Osnabrück"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77374.64386157!2d7.9753059!3d52.2799131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bad74e8e8d8e53%3A0x426a4208bce3acda!2sOsnabr%C3%BCck!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde"
                  width="100%"
                  height="280"
                  style={{
                    border: 0,
                    filter:
                      "grayscale(60%) invert(90%) hue-rotate(180deg) brightness(0.75)",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* RIGHT — Form */}
            <div
              className="rounded-2xl p-7 md:p-8"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(192,57,43,0.15)",
                      border: "2px solid rgba(192,57,43,0.4)",
                    }}
                  >
                    <Check size={30} style={{ color: "#e74c3c" }} />
                  </div>
                  <h2 className="font-bold text-xl text-white">
                    Nachricht gesendet!
                  </h2>
                  <p
                    className="text-sm max-w-xs"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Vielen Dank für Ihre Anfrage. Wir melden uns
                    schnellstmöglich bei Ihnen.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        message: "",
                        service: "",
                      });
                    }}
                    className="text-sm font-semibold mt-2"
                    style={{ color: "#e74c3c" }}
                  >
                    Neue Nachricht senden
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="font-bold text-xl text-white mb-1">
                      Anfrage senden
                    </h2>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      Wir antworten in der Regel innerhalb von 24 Stunden.
                    </p>
                  </div>

                  {/* Service select */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Gewünschte Leistung
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <option value="" style={{ background: "#111416" }}>
                        Bitte wählen…
                      </option>
                      <option value="innen" style={{ background: "#111416" }}>
                        Innenreinigung
                      </option>
                      <option value="keramik" style={{ background: "#111416" }}>
                        Lackveredelung & Keramik
                      </option>
                      <option value="leasing" style={{ background: "#111416" }}>
                        Leasing-Aufbereitung
                      </option>
                      <option value="felgen" style={{ background: "#111416" }}>
                        Felgenaufbereitung
                      </option>
                      <option value="sonstiges" style={{ background: "#111416" }}>
                        Sonstiges
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-medium mb-2"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Ihr Name"
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-2"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="Ihre Telefonnummer"
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      E-Mail *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="ihre@email.de"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Nachricht *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Beschreiben Sie Ihr Anliegen…"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors resize-none"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:brightness-110 active:scale-95"
                    style={{
                      background:
                        "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
                    }}
                  >
                    <Send size={16} /> Nachricht senden
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
