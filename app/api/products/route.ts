import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (isRateLimited(`products:${ip}`, { windowMs: 60_000, max: 200 })) {
    return NextResponse.json(
      { error: "Demasiadas peticiones." },
      { status: 429 }
    );
  }
  try {
    const productos = await getAllProducts();
    return NextResponse.json(productos);
  } catch {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}
