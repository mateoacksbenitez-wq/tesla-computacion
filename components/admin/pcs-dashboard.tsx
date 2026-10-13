"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PcArmada } from "@/lib/types";
import { PcFormDialog } from "./pc-form-dialog";
import { PcDeleteConfirmDialog } from "./pc-delete-confirm-dialog";

export function PcsDashboard({
  pcs,
  onRefresh,
}: {
  pcs: PcArmada[];
  onRefresh: () => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PcArmada | null>(null);
  const [deleting, setDeleting] = useState<PcArmada | null>(null);
  const [stockDrafts, setStockDrafts] = useState<Record<string, number>>({});

  function draftStock(p: PcArmada) {
    return stockDrafts[p.id] ?? p.stock;
  }

  async function saveStock(id: string, stock: number) {
    setStockDrafts((s) => ({ ...s, [id]: stock }));
    const res = await fetch("/api/admin/pcs-armadas/quick-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock }),
    });
    const data = await res.json();
    if (data.success) {
      onRefresh();
    } else {
      toast.error(data.error || "No se pudo actualizar el stock");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    const res = await fetch(`/api/admin/pcs-armadas/${deleting.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("PC eliminada");
      onRefresh();
    } else {
      toast.error(data.error || "No se pudo eliminar");
    }
    setDeleting(null);
  }

  return (
    <div>
      <div className="glass-panel mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <div>
          <h2 className="text-lg font-bold">PCs Armadas</h2>
          <p className="text-xs text-[#8b9bb4]">
            Configuraciones listas para vender, con foto, precio y detalle de componentes.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} /> Nueva PC armada
        </Button>
      </div>

      <div className="glass-panel overflow-x-auto rounded-2xl p-4">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-[#8b9bb4] uppercase">
              <th className="px-3 py-3">PC</th>
              <th className="px-3 py-3">Precio</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pcs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[#8b9bb4]">
                  Todavía no cargaste ninguna PC armada.
                </td>
              </tr>
            )}
            {pcs.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imagen || "/images/gpu-integrated.svg"}
                      alt={p.nombre}
                      className="h-11 w-11 rounded-lg bg-white/90 object-contain p-1"
                    />
                    <div>
                      <div className="text-sm font-bold">
                        {p.destacado && "⭐ "}
                        {p.nombre}
                      </div>
                      <div className="line-clamp-1 text-xs text-[#8b9bb4]">
                        {p.componentes || "Sin componentes cargados"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm font-semibold">
                  ${p.precio.toLocaleString("es-AR")}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 w-fit">
                    <button
                      className="h-7 w-7 rounded-md font-bold text-[#8b9bb4] hover:bg-white/10 hover:text-white"
                      onClick={() => saveStock(p.id, Math.max(0, draftStock(p) - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-10 bg-transparent text-center text-sm font-bold outline-none"
                      value={draftStock(p)}
                      min={0}
                      onChange={(e) =>
                        setStockDrafts((s) => ({ ...s, [p.id]: Number(e.target.value) || 0 }))
                      }
                      onBlur={(e) => saveStock(p.id, Number(e.target.value) || 0)}
                    />
                    <button
                      className="h-7 w-7 rounded-md font-bold text-[#8b9bb4] hover:bg-white/10 hover:text-white"
                      onClick={() => saveStock(p.id, draftStock(p) + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {p.stock <= 0 ? (
                    <Badge className="bg-[#ff3b30]/15 text-[#ff6259]">Agotado</Badge>
                  ) : p.stock === 1 ? (
                    <Badge className="bg-[#ffa733]/15 text-[#ffa733]">🔥 Última unidad</Badge>
                  ) : (
                    <Badge className="bg-[#34d058]/15 text-[#34d058]">Disponible</Badge>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(p);
                        setFormOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleting(p)}>
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PcFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        pc={editing}
        onSaved={() => {
          setFormOpen(false);
          onRefresh();
        }}
      />

      <PcDeleteConfirmDialog
        pc={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
