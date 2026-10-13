"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BannerMensaje } from "@/lib/types";

export function BannerDashboard({
  mensajes,
  onRefresh,
}: {
  mensajes: BannerMensaje[];
  onRefresh: () => void;
}) {
  const [nuevo, setNuevo] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function draftFor(m: BannerMensaje) {
    return drafts[m.id] ?? m.texto;
  }

  async function handleAdd() {
    if (!nuevo.trim()) return toast.error("Escribí el texto del mensaje");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: nuevo.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNuevo("");
        onRefresh();
      } else {
        toast.error(data.error || "No se pudo agregar el mensaje");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSave(id: string) {
    const texto = draftFor({ id, texto: "", orden: 0 } as BannerMensaje);
    if (!texto.trim()) return toast.error("El mensaje no puede quedar vacío");
    const res = await fetch(`/api/admin/banner/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: texto.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Mensaje actualizado");
      onRefresh();
    } else {
      toast.error(data.error || "No se pudo actualizar");
    }
  }

  async function swapOrden(a: BannerMensaje, b: BannerMensaje) {
    await Promise.all([
      fetch(`/api/admin/banner/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden: b.orden }),
      }),
      fetch(`/api/admin/banner/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden: a.orden }),
      }),
    ]);
    onRefresh();
  }

  function moveUp(index: number) {
    if (index === 0) return;
    swapOrden(mensajes[index], mensajes[index - 1]);
  }

  function moveDown(index: number) {
    if (index === mensajes.length - 1) return;
    swapOrden(mensajes[index], mensajes[index + 1]);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/banner/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Mensaje eliminado");
      onRefresh();
    } else {
      toast.error(data.error || "No se pudo eliminar");
    }
  }

  return (
    <div>
      <div className="glass-panel mb-6 rounded-2xl p-6">
        <h2 className="mb-1 text-lg font-bold">Banner rotativo</h2>
        <p className="mb-4 text-xs text-[#8b9bb4]">
          Los mensajes que cargues acá van rotando arriba de todas las páginas de la web.
          Si no cargás ninguno, el banner no se muestra.
        </p>
        <div className="flex gap-2">
          <Input
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            placeholder="Ej: Envíos gratis en Santa Fe capital"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={saving}>
            <Plus size={16} /> Agregar
          </Button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4">
        {mensajes.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#8b9bb4]">
            Todavía no cargaste ningún mensaje.
          </p>
        ) : (
          <div className="space-y-2">
            {mensajes.map((m, i) => (
              <div key={m.id} className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    aria-label="Subir mensaje"
                    className="rounded p-1 text-[#8b9bb4] hover:bg-white/5 hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === mensajes.length - 1}
                    aria-label="Bajar mensaje"
                    className="rounded p-1 text-[#8b9bb4] hover:bg-white/5 hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <Input
                  value={draftFor(m)}
                  onChange={(e) => setDrafts((d) => ({ ...d, [m.id]: e.target.value }))}
                  onBlur={() => draftFor(m) !== m.texto && handleSave(m.id)}
                />
                <button
                  onClick={() => handleDelete(m.id)}
                  aria-label="Eliminar mensaje"
                  className="shrink-0 rounded-lg p-2 text-[#8b9bb4] hover:bg-white/5 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
