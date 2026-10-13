"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Fan, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_STEPS = [
  { index: 0, label: "Uso", icon: null, Lucide: null },
  { index: 1, label: "Nivel", icon: "/icon-nivel.png", Lucide: null },
  { index: 2, label: "Procesador", icon: "/icon-cpu.png", Lucide: null },
  { index: 3, label: "Memoria RAM", icon: "/icon-ram.png", Lucide: null },
  { index: 4, label: "Gráficos", icon: "/icon-gpu.png", Lucide: null },
  { index: 5, label: "Gabinete", icon: "/icon-case.png", Lucide: null },
  { index: 6, label: "Almacenamiento", icon: null, Lucide: HardDrive },
  { index: 7, label: "Cooler", icon: null, Lucide: Fan },
];

export function StepSidebar({
  step,
  onSelect,
}: {
  step: number;
  onSelect: (i: number) => void;
}) {
  return (
    <aside className="hidden w-[88px] shrink-0 md:block">
      <div className="glass-panel sticky top-24 flex flex-col gap-2 rounded-2xl p-3">
        {ICON_STEPS.map((s) => {
          const active = s.index === step;
          const reached = s.index <= step;
          return (
            <motion.button
              key={s.index}
              disabled={!reached}
              onClick={() => onSelect(s.index)}
              whileHover={reached ? { scale: 1.05 } : undefined}
              whileTap={reached ? { scale: 0.95 } : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-colors",
                active
                  ? "bg-[#1c62ff]/15 text-white"
                  : reached
                    ? "text-[#8b9bb4] hover:bg-white/5 hover:text-white"
                    : "cursor-not-allowed text-white/20"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 rounded-xl border border-[#1c62ff]/50"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative flex h-8 w-8 items-center justify-center">
                {s.icon ? (
                  <Image
                    src={s.icon}
                    alt=""
                    width={28}
                    height={28}
                    className={cn("invert object-contain", !reached && "opacity-30")}
                  />
                ) : s.Lucide ? (
                  <s.Lucide size={22} />
                ) : (
                  <Sparkles size={22} />
                )}
              </span>
              <span className="relative text-[10px] leading-tight font-semibold">
                {s.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}
