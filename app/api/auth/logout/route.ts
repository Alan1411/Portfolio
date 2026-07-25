import { NextResponse } from "next/server";
// @ts-ignore - plain CommonJS module
import { SESSION_COOKIE } from "@/src/utils/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
