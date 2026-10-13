import path from "path";

const MAX_SIZE = 10 * 1024 * 1024;

function extFromContentType(ct: string) {
  if (ct.includes("webp")) return "webp";
  if (ct.includes("png")) return "png";
  if (ct.includes("gif")) return "gif";
  return "jpg";
}

/**
 * If `imagen` is an external http(s) URL (pasted by the admin instead of
 * uploaded), downloads it and re-hosts it on our own storage so it isn't
 * subject to next/image's remote-domain allowlist or the source going down.
 * Local paths (/uploads/..., /images/...) and already-mirrored URLs pass through.
 */
export async function mirrorImageIfExternal(imagen: string | null | undefined) {
  if (!imagen) return imagen ?? null;
  if (!/^https?:\/\//i.test(imagen)) return imagen;
  if (imagen.includes(".public.blob.vercel-storage.com")) return imagen;

  try {
    const res = await fetch(imagen, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return imagen;

    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return imagen;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > MAX_SIZE) return imagen;

    const filename = `producto-${Date.now()}.${extFromContentType(contentType)}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(filename, buffer, {
        access: "public",
        contentType,
      });
      return blob.url;
    }

    const { mkdir, writeFile } = await import("fs/promises");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);
    return `/uploads/${filename}`;
  } catch {
    return imagen;
  }
}
