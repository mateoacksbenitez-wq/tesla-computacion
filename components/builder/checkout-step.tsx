"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "@/lib/builder-store";
import { GAMA_LABEL, type Producto } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

export function CheckoutStep({
  psuWatts,
  perifericos,
  selectedPerifericos,
  onTogglePerifericos,
}: {
  psuWatts: number;
  perifericos: Producto[];
  selectedPerifericos: { nombre: string; price: number }[];
  onTogglePerifericos: (p: Producto) => void;
}) {
  const store = useBuilderStore();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showPerifericos, setShowPerifericos] = useState(false);

  const almacenamientoTxt =
    store.almacenamiento.length > 0
      ? store.almacenamiento
          .map((a) => `${a.nombre.replace("SSD NVMe ", "")} (${a.tipo})`)
          .join(" + ")
      : "No seleccionado";

  const resumen = [
    { label: "Uso", value: store.uso },
    { label: "Nivel", value: store.nivel ? GAMA_LABEL[store.nivel] : "No definido" },
    {
      label: "Procesador",
      value: store.cpu,
      gama: store.cpu_gama && GAMA_LABEL[store.cpu_gama],
    },
    { label: "Memoria RAM", value: `${store.ram_cap} ${store.ram_tech}` },
    {
      label: "Placa de Video",
      value: store.gpu || "No seleccionada",
      gama: store.gpu_gama && GAMA_LABEL[store.gpu_gama],
    },
    {
      label: "Gabinete",
      value: store.gabinete || "No seleccionado",
      gama: store.gabinete_gama && GAMA_LABEL[store.gabinete_gama],
    },
    { label: "Almacenamiento", value: almacenamientoTxt },
    {
      label: "Cooler",
      value: store.cooler || "No seleccionado",
      gama: store.cooler_gama && GAMA_LABEL[store.cooler_gama],
    },
    {
      label: "Fuente",
      value: store.fuente || "No seleccionada",
      gama: store.fuente_gama && GAMA_LABEL[store.fuente_gama],
    },
    {
      label: "Agregados",
      value:
        selectedPerifericos.length > 0
          ? selectedPerifericos.map((p) => p.nombre).join(" + ")
          : "Ninguno",
    },
  ];

  function enviarWhatsApp() {
    if (!nombre.trim() || !telefono.trim()) {
      toast.error("Completá tu nombre y WhatsApp para continuar.");
      return;
    }
    if (!store.cpu) {
      toast.error("Te falta seleccionar el procesador.");
      return;
    }

    const msg = `Hola, quiero una PC (${store.uso}${store.nivel ? `, Nivel ${GAMA_LABEL[store.nivel]}` : ""}) con:
- Procesador: ${store.cpu}${store.cpu_gama ? ` (Gama ${GAMA_LABEL[store.cpu_gama]})` : ""}
- Memoria RAM: ${store.ram_cap} ${store.ram_tech}
- Placa de Video: ${store.gpu || "Sin definir"}${store.gpu_gama ? ` (Gama ${GAMA_LABEL[store.gpu_gama]})` : ""}
- Gabinete: ${store.gabinete || "Sin definir"}${store.gabinete_gama ? ` (Gama ${GAMA_LABEL[store.gabinete_gama]})` : ""}
- Almacenamiento: ${almacenamientoTxt}
- Cooler: ${store.cooler || "Sin definir"}
- Fuente: ${store.fuente || "Sin definir"} (recomendado mínimo ${psuWatts}W)
- Agregados: ${selectedPerifericos.length > 0 ? "\n  - " + selectedPerifericos.map((p) => p.nombre).join("\n  - ") : "Ninguno"}

Mi nombre es ${nombre} y mi contacto es ${telefono}.`;

    window.open(
      `https://wa.me/5493425117356?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold md:text-2xl">Último paso</h2>
      <p className="mb-6 text-sm text-[#8b9bb4]">
        Revisá tu configuración e ingresá tus datos para que te contactemos
        por WhatsApp con el presupuesto oficial.
      </p>

      <div className="mb-6 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {resumen.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-3 text-sm">
            <span className="text-[#8b9bb4]">{r.label}</span>
            <span className="text-right font-medium">
              {r.value}
              {r.gama && (
                <span className="ml-1 text-xs text-[#8b9bb4]">({r.gama})</span>
              )}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-white/10 pt-2 text-sm">
          <span className="text-[#8b9bb4]">Fuente mínima recomendada</span>
          <span className="font-medium">{psuWatts}W</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowPerifericos((v) => !v)}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-white hover:text-white/80"
      >
        <Plus size={16} className={cn("transition-transform", showPerifericos && "rotate-45")} />
        Sumar agregados
      </button>

      {showPerifericos && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          {perifericos.length === 0 ? (
            <p className="text-sm text-[#8b9bb4]">
              Por ahora no hay agregados cargados en stock.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {perifericos.map((p) => {
                const isSelected = selectedPerifericos.some((s) => s.nombre === p.nombre);
                const disabled = p.stock <= 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onTogglePerifericos(p)}
                    disabled={disabled}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                      disabled
                        ? "cursor-not-allowed border-white/5 opacity-40 grayscale"
                        : "border-white/10 hover:border-[#1c62ff]/50 hover:bg-white/5",
                      isSelected && "border-[#1c62ff] bg-[#1c62ff]/10"
                    )}
                  >
                    {p.imagen && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/90 p-1">
                        <Image src={p.imagen} alt={p.nombre} fill sizes="48px" className="object-contain" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="block text-sm font-bold">{p.nombre}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedPerifericos.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
              {selectedPerifericos.map((s) => (
                <div
                  key={s.nombre}
                  className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="font-semibold">{s.nombre}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const p = perifericos.find((prod) => prod.nombre === s.nombre);
                      if (p) onTogglePerifericos(p);
                    }}
                    aria-label={`Quitar ${s.nombre}`}
                    className="shrink-0 text-[#8b9bb4] hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="nombre" className="mb-2">
            Tu nombre
          </Label>
          <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Juan Pérez" />
        </div>
        <div>
          <Label htmlFor="telefono" className="mb-2">
            Teléfono
          </Label>
          <Input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: 3425117356" />
        </div>
      </div>

      <Button onClick={enviarWhatsApp} className="mt-6 w-full">
        Enviar por WhatsApp
      </Button>
    </div>
  );
}
