import { NextResponse } from "next/server";
// @ts-ignore - plain CommonJS module
import { loginUser } from "@/src/controllers/authController";
// @ts-ignore - plain CommonJS module
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/src/utils/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await loginUser({ email, password });
    const token = await createSessionToken(user);

    const response = NextResponse.json({ success: true, user });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
