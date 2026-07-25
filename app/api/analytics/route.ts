import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();
    const url = new URL(request.url);
    const range = url.searchParams.get("range") || "30d";

    // Calculate date range
    const now = new Date();
    const daysAgo = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Fetch all analytics in range
    const { data: rows, error } = await supabase
      .from("analytics")
      .select("page, visitor_id, referrer, created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const all = rows || [];

    // Total page views
    const totalViews = all.length;

    // Unique visitors
    const uniqueVisitors = new Set(all.map((r) => r.visitor_id)).size;

    // Views per day
    const viewsByDay: Record<string, number> = {};
    all.forEach((r) => {
      const day = new Date(r.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    });

    // Top pages
    const pageCounts: Record<string, number> = {};
    all.forEach((r) => {
      pageCounts[r.page] = (pageCounts[r.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Top referrers
    const referrerCounts: Record<string, number> = {};
    all.forEach((r) => {
      const ref = r.referrer || "Direct";
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Bounce rate approximation (single-page visitors)
    const visitsPerPage: Record<string, Set<string>> = {};
    all.forEach((r) => {
      if (!visitsPerPage[r.page]) visitsPerPage[r.page] = new Set();
      visitsPerPage[r.page].add(r.visitor_id);
    });

    // Peak hours
    const hourCounts: Record<number, number> = {};
    all.forEach((r) => {
      const hour = new Date(r.created_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hourCounts[i] || 0,
    }));

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      viewsByDay: Object.entries(viewsByDay).map(([date, count]) => ({
        date,
        count,
      })),
      topPages,
      topReferrers,
      hourlyActivity,
    });
  } catch (err: any) {
    console.error("[ANALYTICS] GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
