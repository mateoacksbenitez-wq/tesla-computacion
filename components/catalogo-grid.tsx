"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/fade-in";
import type { Producto, Categoria } from "@/lib/types";

const CATEGORIES: { value: Categoria | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "cpu", label: "Procesadores" },
  { value: "gpu", label: "Placas de Video" },
  { value: "gabinete", label: "Gabinetes" },
  { value: "cooler", label: "Coolers" },
  { value: "almacenamiento", label: "Almacenamiento" },
  { value: "ram", label: "Memoria RAM" },
  { value: "perifericos", label: "Agregados" },
  { value: "fuente", label: "Fuentes" },
];

export function CatalogoGrid({ productos }: { productos: Producto[] }) {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-8 h-auto w-full justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-0">
        {CATEGORIES.map((c) => (
          <TabsTrigger
            key={c.value}
            value={c.value}
            className="flex-none shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#8b9bb4] whitespace-nowrap data-active:border-[#1c62ff] data-active:bg-[#1c62ff] data-active:text-white after:hidden"
          >
            {c.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {CATEGORIES.map((c) => (
        <TabsContent key={c.value} value={c.value}>
          <Grid
            productos={
              c.value === "all" ? productos : productos.filter((p) => p.categoria === c.value)
            }
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function Grid({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return <p className="text-sm text-[#8b9bb4]">No hay productos en esta categoría.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {productos.map((p, i) => (
        <FadeIn key={p.id} delay={Math.min(i * 0.04, 0.3)}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex h-full flex-col rounded-2xl border border-white/8 bg-[rgba(20,25,43,0.6)] p-5"
          >
            <div className="relative mx-auto mb-4 aspect-square w-36 shrink-0 overflow-hidden rounded-xl bg-white/90 p-3">
              <Image
                src={p.imagen || "/images/gpu-integrated.svg"}
                alt={p.nombre}
                fill
                sizes="144px"
                className="object-contain"
              />
            </div>
            <div className="mb-2 flex items-center gap-2">
              {p.estado === "Agotado" ? (
                <Badge className="bg-[#ff3b30]/15 text-[#ff6259]">Agotado</Badge>
              ) : p.stock === 1 ? (
                <Badge className="bg-[#ffa733]/15 text-[#ffa733]">🔥 Última unidad</Badge>
              ) : (
                <Badge className="bg-[#34d058]/15 text-[#34d058]">Disponible</Badge>
              )}
            </div>
            <h3 className="mb-1 text-sm font-bold">{p.nombre}</h3>
            <p className="text-xs text-[#8b9bb4]">{p.specs}</p>
          </motion.div>
        </FadeIn>
      ))}
    </div>
  );
}
