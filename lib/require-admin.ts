import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

/** Devuelve una respuesta 401 si no hay sesión de admin válida, o null si está todo OK. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}
