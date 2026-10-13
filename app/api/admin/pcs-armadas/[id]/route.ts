import { NextRequest, NextResponse } from "next/server";
import { updatePcArmada, deletePcArmada } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { mirrorImageIfExternal } from "@/lib/mirror-image";

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

  const fields: Record<string, unknown> = {};
  for (const key of ["nombre", "componentes"] as const) {
    if (body[key] !== undefined) fields[key] = sanitize(body[key]);
  }
  if (body.imagen !== undefined) {
    fields.imagen = await mirrorImageIfExternal(sanitize(body.imagen) as string);
  }
  if (body.stock !== undefined) fields.stock = Number(body.stock);
  if (body.precio !== undefined) fields.precio = Number(body.precio);
  if (body.destacado !== undefined) {
    fields.destacado = body.destacado === true || body.destacado === "true";
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ok = await updatePcArmada(id, fields as any);
    if (!ok) return NextResponse.json({ error: "PC no encontrada" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const ok = await deletePcArmada(id);
  return NextResponse.json({ success: ok });
}
