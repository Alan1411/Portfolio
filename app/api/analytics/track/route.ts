import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { page, referrer, visitorId } = await request.json();

    if (!page || !visitorId) {
      return NextResponse.json({ error: "page and visitorId required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const userAgent = request.headers.get("user-agent") || "";

    // Hash the IP for privacy (we don't store raw IPs)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0] || "unknown";

    // Simple country detection from Accept-Language or fallback
    const acceptLang = request.headers.get("accept-language") || "";

    const { error } = await supabase.from("analytics").insert({
      page,
      referrer: referrer || null,
      visitor_id: visitorId,
      user_agent: userAgent.substring(0, 500),
      country: acceptLang.substring(0, 10),
    });

    if (error) {
      console.error("[ANALYTICS] insert failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[ANALYTICS] track error:", err.message);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
