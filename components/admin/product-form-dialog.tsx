"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Categoria, Gama, Producto } from "@/lib/types";

const EMPTY = {
  nombre: "",
  categoria: "gabinete" as Categoria,
  stock: 5,
  imagen: "",
  gama: "media" as Gama,
  fuente_minima: 0,
  precio_estimado: 0,
  specs: "",
  has_igpu: true,
  destacado: false,
};

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Producto | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        nombre: product.nombre,
        categoria: product.categoria,
        stock: product.stock,
        imagen: product.imagen || "",
        gama: product.gama,
        fuente_minima: product.fuente_minima,
        precio_estimado: product.precio_estimado,
        specs: product.specs || "",
        has_igpu: !!product.has_igpu,
        destacado: !!product.destacado,
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, product]);

  async function handleUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const res = await fetch("/api/admin/upload-photo", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm((f) => ({ ...f, imagen: data.imageUrl }));
        toast.success("Foto subida correctamente");
      } else {
        toast.error(data.error || "Error al subir la imagen");
      }
    } catch {
      toast.error("Error de conexión al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  const needsWatts = form.categoria === "gpu" || form.categoria === "cpu";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.imagen.trim()) {
      toast.error("Completá al menos el nombre y la foto del producto");
      return;
    }
    if (needsWatts && !form.fuente_minima) {
      toast.error("Este tipo de producto necesita los watts mínimos requeridos");
      return;
    }
    setSaving(true);
    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(product ? "Producto actualizado" : "Producto agregado");
        onSaved();
      } else {
        toast.error(data.error || "Error al guardar el producto");
      }
    } catch {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? `Editar: ${product.nombre}` : "Agregar nuevo producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2">Nombre del producto *</Label>
            <Input
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej: Gabinete NZXT H510 Blanco"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Categoría *</Label>
              <Select
                value={form.categoria}
                onValueChange={(v) => setForm((f) => ({ ...f, categoria: v as Categoria }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpu">Procesador (CPU)</SelectItem>
                  <SelectItem value="gpu">Placa de Video (GPU)</SelectItem>
                  <SelectItem value="mother">Motherboard</SelectItem>
                  <SelectItem value="gabinete">Gabinete</SelectItem>
                  <SelectItem value="fuente">Fuente de Alimentación</SelectItem>
                  <SelectItem value="cooler">Cooler / Refrigeración</SelectItem>
                  <SelectItem value="almacenamiento">Almacenamiento</SelectItem>
                  <SelectItem value="ram">Memoria RAM</SelectItem>
                  <SelectItem value="perifericos">Agregados</SelectItem>
                  <SelectItem value="uso">Uso / Perfil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Stock *</Label>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div>
            <Label className="mb-2">Precio *</Label>
            <Input
              type="number"
              min={0}
              value={form.precio_estimado}
              onChange={(e) =>
                setForm((f) => ({ ...f, precio_estimado: Number(e.target.value) || 0 }))
              }
              placeholder="Ej: 45000"
              required
            />
          </div>

          <div>
            <Label className="mb-2">Foto del producto *</Label>
            <div className="mb-2 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                id="photo-input"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => document.getElementById("photo-input")?.click()}
              >
                {uploading ? "Subiendo..." : "📁 Subir desde mi PC"}
              </Button>
              <span className="text-xs text-[#8b9bb4]">o ingresá una URL abajo</span>
            </div>
            <Input
              type="text"
              value={form.imagen}
              onChange={(e) => setForm((f) => ({ ...f, imagen: e.target.value }))}
              placeholder="/uploads/foto.jpg o https://ejemplo.com/foto.jpg"
              required
            />
            {form.imagen && (
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-dashed border-white/15 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imagen} alt="Vista previa" className="h-14 w-14 rounded bg-white object-contain p-1" />
                <span className="text-xs text-[#8b9bb4]">Vista previa</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Gama / Nivel</Label>
              <Select
                value={form.gama}
                onValueChange={(v) => setForm((f) => ({ ...f, gama: v as Gama }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Económica</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">
                Watts mínimos requeridos{needsWatts && " *"}
              </Label>
              <Input
                type="number"
                required={needsWatts}
                value={form.fuente_minima}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fuente_minima: Number(e.target.value) || 0 }))
                }
                placeholder="Ej: 750"
              />
            </div>
          </div>

          {form.categoria === "cpu" && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.has_igpu}
                onChange={(e) => setForm((f) => ({ ...f, has_igpu: e.target.checked }))}
                className="h-4 w-4 rounded border-white/20"
              />
              Tiene gráficos integrados (no necesita placa de video obligatoria)
            </label>
          )}

          <div>
            <Label className="mb-2">Especificaciones y descripción</Label>
            <Textarea
              rows={2}
              value={form.specs}
              onChange={(e) => setForm((f) => ({ ...f, specs: e.target.value }))}
              placeholder="Características clave del componente..."
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20"
            />
            Producto destacado / en oferta (aparece en la sección de destacados del home)
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              Guardar producto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
