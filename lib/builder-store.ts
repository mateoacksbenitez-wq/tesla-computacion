"use client";

import { create } from "zustand";
import type { Gama } from "./types";

export interface BuilderState {
  uso: string;
  nivel: Gama | "";
  cpu: string;
  cpu_price: number;
  cpu_has_igpu: boolean;
  cpu_gama: Gama | "";
  ram_tech: "DDR4" | "DDR5";
  ram_cap: string;
  ram_price: number;
  gpu: string;
  gpu_price: number;
  gpu_gama: Gama | "";
  gabinete: string;
  gabinete_price: number;
  gabinete_gama: Gama | "";
  almacenamiento: { nombre: string; price: number; gama: Gama; tipo: "HDD" | "SSD" }[];
  almacenamiento_tipo: "HDD" | "SSD";
  cooler: string;
  cooler_price: number;
  cooler_gama: Gama | "";
  fuente: string;
  fuente_price: number;
  fuente_gama: Gama | "";
  perifericos: { nombre: string; price: number }[];

  setUso: (uso: string) => void;
  setNivel: (nivel: Gama) => void;
  setCpu: (nombre: string, price: number, hasIgpu: boolean, gama: Gama) => void;
  setRamTech: (tech: "DDR4" | "DDR5") => void;
  setRamCap: (cap: string, price: number) => void;
  setGpu: (nombre: string, price: number, gama: Gama | "") => void;
  setGabinete: (nombre: string, price: number, gama: Gama) => void;
  toggleAlmacenamiento: (
    nombre: string,
    price: number,
    gama: Gama,
    tipo: "HDD" | "SSD"
  ) => void;
  setAlmacenamientoTipo: (tipo: "HDD" | "SSD") => void;
  setCooler: (nombre: string, price: number, gama: Gama) => void;
  setFuente: (nombre: string, price: number, gama: Gama) => void;
  togglePerifericos: (nombre: string, price: number) => void;
  reset: () => void;
}

const initialState = {
  uso: "",
  nivel: "" as Gama | "",
  cpu: "",
  cpu_price: 0,
  cpu_has_igpu: true,
  cpu_gama: "" as Gama | "",
  ram_tech: "DDR4" as const,
  ram_cap: "16 GB",
  ram_price: 60000,
  gpu: "",
  gpu_price: 0,
  gpu_gama: "" as Gama | "",
  gabinete: "",
  gabinete_price: 0,
  gabinete_gama: "" as Gama | "",
  almacenamiento: [] as { nombre: string; price: number; gama: Gama; tipo: "HDD" | "SSD" }[],
  almacenamiento_tipo: "SSD" as "HDD" | "SSD",
  cooler: "",
  cooler_price: 0,
  cooler_gama: "" as Gama | "",
  fuente: "",
  fuente_price: 0,
  fuente_gama: "" as Gama | "",
  perifericos: [] as { nombre: string; price: number }[],
};

