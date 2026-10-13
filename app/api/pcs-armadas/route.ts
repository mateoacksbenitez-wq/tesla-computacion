import { NextRequest, NextResponse } from "next/server";
import { getAllPcsArmadas } from "@/lib/db";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (isRateLimited(`pcs-armadas:${ip}`, { windowMs: 60_000, max: 200 })) {
    return NextResponse.json(
      { error: "Demasiadas peticiones." },
      { status: 429 }
    );
  }
  try {
    const pcs = await getAllPcsArmadas();
    return NextResponse.json(pcs);
  } catch {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}
