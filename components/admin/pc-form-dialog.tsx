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
import type { PcArmada } from "@/lib/types";

const EMPTY = {
  nombre: "",
  precio: 0,
  imagen: "",
  stock: 5,
  componentes: "",
  destacado: false,
};

export function PcFormDialog({
  open,
  onOpenChange,
  pc,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pc: PcArmada | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (pc) {
      setForm({
        nombre: pc.nombre,
        precio: pc.precio,
        imagen: pc.imagen || "",
        stock: pc.stock,
        componentes: pc.componentes || "",
        destacado: !!pc.destacado,
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, pc]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.imagen.trim() || !form.componentes.trim()) {
      toast.error("Completá el nombre, la foto y los componentes de la PC");
      return;
    }
    setSaving(true);
    try {
      const url = pc ? `/api/admin/pcs-armadas/${pc.id}` : "/api/admin/pcs-armadas";
      const method = pc ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(pc ? "PC actualizada" : "PC agregada");
        onSaved();
      } else {
        toast.error(data.error || "Error al guardar la PC");
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
          <DialogTitle>{pc ? `Editar: ${pc.nombre}` : "Agregar PC armada"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2">Nombre de la PC *</Label>
            <Input
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej: PC Gamer Ryzen 5 / RTX 3060"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Precio *</Label>
              <Input
                type="number"
                min={0}
                value={form.precio}
                onChange={(e) => setForm((f) => ({ ...f, precio: Number(e.target.value) || 0 }))}
                placeholder="Ej: 1450000"
                required
              />
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
            <Label className="mb-2">Foto de la PC *</Label>
            <div className="mb-2 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                id="pc-photo-input"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => document.getElementById("pc-photo-input")?.click()}
              >
                {uploading ? "Subiendo..." : "📁 Subir desde mi PC"}
              </Button>
            </div>
            <Input
              type="text"
              value={form.imagen}
              onChange={(e) => setForm((f) => ({ ...f, imagen: e.target.value }))}
              placeholder="Se completa al subir la foto"
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

          <div>
            <Label className="mb-2">Componentes de la PC *</Label>
            <Textarea
              rows={6}
              value={form.componentes}
              onChange={(e) => setForm((f) => ({ ...f, componentes: e.target.value }))}
              placeholder={"Ej:\nProcesador: AMD Ryzen 5 5600\nPlaca de Video: RTX 3060 8GB\nRAM: 16GB DDR4\nAlmacenamiento: SSD 500GB\nFuente: 600W\nGabinete: ..."}
              required
            />
            <p className="mt-1 text-xs text-[#8b9bb4]">
              Escribí un componente por línea, así se muestra ordenado en la web.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20"
            />
            PC destacada / en oferta (aparece en la sección de destacados del home)
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              Guardar PC
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
