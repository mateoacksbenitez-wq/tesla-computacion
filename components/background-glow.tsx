/**
 * Fondo "liquid glass" oscuro: orbes azules/cian difuminados y a la deriva sobre el
 * degradé de marca. Inspirado en el estilo Aceternity/Magic UI (glow difuso), pero
 * implementado a mano porque esas librerías se copian, no se instalan.
 */
export function BackgroundGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-32 -top-24 h-[600px] w-[600px] rounded-full bg-[#0071e3] opacity-40 blur-[120px] animate-[drift_22s_ease-in-out_infinite_alternate]" />
      <div className="absolute -right-24 -bottom-16 h-[500px] w-[500px] rounded-full bg-[#001f60] opacity-50 blur-[120px] animate-[drift_26s_ease-in-out_infinite_alternate-reverse]" />
      <div className="absolute left-1/3 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#4da3ff] opacity-25 blur-[110px] animate-[drift_18s_ease-in-out_infinite_alternate]" />
    </div>
  );
}
