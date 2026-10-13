import { NextRequest, NextResponse } from "next/server";
import { insertProduct } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { mirrorImageIfExternal } from "@/lib/mirror-image";
import type { Categoria, Gama } from "@/lib/types";

function sanitize(v: unknown) {
  return typeof v === "string" ? v.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim() : v;
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const categoria = sanitize(body.categoria) as Categoria;
  const nombre = sanitize(body.nombre) as string;
  const imagen = await mirrorImageIfExternal(sanitize(body.imagen) as string);
  const specs = sanitize(body.specs) as string;
  const stock = Number(body.stock) || 0;
  const gama = (body.gama as Gama) || "media";
  const fuente_minima = Number(body.fuente_minima) || 0;
  const precio_estimado = Number(body.precio_estimado) || 0;
  const has_igpu =
    body.has_igpu === true || body.has_igpu === "true" || body.has_igpu === 1 ? 1 : 0;
  const destacado = body.destacado === true || body.destacado === "true";

  try {
    await insertProduct({
      id: `${categoria}-${Date.now()}`,
      categoria,
      nombre,
      imagen,
      stock,
      gama,
      specs,
      fuente_minima,
      precio_estimado,
      has_igpu,
      destacado,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
