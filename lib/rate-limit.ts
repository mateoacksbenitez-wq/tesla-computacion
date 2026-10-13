// Rate limiter simple en memoria (sliding window), suficiente para el tamaño de este sitio.
// No sobrevive a un restart del server ni a múltiples instancias, y no hace falta más que eso acá.
const buckets = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  { windowMs, max }: { windowMs: number; max: number }
): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);
  return hits.length > max;
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
