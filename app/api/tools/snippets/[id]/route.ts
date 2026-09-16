import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

// PUT - Snippet bearbeiten
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, language, code, tags } = await request.json();

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("snippets")
      .update({
        title: title ? String(title).substring(0, 200) : undefined,
        language: language ? String(language).substring(0, 30) : undefined,
        code: code ? String(code).substring(0, 20000) : undefined,
        tags: Array.isArray(tags) ? tags.slice(0, 20).map((t) => String(t).substring(0, 40)) : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Snippet löschen
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    const { error } = await supabase.from("snippets").delete().eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
