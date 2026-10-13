"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Categoria, Producto } from "@/lib/types";
import { ProductFormDialog } from "./product-form-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

const CATEGORIES: { value: Categoria | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "cpu", label: "Procesadores" },
  { value: "gpu", label: "Placas de Video" },
  { value: "mother", label: "Motherboards" },
  { value: "gabinete", label: "Gabinetes" },
  { value: "fuente", label: "Fuentes" },
  { value: "cooler", label: "Coolers" },
  { value: "almacenamiento", label: "Almacenamiento" },
  { value: "ram", label: "Memoria RAM" },
  { value: "perifericos", label: "Agregados" },
  { value: "uso", label: "Usos" },
];

export function AdminDashboard({
  productos,
  onRefresh,
}: {
  productos: Producto[];
  onRefresh: () => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [deleting, setDeleting] = useState<Producto | null>(null);
  const [stockDrafts, setStockDrafts] = useState<Record<string, number>>({});

  const filtered = productos.filter(
    (p) => filter === "all" || p.categoria === filter
  );

  function draftStock(p: Producto) {
    return stockDrafts[p.id] ?? p.stock;
  }

  async function saveStock(id: string, stock: number) {
    setStockDrafts((s) => ({ ...s, [id]: stock }));
    const res = await fetch("/api/admin/quick-stock", {
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
    const res = await fetch(`/api/admin/products/${deleting.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Producto eliminado");
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
          <h2 className="text-lg font-bold">Gestión de Catálogo y Stock</h2>
          <p className="text-xs text-[#8b9bb4]">
            Agregá productos, modificá fotos, actualizá existencias o eliminá artículos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} /> Nuevo producto
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-0">
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
      </Tabs>

      <div className="glass-panel overflow-x-auto rounded-2xl p-4">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-wide text-[#8b9bb4] uppercase">
              <th className="px-3 py-3">Producto</th>
              <th className="px-3 py-3">Categoría</th>
              <th className="px-3 py-3">Gama / Watts</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-[#8b9bb4]">
                  No hay productos registrados en esta categoría.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
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
                      <div className="text-xs text-[#8b9bb4]">{p.specs || "Sin especificaciones"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold tracking-wide uppercase">
                    {p.categoria}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs">
                  {p.gama && <div>Gama {p.gama.toUpperCase()}</div>}
                  {p.fuente_minima > 0 && (
                    <div className="text-[#1c62ff]">{p.fuente_minima}W</div>
                  )}
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

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        onSaved={() => {
          setFormOpen(false);
          onRefresh();
        }}
      />

      <DeleteConfirmDialog
        product={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
