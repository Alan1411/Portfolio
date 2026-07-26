"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(r.ok ? "sent" : "error");
      if (r.ok) setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="c3d-contact">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <form className="c3d-form" onSubmit={submit}>
          <div className="c3d-form-row">
            <div className="c3d-field">
              <label>Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="c3d-field">
              <label>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
              />
            </div>
          </div>
          <div className="c3d-field">
            <label>Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell me about your project..."
            />
          </div>
          <button type="submit" className="c3d-submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : status === "sent" ? "✓ Sent!" : "Send Message"}
          </button>
          {status === "error" && <p className="c3d-error">Something went wrong. Try again.</p>}
        </form>
      </motion.div>

      <motion.div
        className="c3d-contact-links"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <a href="mailto:info@chicoweb.de" className="c3d-contact-card">
          <span>✉</span> <span>Email</span>
        </a>
        <a href="https://github.com/Alan1411" target="_blank" rel="noopener" className="c3d-contact-card">
          <span>⚙</span> <span>GitHub</span>
        </a>
      </motion.div>
    </div>
  );
}
