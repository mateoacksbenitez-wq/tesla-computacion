import type { Metadata } from "next";
import { getAllPcsArmadas } from "@/lib/db";
import { PcsArmadasGrid } from "@/components/pcs-armadas-grid";

export const metadata: Metadata = {
  title: "PCs Armadas | Tesla Computación",
};

export const dynamic = "force-dynamic";

export default async function PcsArmadasPage() {
  const pcs = await getAllPcsArmadas();
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#8b9bb4] uppercase">
        Listas para retirar
      </p>
      <h1 className="mb-8 text-3xl font-bold uppercase md:text-4xl">
        PCs <span className="text-[#1c62ff]">armadas</span>
      </h1>
      <PcsArmadasGrid pcs={pcs} />
    </div>
  );
}
