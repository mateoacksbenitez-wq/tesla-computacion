import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { TallerCarousel } from "@/components/taller-carousel";

export function BuildCta() {
  return (
    <section
      id="armatupc"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16"
    >
      <div className="mb-10 flex flex-col items-center gap-6 md:flex-row">
        <FadeIn className="flex-1">
          <h2 className="mb-4 text-3xl font-bold uppercase md:text-4xl">
            Armá tu PC
            <br />
            <span className="text-[#1c62ff]">a tu medida</span>
          </h2>
          <p className="mb-6 max-w-sm text-base text-[#8b9bb4]">
            Elegí cada componente, ajustá tu rendimiento y creá la PC que se
            adapte a vos. En Tesla Computación revisamos cada configuración
            antes de confirmar tu pedido.
          </p>
          <Link
            href="/armatupc"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
          >
            COMENZAR AHORA →
          </Link>
        </FadeIn>

        <FadeIn delay={0.15} className="w-full flex-1">
          <TallerCarousel />
        </FadeIn>
      </div>
    </section>
  );
}
