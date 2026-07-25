import { NextResponse } from "next/server";
// @ts-ignore - plain CommonJS module
import { registerUser } from "@/src/controllers/authController";

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();
    const user = await registerUser({ email, password, fullName });

    return NextResponse.json(
      { success: true, message: "Verification code sent to your email", user },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
