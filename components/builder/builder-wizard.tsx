"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useBuilderStore,
  getRamCapacities,
  getAlmacenamientoOpciones,
  COOLER_DE_FABRICA,
  calculatePsu,
} from "@/lib/builder-store";
import type { Producto, Gama } from "@/lib/types";
import { GAMA_LABEL } from "@/lib/types";
import { CheckoutStep } from "./checkout-step";
import { StepSidebar } from "./step-sidebar";
import { cn } from "@/lib/utils";
import { CircleAlert, CheckCircle2, X } from "lucide-react";

const STEPS = [
  "Uso",
  "Nivel",
  "Procesador",
  "Memoria RAM",
  "Gráficos",
  "Gabinete",
  "Almacenamiento",
  "Cooler",
  "Fuente",
  "Checkout",
];

const NIVELES = ["baja", "media", "alta"] as const;

/** "Alto Rendimiento" no tiene niveles propios: se fija en "alta" y se saltea el paso. */
const USO_SIN_NIVEL = "Alto Rendimiento";

const isAmdCpu = (nombre: string) => /amd|ryzen/i.test(nombre);
const isIntelCpu = (nombre: string) => /intel|\bi[3579]\b/i.test(nombre);

export function BuilderWizard({ productos }: { productos: Producto[] }) {
  const [step, setStepRaw] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const direction = useRef(1);
  const store = useBuilderStore();

  function setStep(next: number | ((s: number) => number)) {
    setStepRaw((s) => {
      const resolved = typeof next === "function" ? next(s) : next;
      direction.current = resolved >= s ? 1 : -1;
      return resolved;
    });
  }

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const [cpuBrand, setCpuBrand] = useState<string>("Todas");

  const searchParams = useSearchParams();
  const usos = productos.filter((p) => p.categoria === "uso");

  function goToUso(nombre: string) {
    store.setUso(nombre);
    if (nombre === USO_SIN_NIVEL) {
      store.setNivel("alta");
      setStep(2);
    } else {
      setStep(1);
    }
  }

  useEffect(() => {
    store.reset();
    const usoParam = searchParams.get("uso");
    const match = usoParam && usos.find((u) => u.nombre === usoParam);
    if (match) goToUso(match.nombre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cpus = productos.filter((p) => p.categoria === "cpu");
  const gpus = productos.filter((p) => p.categoria === "gpu");
  const gabinetes = productos.filter((p) => p.categoria === "gabinete");
  const coolers = productos.filter((p) => p.categoria === "cooler");
  const fuentes = productos.filter((p) => p.categoria === "fuente");
  const perifericos = productos.filter((p) => p.categoria === "perifericos");
  const [wantsGpu, setWantsGpu] = useState<boolean | null>(() =>
    store.gpu === "" ? null : store.gpu !== "Sin Tarjeta Gráfica"
  );
  const [showAllGamasCpu, setShowAllGamasCpu] = useState(false);

  const cpuBrands = useMemo(() => {
    const found = new Set<string>();
    cpus.forEach((p) => {
      if (isAmdCpu(p.nombre)) found.add("AMD");
      else if (isIntelCpu(p.nombre)) found.add("Intel");
    });
    return ["Todas", ...Array.from(found)];
  }, [cpus]);

  const filteredCpus = cpus
    .filter((p) => {
      if (cpuBrand === "Todas") return true;
      if (cpuBrand === "AMD") return isAmdCpu(p.nombre);
      if (cpuBrand === "Intel") return isIntelCpu(p.nombre);
      return true;
    })
    .filter((p) => showAllGamasCpu || !store.nivel || p.gama === store.nivel);


  const noGpuDisabled = !store.cpu_has_igpu && store.cpu !== "";

  const selectGpu = (p: Producto) => {
    store.setGpu(p.nombre, p.precio_estimado, p.gama);
    checkBottleneck(p.gama);
    setTimeout(() => setStep((s) => s + 1), 250);
  };

  const selectNoGpu = () => {
    if (noGpuDisabled) {
      toast.error(
        "El procesador seleccionado requiere obligatoriamente una tarjeta gráfica dedicada."
      );
      return;
    }
    store.setGpu("Sin Tarjeta Gráfica", 0, "");
    setWantsGpu(false);
    setTimeout(() => setStep((s) => s + 1), 250);
  };

  function checkBottleneck(gpuGama: string) {
    const tier = (g: string) => (g === "baja" ? 1 : g === "media" ? 2 : g === "alta" ? 3 : 1);
    if (store.cpu_gama && tier(gpuGama) - tier(store.cpu_gama) >= 2) {
      toast.warning(
        "Esta combinación podría generar cuello de botella. Te asesoraremos."
      );
    }
  }

  if (!hydrated) return null;

  const isStepAnswered = (() => {
    switch (step) {
      case 0:
        return !!store.uso;
      case 1:
        return store.uso === USO_SIN_NIVEL || !!store.nivel;
      case 2:
        return !!store.cpu;
      case 4:
        return !!store.gpu;
      case 5:
        return !!store.gabinete;
      case 6:
        return store.almacenamiento.length > 0;
      case 7:
        return !!store.cooler;
      case 8:
        return !!store.fuente;
      default:
        return true;
    }
  })();

  const canGoNext = step < STEPS.length - 1 && isStepAnswered;
  const canGoPrev = step > 0;
  const psu = calculatePsu(store.cpu_gama, store.gpu, store.gpu_gama);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-32 md:pt-16">
      <div className="flex items-start gap-5">
        <StepSidebar step={step} onSelect={(i) => i <= step && setStep(i)} />

        <div className="min-w-0 flex-1">
          {/* Progreso (mobile) */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 md:hidden">
            {STEPS.map((label, i) => (
              <button
                key={label}
                onClick={() => i <= step && setStep(i)}
                className={cn(
                  "relative shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors",
                  i === step
                    ? "border-[#1c62ff] text-white"
                    : i < step
                      ? "border-white/20 bg-white/5 text-white"
                      : "border-white/10 text-[#8b9bb4]"
                )}
              >
                {i === step && (
                  <motion.span
                    layoutId="step-pill-bg"
                    className="absolute inset-0 rounded-full bg-[#1c62ff]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {i + 1}. {label}
                </span>
              </button>
            ))}
          </div>

      {/* Contenido del paso */}
      <div className="glass-panel relative min-h-[400px] overflow-hidden rounded-2xl">
        <div key={step} className="animate-fade-in-up p-6 md:p-8">
        {step === 0 && (
          <StepUso usos={usos} selected={store.uso} onSelect={goToUso} />
        )}

        {step === 1 && (
          <StepNivel
            selected={store.nivel}
            onSelect={(n) => {
              store.setNivel(n);
              setTimeout(() => setStep(2), 250);
            }}
          />
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-1 text-xl font-bold md:text-2xl">Elegí tu Procesador</h2>
            <p className="mb-4 text-sm text-[#8b9bb4]">
              Es el "cerebro" de la PC: cuanto mejor sea, más rápido abre programas
              y responde todo. Filtrá por marca o elegí el que más se adapte a vos.
            </p>
            {cpuBrands.length > 2 && (
              <div className="mb-6 flex items-center justify-center gap-4">
                {cpuBrands
                  .filter((b) => b !== "Todas")
                  .map((b) => {
                  const logo =
                    b === "AMD"
                      ? "/images/logo-amd-white.png"
                      : b === "Intel"
                        ? "/images/logo-intel-white.png"
                        : null;
                  if (!logo) return null;
                  return (
                    <button
                      key={b}
                      onClick={() => setCpuBrand(cpuBrand === b ? "Todas" : b)}
                      className={cn(
                        "relative flex h-16 w-32 items-center justify-center rounded-xl border bg-white/5 p-2 transition-colors",
                        cpuBrand === b
                          ? "border-[#1c62ff] bg-[#1c62ff]/10"
                          : "border-white/15 hover:border-white/40"
                      )}
                    >
                      <Image
                        src={logo}
                        alt={b}
                        fill
                        sizes="128px"
                        className={cn("object-contain", b === "Intel" && "scale-75")}
                      />
                    </button>
                  );
                })}
              </div>
            )}
            {store.nivel && !showAllGamasCpu && (
              <button
                onClick={() => setShowAllGamasCpu(true)}
                className="mb-4 text-xs font-semibold text-[#8b9bb4] underline hover:text-white"
              >
                Mostrando solo gama {GAMA_LABEL[store.nivel]} · Ver todas las gamas
              </button>
            )}
            <ProductGrid
              productos={filteredCpus}
              selected={store.cpu}
              onSelect={(p) => {
                store.setCpu(p.nombre, p.precio_estimado, !!p.has_igpu, p.gama);
                setTimeout(() => setStep(3), 250);
              }}
            />
          </div>
        )}

        {step === 3 && (
          <StepRam
            techSelected={store.ram_tech}
            capSelected={store.ram_cap}
            onTech={store.setRamTech}
            onCap={store.setRamCap}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <div>
            <h2 className="mb-1 text-xl font-bold md:text-2xl">Placa de Video</h2>
            <p className="mb-6 text-sm text-[#8b9bb4]">
              Es la que dibuja las imágenes en pantalla: la necesitás para jugar,
              ver videos con buena calidad o trabajar con diseño/edición.
            </p>
            <AnimatePresence>
              {noGpuDisabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-2 overflow-hidden rounded-xl bg-[#ff3b30]/15 p-3 text-xs font-semibold text-[#ff6259]"
                >
                  <CircleAlert size={16} className="shrink-0" />
                  Tu procesador no tiene gráficos integrados. Debés elegir una
                  tarjeta gráfica.
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mb-3 text-sm font-semibold">
              ¿Necesitás placa gráfica dedicada?
            </p>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <motion.button
                onClick={selectNoGpu}
                whileHover={noGpuDisabled ? undefined : { y: -2 }}
                whileTap={noGpuDisabled ? undefined : { scale: 0.98 }}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  noGpuDisabled
                    ? "cursor-not-allowed border-white/5 opacity-40 grayscale"
                    : "border-white/10 hover:border-[#1c62ff]/50 hover:bg-white/5",
                  wantsGpu === false && "border-[#1c62ff] bg-[#1c62ff]/10"
                )}
              >
                <span className="block text-sm font-bold">No, gráficos integrados</span>
                <span className="text-xs text-[#8b9bb4]">
                  Usar los gráficos integrados del procesador.
                </span>
              </motion.button>
              <motion.button
                onClick={() => setWantsGpu(true)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  "border-white/10 hover:border-[#1c62ff]/50 hover:bg-white/5",
                  wantsGpu === true && "border-[#1c62ff] bg-[#1c62ff]/10"
                )}
              >
                <span className="block text-sm font-bold">Sí, quiero una GPU dedicada</span>
                <span className="text-xs text-[#8b9bb4]">
                  Mejor rendimiento gráfico para gaming o diseño.
                </span>
              </motion.button>
            </div>

            {wantsGpu === true && (
              <div>
                <p className="mb-3 text-sm font-semibold">Elegí tu GPU</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {gpus.map((p) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      selected={store.gpu === p.nombre}
                      onSelect={() => selectGpu(p)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <StepProductGrid
            title="Gabinete"
            desc="Es la caja donde va todo montado. Además de la estética, define el tamaño de tu PC y cuánto espacio hay para que circule el aire."
            productos={gabinetes}
            selected={store.gabinete}
            onSelect={(p) => {
              store.setGabinete(p.nombre, p.precio_estimado, p.gama);
              setTimeout(() => setStep(6), 250);
            }}
          />
        )}

        {step === 6 && (
          <StepAlmacenamiento
            selected={store.almacenamiento}
            tipo={store.almacenamiento_tipo}
            onTipo={store.setAlmacenamientoTipo}
            onToggle={(o, tipo) => store.toggleAlmacenamiento(o.label, o.price, o.gama, tipo)}
            onNext={() => setStep(7)}
          />
        )}

        {step === 7 && (
          <StepCooler
            productos={coolers}
            selected={store.cooler}
            onSelect={(o) => {
              store.setCooler(o.label, o.price, o.gama);
              setTimeout(() => setStep(8), 250);
            }}
          />
        )}

        {step === 8 && (
          <StepFuente
            productos={fuentes}
            psuWatts={psu}
            selected={store.fuente}
            onSelect={(p) => {
              store.setFuente(p.nombre, p.precio_estimado, p.gama);
              setTimeout(() => setStep(9), 250);
            }}
          />
        )}

        {step === 9 && (
          <CheckoutStep
            psuWatts={psu}
            perifericos={perifericos}
            selectedPerifericos={store.perifericos}
            onTogglePerifericos={(p) => store.togglePerifericos(p.nombre, p.precio_estimado)}
          />
        )}
        </div>
      </div>
        </div>
      </div>

      {/* Navegación inferior */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass-panel fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t px-5 py-4 md:sticky md:mt-6 md:rounded-2xl md:border"
      >
        <Button variant="outline" disabled={!canGoPrev} onClick={() => setStep((s) => s - 1)}>
          Volver atrás
        </Button>
        <div className="text-center text-xs text-[#8b9bb4]">
          Paso {step + 1} de {STEPS.length}
        </div>
        {step < STEPS.length - 1 && (
          <Button
            disabled={!isStepAnswered}
            onClick={() => setStep((s) => s + 1)}
            title={!isStepAnswered ? "Elegí una opción para continuar" : undefined}
          >
            Siguiente →
          </Button>
        )}
      </motion.div>
    </div>
  );
}

function StepUso({
  usos,
  selected,
  onSelect,
}: {
  usos: Producto[];
  selected: string;
  onSelect: (uso: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold md:text-2xl">
        ¿Para qué vas a usar tu PC?
      </h2>
      <p className="mb-6 text-sm text-[#8b9bb4]">
        Ayudanos a filtrar los mejores componentes para tu perfil.
      </p>
      <div className="flex flex-col gap-3">
        {usos.map((u) => (
          <motion.button
            key={u.id}
            onClick={() => onSelect(u.nombre)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-4 rounded-xl border p-4 text-left transition-colors",
              selected === u.nombre
                ? "border-[#1c62ff] bg-[#1c62ff]/10"
                : "border-white/10 hover:border-white/30 hover:bg-white/5"
            )}
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#0a1128]">
              <Image
                src={u.imagen || "/taller.png"}
                alt={u.nombre}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="mb-1 text-sm font-bold">{u.nombre}</h3>
              <p className="text-xs text-[#8b9bb4]">{u.specs}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StepNivel({
  selected,
  onSelect,
}: {
  selected: Gama | "";
  onSelect: (nivel: Gama) => void;
}) {
  const DESC: Record<Gama, string> = {
    baja: "Lo esencial, buen rendimiento a menor costo.",
    media: "El punto justo entre precio y rendimiento.",
    alta: "Máximo rendimiento, sin límites.",
  };
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold md:text-2xl">Nivel de rendimiento</h2>
      <p className="mb-6 text-sm text-[#8b9bb4]">
        Elegí qué tan potente la querés, así te mostramos solo los componentes
        que te sirven.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {NIVELES.map((n) => (
          <motion.button
            key={n}
            onClick={() => onSelect(n)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              "border-white/10 hover:border-[#1c62ff]/50 hover:bg-white/5",
              selected === n && "border-[#1c62ff] bg-[#1c62ff]/10"
            )}
          >
            <span className="block text-sm font-bold">{GAMA_LABEL[n]}</span>
            <span className="text-xs text-[#8b9bb4]">{DESC[n]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StepProductGrid({
  title,
  desc,
  productos,
  selected,
  onSelect,
}: {
  title: string;
  desc: string;
  productos: Producto[];
  selected: string;
  onSelect: (p: Producto) => void;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold md:text-2xl">{title}</h2>
      <p className="mb-6 text-sm text-[#8b9bb4]">{desc}</p>
      <ProductGrid productos={productos} selected={selected} onSelect={onSelect} />
    </div>
  );
}

function ProductGrid({
  productos,
  selected,
  onSelect,
  hideImage,
}: {
  productos: Producto[];
  selected: string;
  onSelect: (p: Producto) => void;
  hideImage?: boolean;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {productos.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            selected={selected === p.nombre}
            onSelect={() => onSelect(p)}
            hideImage={hideImage}
          />
        ))}
      </div>
      {productos.length === 0 && (
        <p className="text-sm text-[#8b9bb4]">No hay productos cargados en esta categoría.</p>
      )}
    </>
  );
}

function ProductCard({
  p,
  selected,
  onSelect,
  hideImage,
}: {
  p: Producto;
  selected: boolean;
  onSelect: () => void;
  hideImage?: boolean;
}) {
  const disabled = p.stock <= 0;
  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      animate={selected ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4 text-left transition-colors",
        disabled
          ? "cursor-not-allowed border-white/5 opacity-40 grayscale"
          : "border-white/10 hover:border-[#1c62ff]/50 hover:bg-white/5",
        selected && "border-[#1c62ff] bg-[#1c62ff]/10"
      )}
    >
      {!hideImage && (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/90 p-1.5">
          <Image
            src={p.imagen || "/images/gpu-integrated.svg"}
            alt={p.nombre}
            fill
            sizes="64px"
            className="object-contain"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className="block text-sm leading-snug font-bold">{p.nombre}</span>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            Gama {GAMA_LABEL[p.gama]}
          </Badge>
          {p.stock === 1 && (
            <span className="text-[10px] font-bold text-[#ffa733]">🔥 Última unidad</span>
          )}
          {disabled ? (
            <span className="text-[10px] font-bold text-[#ff6259]">Agotado</span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#34d058]">
              <CheckCircle2 size={12} /> Compatible
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function StepRam({
  techSelected,
  capSelected,
  onTech,
  onCap,
  onNext,
}: {
  techSelected: string;
  capSelected: string;
  onTech: (t: "DDR4" | "DDR5") => void;
  onCap: (c: string, price: number) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold md:text-2xl">Memoria RAM</h2>
      <p className="mb-6 text-sm text-[#8b9bb4]">
        Es la "mesa de trabajo" de la PC: a más RAM, más pestañas del navegador,
        programas o juegos podés tener abiertos a la vez sin que se trabe.
      </p>

      <p className="mb-2 text-xs font-bold tracking-wide text-[#8b9bb4] uppercase">
        Tecnología base
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["DDR4", "DDR5"] as const).map((t) => (
          <motion.button
            key={t}
            onClick={() => onTech(t)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-xl border px-5 py-3 text-sm font-semibold transition-colors",
              techSelected === t
                ? "border-[#1c62ff] bg-[#1c62ff] text-white"
                : "border-white/15 bg-white/5 hover:bg-white/10"
            )}
          >
            {t}
          </motion.button>
        ))}
      </div>

      <p className="mb-2 text-xs font-bold tracking-wide text-[#8b9bb4] uppercase">
        Capacidad
      </p>
      <div className="mb-8 flex flex-wrap gap-2">
        {getRamCapacities(techSelected as "DDR4" | "DDR5").map((c) => (
          <motion.button
            key={c.label}
            onClick={() => onCap(c.label, c.price)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-xl border px-5 py-3 text-sm font-semibold transition-colors",
              capSelected === c.label
                ? "border-[#1c62ff] bg-[#1c62ff] text-white"
                : "border-white/15 bg-white/5 hover:bg-white/10"
            )}
          >
            {c.label}
          </motion.button>
        ))}
      </div>

      <Button onClick={onNext} className="w-full sm:w-auto">
        Continuar a Gráficos →
      </Button>
    </div>
  );
}

function StepAlmacenamiento({
  selected,
  tipo,
  onTipo,
  onToggle,
  onNext,
}: {
  selected: { nombre: string; price: number; gama: Gama; tipo: "HDD" | "SSD" }[];
  tipo: "HDD" | "SSD";
  onTipo: (t: "HDD" | "SSD") => void;
  onToggle: (opcion: { label: string; price: number; gama: Gama }, tipo: "HDD" | "SSD") => void;
  onNext: () => void;
}) {
  const opciones = getAlmacenamientoOpciones(tipo);
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold md:text-2xl">Almacenamiento</h2>
      <p className="mb-6 text-sm text-[#8b9bb4]">
        Es donde se guardan tus archivos, fotos, juegos y programas de forma
        permanente (aunque apagues la PC). El SSD es mucho más rápido que el
        HDD para que todo abra al instante. Podés combinar más de una unidad
        (ej. SSD principal + otra extra).
      </p>

      <p className="mb-2 text-xs font-bold tracking-wide text-[#8b9bb4] uppercase">
        Tipo
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["HDD", "SSD"] as const).map((t) => (
          <motion.button
            key={t}
            onClick={() => onTipo(t)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-xl border px-5 py-3 text-sm font-semibold transition-colors",
              tipo === t
                ? "border-[#1c62ff] bg-[#1c62ff] text-white"
                : "border-white/15 bg-white/5 hover:bg-white/10"
            )}
          >
            {t}
          </motion.button>
        ))}
      </div>

      <p className="mb-2 text-xs font-bold tracking-wide text-[#8b9bb4] uppercase">
        Capacidad (elegí una o más)
      </p>
      <div className="mb-8 flex flex-wrap gap-2">
        {opciones.map((o) => {
          const isSelected = selected.some((s) => s.nombre === o.label && s.tipo === tipo);
          return (
            <motion.button
              key={o.label}
              onClick={() => onToggle(o, tipo)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-xl border px-5 py-3 text-sm font-semibold transition-colors",
                isSelected
                  ? "border-[#1c62ff] bg-[#1c62ff] text-white"
                  : "border-white/15 bg-white/5 hover:bg-white/10"
              )}
            >
              {o.label}
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-xs font-bold tracking-wide text-[#8b9bb4] uppercase">
            Tu selección
          </p>
          <div className="space-y-2">
            {selected.map((s) => (
              <div
                key={`${s.nombre}-${s.tipo}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm"
              >
                <span className="font-semibold">
                  {s.nombre} · {s.tipo}
                </span>
                <button
                  onClick={() => onToggle({ label: s.nombre, price: s.price, gama: s.gama }, s.tipo)}
                  aria-label={`Quitar ${s.nombre}`}
                  className="shrink-0 text-[#8b9bb4] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={onNext} className="w-full sm:w-auto">
        Continuar →
      </Button>
    </div>
  );
}

function StepCooler({
  productos,
  selected,
  onSelect,
}: {
  productos: Producto[];
  selected: string;
  onSelect: (o: { label: string; price: number; gama: Gama }) => void;
}) {
  const opciones = [
    { ...COOLER_DE_FABRICA, imagen: null as string | null },
    ...productos.map((p) => ({
      label: p.nombre,
      price: p.precio_estimado,
      gama: p.gama,
      imagen: p.imagen,
    })),
  ];
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold md:text-2xl">Cooler / Refrigeración</h2>
      <p className="mb-6 text-sm text-[#8b9bb4]">
        Enfría el procesador para que no se recaliente cuando la PC trabaja fuerte
        (jugando, editando, etc.).
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {opciones.map((o) => (
          <motion.button
            key={o.label}
            onClick={() => onSelect(o)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-4 rounded-xl border p-4 text-left transition-colors",
              selected === o.label
                ? "border-[#1c62ff] bg-[#1c62ff]/10"
                : "border-white/10 hover:border-[#1c62ff]/50 hover:bg-white/5"
            )}
          >
            {o.imagen && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/90 p-1.5">
                <Image src={o.imagen} alt={o.label} fill sizes="64px" className="object-contain" />
              </div>
            )}
            <span className="block min-w-0 flex-1 text-sm font-bold">{o.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StepFuente({
  productos,
  psuWatts,
  selected,
  onSelect,
}: {
  productos: Producto[];
  psuWatts: number;
  selected: string;
  onSelect: (p: Producto) => void;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold md:text-2xl">Fuente de alimentación</h2>
      <p className="mb-6 text-sm text-[#8b9bb4]">
        Es la que le da energía a todos los componentes. Según tu configuración,
        recomendamos una de al menos{" "}
        <span className="font-bold text-white">{psuWatts}W</span>.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {productos.map((p) => {
          const watts = parseInt(p.nombre.match(/\d+/)?.[0] || "0", 10);
          const recomendada = watts >= psuWatts;
          const disabled = p.stock <= 0;
          return (
            <motion.button
              key={p.id}
              onClick={() => onSelect(p)}
              disabled={disabled}
              whileHover={disabled ? undefined : { y: -2 }}
              whileTap={disabled ? undefined : { scale: 0.98 }}
              className={cn(
                "flex items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                disabled
                  ? "cursor-not-allowed border-white/5 opacity-40 grayscale"
                  : "border-white/10 hover:border-[#1c62ff]/50 hover:bg-white/5",
                selected === p.nombre && "border-[#1c62ff] bg-[#1c62ff]/10"
              )}
            >
              {p.imagen && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/90 p-1.5">
                  <Image src={p.imagen} alt={p.nombre} fill sizes="64px" className="object-contain" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{p.nombre}</span>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {recomendada && (
                    <span className="text-[10px] font-bold text-[#34d058]">
                      ✓ Recomendada
                    </span>
                  )}
                  {disabled && (
                    <span className="text-[10px] font-bold text-[#ff6259]">Agotado</span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      {productos.length === 0 && (
        <p className="text-sm text-[#8b9bb4]">No hay productos cargados en esta categoría.</p>
      )}
    </div>
  );
}

