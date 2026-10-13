import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { InstagramIcon } from "@/components/icons/instagram-icon";

const REVIEWS = [
  {
    embed: "https://www.instagram.com/p/DdHc5cflWUF/embed/",
    quote:
      '"Llevé mi PC para hacerle un update de componentes. Increíble la atención, me asesoraron súper bien y la máquina ahora vuela en todos los juegos en Ultra. ¡10 de 10 recomendados!"',
  },
  {
    embed: "https://www.instagram.com/p/DYX8pRbFZ2l/embed/",
    quote:
      '"Los mejores de Santa Fe lejos. Les dejé mi equipo para un service completo porque calentaba mucho y me la devolvieron como nueva. El rendimiento cambió por completo. Un éxito total."',
  },
  {
    embed: "https://www.instagram.com/p/DYGKItUleA8/embed/",
    quote:
      '"Hice un service completo de mantenimiento y limpieza profunda. El trato fue espectacular, la compu dejó de hacer ruido y ahora rinde perfecta para mis trabajos de edición. Unos genios."',
  },
  {
    embed: "https://www.instagram.com/p/DXWxVvRlX7g/embed/",
    quote:
      '"Fui por el armado completo de una PC desde cero. Excelente predisposición, te explican todo paso a paso y la gestión de cables quedó impecable. La compu es una bestia."',
  },
];

export function Testimonials() {
  return (
    <section
      id="armados"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 text-center"
    >
      <FadeIn>
        <h2 className="mb-2 text-3xl font-bold uppercase md:text-4xl">
          Nuestros <span className="text-[#1c62ff]">armados</span> y clientes
        </h2>
        <p className="mb-10 text-base text-[#8b9bb4]">
          Mirá los últimos equipos que salieron del taller y lo que opina la
          gente.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 gap-7 text-left lg:grid-cols-2">
        {REVIEWS.map((r, i) => (
          <FadeIn key={r.embed} delay={i * 0.08}>
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-[rgba(10,20,40,0.85)] p-5 sm:flex-row sm:items-start">
              <iframe
                src={r.embed}
                width={260}
                height={380}
                className="w-full max-w-[280px] shrink-0 rounded-xl bg-white sm:w-[260px]"
                scrolling="no"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-3 text-lg tracking-widest text-[#facc15]">
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="mb-4 text-sm leading-relaxed text-white italic">
                  {r.quote}
                </p>
                <p className="text-xs font-bold text-[#8b9bb4]">
                  — Cliente Verificado
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2} className="mt-10">
        <Link
          href="https://www.instagram.com/tesla.computacion/"
          target="_blank"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1c62ff] px-7 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(28,98,255,0.4)] transition hover:-translate-y-0.5 hover:bg-[#104ad5]"
        >
          <InstagramIcon size={18} />
          Ver más en Instagram
        </Link>
      </FadeIn>
    </section>
  );
}
