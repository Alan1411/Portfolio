"use client";

import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error);

      setStatus(`Thanks, ${name}! Your message was sent.`);
      form.reset();
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero">
        <p className="badge">Reach Out</p>
        <h1>Contact</h1>
        <p className="subtitle">Have a question or want to work together?</p>
      </section>

      <section className="contact">
        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" required />
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows={4}
              placeholder="Say hello..."
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        {status && <p className="form-status">{status}</p>}
      </section>
    </>
  );
}
