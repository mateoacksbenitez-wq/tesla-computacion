import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { Badge } from "@/components/ui/badge";
import type { PcArmada, Producto } from "@/lib/types";

type Item = {
  id: string;
  nombre: string;
  imagen: string | null;
  precio: number;
  detalle: string;
  href: string;
};

export function Destacados({
  productos,
  pcs,
}: {
  productos: Producto[];
  pcs: PcArmada[];
}) {
  const items: Item[] = [
    ...pcs
      .filter((p) => p.destacado)
      .map((p) => ({
        id: p.id,
        nombre: p.nombre,
        imagen: p.imagen,
        precio: p.precio,
        detalle: p.componentes,
        href: "/pcs-armadas",
      })),
    ...productos
      .filter((p) => p.destacado && p.categoria !== "mother")
      .map((p) => ({
        id: p.id,
        nombre: p.nombre,
        imagen: p.imagen,
        precio: p.precio_estimado,
        detalle: p.specs || "",
        href: "/catalogo",
      })),
  ];

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <FadeIn>
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#8b9bb4] uppercase">
          Por tiempo limitado
        </p>
        <h2 className="mb-10 text-3xl font-bold uppercase md:text-4xl">
          Destacados y <span className="text-[#1c62ff]">ofertas</span>
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={Math.min(i * 0.05, 0.3)}>
            <Link
              href={item.href}
              className="flex h-full flex-col rounded-2xl border border-[#1c62ff]/30 bg-[rgba(20,25,43,0.6)] p-5 transition hover:border-[#1c62ff]"
            >
              <div className="mb-2">
                <Badge className="bg-[#1c62ff]/15 text-[#1c62ff]">🔥 Oferta</Badge>
              </div>
              <div className="relative mx-auto mb-4 aspect-square w-36 shrink-0 overflow-hidden rounded-xl bg-white/90 p-3">
                <Image
                  src={item.imagen || "/images/gpu-integrated.svg"}
                  alt={item.nombre}
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </div>
              <h3 className="mb-1 text-sm font-bold">{item.nombre}</h3>
              <p className="mb-1 text-lg font-bold text-[#1c62ff]">
                ${item.precio.toLocaleString("es-AR")}
              </p>
              <p className="line-clamp-2 text-xs text-[#8b9bb4]">{item.detalle}</p>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
