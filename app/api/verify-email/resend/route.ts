import { NextResponse } from "next/server";
// @ts-ignore - plain CommonJS module
import { handleResendCode } from "@/src/routes/verification";

export async function POST(request: Request) {
  const body = await request.json();
  const { status, body: responseBody } = await handleResendCode(body);
  return NextResponse.json(responseBody, { status });
}
