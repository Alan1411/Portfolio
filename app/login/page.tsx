"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered");
  const next = searchParams.get("next") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push(next);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1>Login</h1>
      {registered && <p className="auth-success">Account created. Please log in.</p>}
      {error && <p className="auth-error">{error}</p>}
      <label>
        Email
        <input type="email" name="email" required placeholder="you@example.com" />
      </label>
      <label>
        Password
        <input type="password" name="password" required placeholder="••••••••" />
      </label>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </button>
      <p className="auth-switch">
        No account? <Link href="/register">Register</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <section className="auth-page">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
