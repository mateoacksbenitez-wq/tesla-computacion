"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/fade-in";
import type { PcArmada } from "@/lib/types";

export function PcsArmadasGrid({ pcs }: { pcs: PcArmada[] }) {
  if (pcs.length === 0) {
    return (
      <p className="text-sm text-[#8b9bb4]">
        Por ahora no hay PCs armadas publicadas. Volvé a consultar pronto.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pcs.map((pc, i) => (
        <FadeIn key={pc.id} delay={Math.min(i * 0.05, 0.3)}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex h-full flex-col rounded-2xl border border-white/8 bg-[rgba(20,25,43,0.6)] p-5"
          >
            <div className="relative mx-auto mb-4 aspect-square w-36 shrink-0 overflow-hidden rounded-xl bg-white/90 p-3">
              <Image
                src={pc.imagen || "/images/gpu-integrated.svg"}
                alt={pc.nombre}
                fill
                sizes="144px"
                className="object-contain"
              />
            </div>

            <div className="mb-2 flex items-center gap-2">
              {pc.estado === "Agotado" ? (
                <Badge className="bg-[#ff3b30]/15 text-[#ff6259]">Agotado</Badge>
              ) : pc.stock === 1 ? (
                <Badge className="bg-[#ffa733]/15 text-[#ffa733]">🔥 Última unidad</Badge>
              ) : (
                <Badge className="bg-[#34d058]/15 text-[#34d058]">Disponible</Badge>
              )}
            </div>

            <h3 className="mb-1 text-base font-bold">{pc.nombre}</h3>
            <p className="mb-3 text-lg font-bold text-[#1c62ff]">
              ${pc.precio.toLocaleString("es-AR")}
            </p>

            <ul className="mb-4 flex-1 space-y-1">
              {pc.componentes
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, idx) => (
                  <li key={idx} className="text-xs text-[#8b9bb4]">
                    • {line}
                  </li>
                ))}
            </ul>

            <a
              href={`https://wa.me/5493425117356?text=${encodeURIComponent(
                `Hola, me interesa la ${pc.nombre} (\$${pc.precio.toLocaleString("es-AR")}). ¿Me pasás más info?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#1c62ff] py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#1c62ff]/85"
            >
              Consultar por WhatsApp
            </a>
          </motion.div>
        </FadeIn>
      ))}
    </div>
  );
}
