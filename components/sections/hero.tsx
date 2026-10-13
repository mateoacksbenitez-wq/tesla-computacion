import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Cpu, Truck, Headphones } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, label: "Asesoramiento personalizado" },
  { icon: Cpu, label: "Componentes de primera calidad" },
  { icon: Truck, label: "Envíos seguros a todo el país" },
  { icon: Headphones, label: "Soporte postventa" },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <div className="flex-1">
          <h1
            className="animate-fade-in-up mb-5 text-4xl leading-[1.05] font-bold md:text-5xl"
            style={{ animationDelay: "0.17s" }}
          >
            Tu próxima PC,
            <br />
            <span className="text-[#1c62ff]">armada a tu medida</span>
          </h1>
          <p
            className="animate-fade-in-up mb-8 max-w-md text-base text-[#8b9bb4]"
            style={{ animationDelay: "0.29s" }}
          >
            Rendimiento, diseño y asesoramiento personalizado para que lleves tu
            experiencia al siguiente nivel. Armado, upgrades y service, todo en
            un mismo lugar.
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.41s" }}>
            <Link
              href="/armatupc"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#1c62ff] px-7 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(28,98,255,0.4)] transition hover:-translate-y-0.5 hover:bg-[#104ad5] active:scale-95"
            >
              ARMÁ TU PC →
            </Link>
          </div>

          <div
            className="animate-fade-in-up mt-10 grid grid-cols-2 gap-4"
            style={{ animationDelay: "0.53s" }}
          >
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={22} className="mt-0.5 shrink-0 text-white" />
                <span className="text-sm leading-tight text-[#8b9bb4]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-scale w-full flex-1" style={{ animationDelay: "0.2s" }}>
          <div className="relative overflow-hidden rounded-2xl">
            <picture>
              <Image
                src="/images/hero-portada.png"
                alt="PC Gamer armada por Tesla Computación"
                width={800}
                height={800}
                priority
                className="mx-auto h-auto w-full max-w-md rounded-2xl object-cover"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}
