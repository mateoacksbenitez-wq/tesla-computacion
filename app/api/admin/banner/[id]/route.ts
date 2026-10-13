import { NextRequest, NextResponse } from "next/server";
import { updateBannerMensaje, deleteBannerMensaje } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function sanitize(v: unknown) {
  return typeof v === "string" ? v.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim() : v;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();

  const fields: { texto?: string; orden?: number } = {};
  if (body.texto !== undefined) {
    const texto = sanitize(body.texto) as string;
    if (!texto) {
      return NextResponse.json({ error: "El texto no puede estar vacío" }, { status: 400 });
    }
    fields.texto = texto;
  }
  if (body.orden !== undefined) {
    fields.orden = Number(body.orden) || 0;
  }

  const ok = await updateBannerMensaje(id, fields);
  if (!ok) return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const ok = await deleteBannerMensaje(id);
  return NextResponse.json({ success: ok });
}
