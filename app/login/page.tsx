import type { Metadata } from "next";
import Link from "next/link";
import { login } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Login — Alan1411",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registered?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="auth-page">
      <form action={login} className="auth-form">
        <h1>Login</h1>
        {params.registered && (
          <p className="auth-success">Account created. Please log in.</p>
        )}
        {params.error && <p className="auth-error">{params.error}</p>}
        <input type="hidden" name="next" value={params.next || "/"} />
        <label>
          Email
          <input type="email" name="email" required placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" name="password" required placeholder="••••••••" />
        </label>
        <button type="submit" className="btn btn-primary">
          Log In
        </button>
        <p className="auth-switch">
          No account? <Link href="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}
