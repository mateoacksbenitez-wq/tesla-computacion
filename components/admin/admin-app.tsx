"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BannerMensaje, PcArmada, Producto } from "@/lib/types";
import { AdminDashboard } from "./admin-dashboard";
import { PcsDashboard } from "./pcs-dashboard";
import { BannerDashboard } from "./banner-dashboard";

type Status = "loading" | "out" | "in";
type Section = "productos" | "pcs" | "banner";

export function AdminApp() {
  const [status, setStatus] = useState<Status>("loading");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pcs, setPcs] = useState<PcArmada[]>([]);
  const [mensajes, setMensajes] = useState<BannerMensaje[]>([]);
  const [section, setSection] = useState<Section>("productos");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => setStatus(d.authenticated ? "in" : "out"))
      .catch(() => setStatus("out"));
  }, []);

  useEffect(() => {
    if (status === "in") {
      loadProducts();
      loadPcs();
      loadBanner();
    }
  }, [status]);

  async function loadProducts() {
    const res = await fetch("/api/products");
    setProductos(await res.json());
  }

  async function loadPcs() {
    const res = await fetch("/api/pcs-armadas");
    setPcs(await res.json());
  }

  async function loadBanner() {
    const res = await fetch("/api/banner");
    setMensajes(await res.json());
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return toast.error("Ingresá la contraseña");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("in");
      } else {
        toast.error(data.error || "Contraseña inválida");
      }
    } catch {
      toast.error("Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setStatus("out");
    setPassword("");
  }

  if (status === "loading") return null;

  if (status === "out") {
    return (
      <div className="mx-auto max-w-md px-5 py-20">
        <div className="glass-panel rounded-2xl p-8 text-center">
          <h1 className="mb-2 text-xl font-bold">Acceso Restringido</h1>
          <p className="mb-6 text-sm text-[#8b9bb4]">
            Ingresá la contraseña maestra para administrar el catálogo.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña maestra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button type="submit" disabled={submitting} className="w-full">
              Ingresar al sistema
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 rounded-full border border-white/15 bg-white/5 p-1">
          <button
            onClick={() => setSection("productos")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              section === "productos"
                ? "bg-[#1c62ff] text-white"
                : "text-[#8b9bb4] hover:text-white"
            )}
          >
            Catálogo de productos
          </button>
          <button
            onClick={() => setSection("pcs")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              section === "pcs"
                ? "bg-[#1c62ff] text-white"
                : "text-[#8b9bb4] hover:text-white"
            )}
          >
            PCs Armadas
          </button>
          <button
            onClick={() => setSection("banner")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              section === "banner"
                ? "bg-[#1c62ff] text-white"
                : "text-[#8b9bb4] hover:text-white"
            )}
          >
            Banner
          </button>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      {section === "productos" && (
        <AdminDashboard productos={productos} onRefresh={loadProducts} />
      )}
      {section === "pcs" && <PcsDashboard pcs={pcs} onRefresh={loadPcs} />}
      {section === "banner" && (
        <BannerDashboard mensajes={mensajes} onRefresh={loadBanner} />
      )}
    </div>
  );
}