export const useBuilderStore = create<BuilderState>()(
  (set) => ({
    ...initialState,
      setUso: (uso) => set({ uso }),
      setNivel: (nivel) => set({ nivel }),
      setCpu: (nombre, price, hasIgpu, gama) =>
        set((state) => ({
          cpu: nombre,
          cpu_price: price,
          cpu_has_igpu: hasIgpu,
          cpu_gama: gama,
          // si el nuevo CPU no trae iGPU y ya había "sin tarjeta gráfica" elegido, se resetea
          ...(!hasIgpu && state.gpu === "Sin Tarjeta Gráfica"
            ? { gpu: "", gpu_price: 0, gpu_gama: "" as const }
            : {}),
        })),
      setRamTech: (ram_tech) => set({ ram_tech }),
      setRamCap: (ram_cap, ram_price) => set({ ram_cap, ram_price }),
      setGpu: (gpu, gpu_price, gpu_gama) => set({ gpu, gpu_price, gpu_gama }),
      setGabinete: (gabinete, gabinete_price, gabinete_gama) =>
        set({ gabinete, gabinete_price, gabinete_gama }),
      toggleAlmacenamiento: (nombre, price, gama, tipo) =>
        set((state) => {
          const exists = state.almacenamiento.some(
            (a) => a.nombre === nombre && a.tipo === tipo
          );
          return {
            almacenamiento: exists
              ? state.almacenamiento.filter((a) => !(a.nombre === nombre && a.tipo === tipo))
              : [...state.almacenamiento, { nombre, price, gama, tipo }],
          };
        }),
      setAlmacenamientoTipo: (almacenamiento_tipo) => set({ almacenamiento_tipo }),
      setCooler: (cooler, cooler_price, cooler_gama) =>
        set({ cooler, cooler_price, cooler_gama }),
      setFuente: (fuente, fuente_price, fuente_gama) =>
        set({ fuente, fuente_price, fuente_gama }),
      togglePerifericos: (nombre, price) =>
        set((state) => {
          const exists = state.perifericos.some((p) => p.nombre === nombre);
          return {
            perifericos: exists
              ? state.perifericos.filter((p) => p.nombre !== nombre)
              : [...state.perifericos, { nombre, price }],
          };
        }),
    reset: () => set(initialState),
  })
);

const RAM_CAPACITIES_DDR4: { label: string; price: number }[] = [
  { label: "8 GB", price: 30000 },
  { label: "16 GB", price: 60000 },
  { label: "32 GB", price: 120000 },
  { label: "64 GB", price: 240000 },
  { label: "128 GB", price: 480000 },
];

const RAM_CAPACITIES_DDR5: { label: string; price: number }[] = [
  { label: "8 GB", price: 35000 },
  { label: "16 GB", price: 65000 },
  { label: "24 GB", price: 90000 },
  { label: "32 GB", price: 130000 },
  { label: "48 GB", price: 190000 },
  { label: "64 GB", price: 260000 },
  { label: "128 GB", price: 500000 },
  { label: "256 GB", price: 950000 },
];

export function getRamCapacities(tech: "DDR4" | "DDR5" = "DDR4") {
  return tech === "DDR5" ? RAM_CAPACITIES_DDR5 : RAM_CAPACITIES_DDR4;
}

const ALMACENAMIENTO_HDD: { label: string; price: number; gama: Gama }[] = [
  { label: "500GB", price: 25000, gama: "baja" },
  { label: "1TB", price: 35000, gama: "baja" },
  { label: "2TB", price: 55000, gama: "media" },
  { label: "4TB", price: 95000, gama: "alta" },
  { label: "8TB", price: 160000, gama: "alta" },
];

const ALMACENAMIENTO_SSD: { label: string; price: number; gama: Gama }[] = [
  { label: "120GB", price: 18000, gama: "baja" },
  { label: "240GB", price: 25000, gama: "baja" },
  { label: "500GB", price: 35000, gama: "media" },
  { label: "1TB", price: 60000, gama: "media" },
  { label: "2TB", price: 110000, gama: "alta" },
];

export function getAlmacenamientoOpciones(tipo: "HDD" | "SSD") {
  return tipo === "HDD" ? ALMACENAMIENTO_HDD : ALMACENAMIENTO_SSD;
}

/** Única opción fija de cooler; el resto son productos reales cargados en el catálogo. */
export const COOLER_DE_FABRICA = {
  label: "Cooler de fábrica (incluido con el procesador)",
  price: 0,
  gama: "baja" as Gama,
};

export function getTier(gama: Gama | ""): number {
  if (gama === "baja") return 1;
  if (gama === "media") return 2;
  if (gama === "alta") return 3;
  return 1;
}

export function calculatePsu(cpuGama: Gama | "", gpu: string, gpuGama: Gama | ""): number {
  const tierTotal =
    getTier(cpuGama) + (gpu === "Sin Tarjeta Gráfica" || !gpu ? 0 : getTier(gpuGama));
  if (tierTotal <= 2) return 500;
  if (tierTotal <= 4) return 650;
  if (tierTotal <= 6) return 750;
  return 850;
}
