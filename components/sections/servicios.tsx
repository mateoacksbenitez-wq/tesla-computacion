import { Cpu, Gamepad2, Laptop, ArrowUpCircle } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ServiceList, type ServiceListItem } from "./service-list";

const SERVICIOS: ServiceListItem[] = [
  {
    icon: Cpu,
    titulo: "Service de Placas de Video",
    desc: "Diagnóstico, limpieza y reparación de GPU.",
    href: `https://wa.me/5493425117356?text=${encodeURIComponent("Hola! Quiero consultar por el service de placa de video (GPU).")}`,
    external: true,
  },
  {
    icon: Gamepad2,
    titulo: "Service de PlayStation 5",
    desc: "Limpieza, cambio de pasta térmica y reparación.",
    href: `https://wa.me/5493425117356?text=${encodeURIComponent("Hola! Quiero consultar por el service de PlayStation 5.")}`,
    external: true,
  },
  {
    icon: Laptop,
    titulo: "Service de Notebook",
    desc: "Diagnóstico, limpieza y reparación de notebooks.",
    href: `https://wa.me/5493425117356?text=${encodeURIComponent("Hola! Quiero consultar por el service de mi notebook.")}`,
    external: true,
  },
  {
    icon: ArrowUpCircle,
    titulo: "Upgrades",
    desc: "Llevá tu PC al siguiente nivel con mejoras de componentes.",
    href: `https://wa.me/5493425117356?text=${encodeURIComponent("Hola! Quiero consultar por un upgrade para mi PC.")}`,
    external: true,
  },
];

export function Servicios() {
  return (
    <section
      id="servicios"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16"
    >
      <FadeIn>
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#8b9bb4] uppercase">
          Todo en un solo lugar
        </p>
        <h2 className="mb-4 text-3xl font-bold uppercase md:text-4xl">
          Nuestros <span className="text-[#1c62ff]">servicios</span>
        </h2>
        <p className="mb-10 max-w-md text-base text-[#8b9bb4]">
          Reparación, mantenimiento y upgrades para que tu equipo rinda como
          el primer día.
        </p>
      </FadeIn>

      <ServiceList items={SERVICIOS} />
    </section>
  );
}
