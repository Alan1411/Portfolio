import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

// GET ?tool=<name> - aggregierte Daumen-hoch/runter-Anzahl für ein Tool
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const toolName = url.searchParams.get("tool");
    if (!toolName) {
      return NextResponse.json({ error: "tool required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("tool_feedback")
      .select("rating")
      .eq("tool_name", toolName);

    if (error) throw new Error(error.message);

    const up = (data || []).filter((r) => r.rating === 1).length;
    const down = (data || []).filter((r) => r.rating === -1).length;

    return NextResponse.json({ up, down });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST { toolName, rating: 1 | -1 } - Feedback für ein Tool speichern
export async function POST(request: Request) {
  try {
    const { toolName, rating } = await request.json();

    if (!toolName || typeof toolName !== "string") {
      return NextResponse.json({ error: "toolName required" }, { status: 400 });
    }
    if (rating !== 1 && rating !== -1) {
      return NextResponse.json({ error: "rating must be 1 or -1" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("tool_feedback")
      .insert({ tool_name: toolName.substring(0, 100), rating });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
