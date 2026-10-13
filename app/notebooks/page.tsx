import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { FadeIn } from "@/components/fade-in";
import { ShieldCheck, Truck, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Notebooks | Tesla Computación",
};

const VENTAJAS = [
  {
    icon: ShieldCheck,
    titulo: "Garantía oficial",
    desc: "Equipos con garantía y respaldo de fábrica, sin sorpresas.",
  },
  {
    icon: Truck,
    titulo: "Variedad de modelos",
    desc: "Notebooks para trabajo, estudio y gaming, de distintas marcas y precios.",
  },
  {
    icon: Wrench,
    titulo: "Service incluido",
    desc: "Ante cualquier problema, te lo resolvemos nosotros mismos en el local.",
  },
];

export default function NotebooksPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
      <FadeIn className="text-center">
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#8b9bb4] uppercase">
          Notebooks gaming y para trabajo
        </p>
        <h1 className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-3xl font-bold uppercase md:text-4xl">
          <span>
            Tesla Computación,{" "}
            <span className="text-[#1c62ff]">Dealer Oficial</span>
          </span>
          <a
            href="https://netcomex.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block h-10 w-36 shrink-0 align-middle transition hover:opacity-80 md:h-12 md:w-44"
          >
            <Image
              src="/images/netcomex-logo.png"
              alt="NetComeX"
              fill
              sizes="176px"
              className="object-contain"
            />
          </a>
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-sm text-[#8b9bb4]">
          Somos distribuidores oficiales de NetComeX, así que accedés a
          notebooks originales, con garantía y a precio de distribuidor.
          Contanos qué necesitás y te asesoramos según tu uso y presupuesto.
        </p>
        <Link
          href={`https://wa.me/5493425117356?text=${encodeURIComponent(
            "Hola! Quiero consultar por notebooks disponibles."
          )}`}
          target="_blank"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
        >
          <WhatsappIcon size={18} />
          Consultar notebooks disponibles
        </Link>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {VENTAJAS.map((v) => (
          <div
            key={v.titulo}
            className="rounded-2xl border border-white/8 bg-[rgba(20,25,43,0.6)] p-6 text-center"
          >
            <v.icon className="mx-auto mb-3 text-[#1c62ff]" size={28} />
            <h3 className="mb-1 text-sm font-bold">{v.titulo}</h3>
            <p className="text-xs text-[#8b9bb4]">{v.desc}</p>
          </div>
        ))}
      </FadeIn>
    </div>
  );
}
