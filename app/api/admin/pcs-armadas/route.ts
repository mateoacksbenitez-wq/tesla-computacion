import { NextRequest, NextResponse } from "next/server";
import { insertPcArmada } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { mirrorImageIfExternal } from "@/lib/mirror-image";

function sanitize(v: unknown) {
  return typeof v === "string" ? v.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim() : v;
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const nombre = sanitize(body.nombre) as string;
  const imagen = await mirrorImageIfExternal(sanitize(body.imagen) as string);
  const componentes = sanitize(body.componentes) as string;
  const stock = Number(body.stock) || 0;
  const precio = Number(body.precio) || 0;
  const destacado = body.destacado === true || body.destacado === "true";

  try {
    await insertPcArmada({
      id: `pc-${Date.now()}`,
      nombre,
      imagen,
      precio,
      componentes,
      stock,
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
