import { NextRequest, NextResponse } from "next/server";
import { insertBannerMensaje, getAllBannerMensajes } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function sanitize(v: unknown) {
  return typeof v === "string" ? v.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim() : v;
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const texto = sanitize(body.texto) as string;
  if (!texto) {
    return NextResponse.json({ error: "El texto no puede estar vacío" }, { status: 400 });
  }

  try {
    const existentes = await getAllBannerMensajes();
    const orden = existentes.length > 0 ? Math.max(...existentes.map((m) => m.orden)) + 1 : 0;
    await insertBannerMensaje({ id: `banner-${Date.now()}`, texto, orden });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
