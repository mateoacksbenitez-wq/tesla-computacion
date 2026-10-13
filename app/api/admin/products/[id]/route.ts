import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct } from "@/lib/db";
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
  for (const key of ["nombre", "specs", "categoria"] as const) {
    if (body[key] !== undefined) fields[key] = sanitize(body[key]);
  }
  if (body.imagen !== undefined) {
    fields.imagen = await mirrorImageIfExternal(sanitize(body.imagen) as string);
  }
  if (body.stock !== undefined) fields.stock = Number(body.stock);
  if (body.gama !== undefined) fields.gama = body.gama;
  if (body.fuente_minima !== undefined) fields.fuente_minima = Number(body.fuente_minima);
  if (body.precio_estimado !== undefined) fields.precio_estimado = Number(body.precio_estimado);
  if (body.has_igpu !== undefined) {
    fields.has_igpu =
      body.has_igpu === true || body.has_igpu === "true" || body.has_igpu === 1 ? 1 : 0;
  }
  if (body.destacado !== undefined) {
    fields.destacado = body.destacado === true || body.destacado === "true";
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ok = await updateProduct(id, fields as any);
    if (!ok) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
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
  const ok = await deleteProduct(id);
  return NextResponse.json({ success: ok });
}
