import type { Metadata } from "next";
import { getAllProducts } from "@/lib/db";
import { CatalogoGrid } from "@/components/catalogo-grid";

export const metadata: Metadata = {
  title: "Catálogo | Tesla Computación",
};

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const productos = (await getAllProducts()).filter(
    (p) => p.categoria !== "uso" && p.categoria !== "mother"
  );
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#8b9bb4] uppercase">
        Stock real, actualizado
      </p>
      <h1 className="mb-8 text-3xl font-bold uppercase md:text-4xl">
        Catálogo de <span className="text-[#1c62ff]">componentes</span>
      </h1>
      <CatalogoGrid productos={productos} />
    </div>
  );
}
