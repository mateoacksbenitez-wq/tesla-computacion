import { NextRequest, NextResponse } from "next/server";
import { quickUpdatePcArmadaStock } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id, stock } = await req.json();
  const ok = await quickUpdatePcArmadaStock(id, Number(stock) || 0);
  return NextResponse.json({ success: ok });
}
