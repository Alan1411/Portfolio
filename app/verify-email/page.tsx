"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSuccess("Email verified! Redirecting to login...");
      setTimeout(() => router.push("/login?registered=1"), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/verify-email/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("A new code has been sent to your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1>Verify your email</h1>
      <p className="auth-switch">
        Enter the 6-digit code we sent to your email. It expires in 15 minutes.
      </p>
      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </label>
      <label>
        Verification Code
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={6}
          pattern="[0-9]{6}"
          placeholder="000000"
          style={{ fontSize: "1.5rem", letterSpacing: "0.5rem", textAlign: "center" }}
        />
      </label>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Verifying..." : "Verify Email"}
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleResend}
        disabled={resending || !email}
      >
        {resending ? "Sending..." : "Resend Code"}
      </button>
    </form>
  );
}

export default function VerifyEmailPage() {
  return (
    <section className="auth-page">
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </section>
  );
}
