import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateSlug(length = 6) {
  const bytes = crypto.randomBytes(length);
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return slug;
}

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

// GET - list all short links
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("short_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - create a new short link
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, slug } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const supabase = getSupabase();

    // Custom slug (normalized) or auto-generated
    let finalSlug =
      slug
        ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
        : generateSlug();

    if (!finalSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    // Auto-generate on collision (custom slugs error out)
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data, error } = await supabase
        .from("short_links")
        .insert({ slug: finalSlug, url: normalizedUrl })
        .select("*")
        .single();

      if (!error) {
        const shortUrl = `https://chicoweb.de/r/${finalSlug}`;
        return NextResponse.json({ ...data, shortUrl }, { status: 201 });
      }

      if (slug) {
        return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
      }

      finalSlug = generateSlug();
    }

    return NextResponse.json({ error: "Could not generate unique slug" }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}