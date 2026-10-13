import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminSession } from "@/lib/auth";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (isRateLimited(`login:${ip}`, { windowMs: 60_000, max: 15 })) {
    return NextResponse.json(
      { error: "Demasiados intentos." },
      { status: 429 }
    );
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return NextResponse.json(
      { error: "El servidor no tiene configurada la contraseña de admin." },
      { status: 500 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: "" }));
  const ok = await bcrypt.compare(password || "", hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  await createAdminSession();
  return NextResponse.json({ success: true });
}
