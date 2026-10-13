"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BannerMensaje } from "@/lib/types";

export function BannerRotativo() {
  const [mensajes, setMensajes] = useState<BannerMensaje[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/api/banner")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setMensajes(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mensajes.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % mensajes.length);
    }, 5000);
    return () => clearInterval(id);
  }, [mensajes.length]);

  if (mensajes.length === 0) return null;

  return (
    <div className="flex h-9 items-center justify-center overflow-hidden bg-[#1c62ff] px-5 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={mensajes[index].id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-semibold text-white"
        >
          {mensajes[index].texto}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
