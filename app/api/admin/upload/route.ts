import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "misc";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WEBP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const supabase = getSupabase();
    const ext = file.name.split(".").pop() || "bin";
    const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "");
    const path = `${safeFolder}/${crypto.randomUUID()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("portfolio-media")
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrl } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(path);

    return NextResponse.json({ url: publicUrl.publicUrl, path });
  } catch (err: any) {
    console.error("[UPLOAD] error:", err.message);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
