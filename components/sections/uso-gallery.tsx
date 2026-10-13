import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/fade-in";
import type { Producto } from "@/lib/types";

export function UsoGallery({ usos }: { usos: Producto[] }) {
  if (usos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <FadeIn>
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#8b9bb4] uppercase">
          Para cada necesidad
        </p>
        <h2 className="mb-10 text-3xl font-bold uppercase md:text-4xl">
          Elegí tu <span className="text-[#1c62ff]">perfil de uso</span>
        </h2>
      </FadeIn>

      <StaggerContainer className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {usos.map((u, i) => (
          <StaggerItem key={u.id}>
            <Link
              href={`/armatupc?uso=${encodeURIComponent(u.nombre)}`}
              className="glass-panel-elevated group relative block h-full min-h-[340px] overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-lg rounded-bl-lg border border-white/8 transition-all duration-300 hover:-translate-y-1 hover:border-[#1c62ff]/50"
            >
              <div className="absolute inset-0 bg-[#0a1128]">
                <Image
                  src={u.imagen || "/taller.png"}
                  alt={u.nombre}
                  fill
                  className="object-fill opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-85"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020612] via-[#020612]/50 to-transparent mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020612] via-[#020612]/20 to-transparent" />
              </div>

              <span className="absolute top-4 left-4 font-heading text-xs font-semibold text-white/50 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-heading mb-1 text-xl font-bold tracking-tight">
                  {u.nombre}
                </h3>
                <p className="text-base text-[#8b9bb4] line-clamp-2">{u.specs}</p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
