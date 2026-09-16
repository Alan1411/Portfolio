import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Anonymes Tracking eines Tool-Aufrufs. Kein Personenbezug, nur Tool-Name + Zeitpunkt.
export async function POST(request: Request) {
  try {
    const { toolName } = await request.json();

    if (!toolName || typeof toolName !== "string") {
      return NextResponse.json({ error: "toolName required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { error } = await supabase
      .from("tool_usage")
      .insert({ tool_name: toolName.substring(0, 100) });

    if (error) {
      console.error("[TOOLS] track insert failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[TOOLS] track error:", err.message);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
