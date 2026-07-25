import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("financial_goals").select("*");

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const { period, target_amount } = await request.json();

    if (!["monthly", "yearly"].includes(period) || !target_amount) {
      return NextResponse.json({ error: "Invalid period or amount" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("financial_goals")
      .upsert(
        { period, target_amount: Number(target_amount), updated_at: new Date().toISOString() },
        { onConflict: "period" }
      )
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
