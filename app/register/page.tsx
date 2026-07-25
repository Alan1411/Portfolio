import type { Metadata } from "next";
import Link from "next/link";
import { signup } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Register — Alan1411",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="auth-page">
      <form action={signup} className="auth-form">
        <h1>Create Account</h1>
        {params.error && <p className="auth-error">{params.error}</p>}
        <label>
          Full Name
          <input type="text" name="full_name" required placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" name="email" required placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" name="password" required minLength={6} placeholder="••••••••" />
        </label>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}
