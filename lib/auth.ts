import { cookies } from "next/headers";
// @ts-ignore - plain CommonJS module
import { verifySessionToken, SESSION_COOKIE } from "@/src/utils/session";

export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  return {
    id: payload.sub as string,
    email: payload.email as string,
    role: payload.role as string,
  };
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) return { ok: false as const, status: 401, error: "Not authenticated" };
  if (user.role !== "admin") return { ok: false as const, status: 403, error: "Forbidden" };

  return { ok: true as const, user };
}
