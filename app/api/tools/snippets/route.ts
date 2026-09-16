import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

// GET - alle Snippets auflisten
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("snippets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - neues Snippet anlegen
export async function POST(request: Request) {
  try {
    const { title, language, code, tags } = await request.json();

    if (!title || !code) {
      return NextResponse.json({ error: "title und code sind erforderlich" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("snippets")
      .insert({
        title: String(title).substring(0, 200),
        language: language ? String(language).substring(0, 30) : "bash",
        code: String(code).substring(0, 20000),
        tags: Array.isArray(tags) ? tags.slice(0, 20).map((t) => String(t).substring(0, 40)) : [],
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
