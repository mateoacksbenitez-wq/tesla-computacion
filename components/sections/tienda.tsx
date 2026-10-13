import { Package, Laptop } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ServiceList, type ServiceListItem } from "./service-list";

const TIENDA: ServiceListItem[] = [
  {
    icon: Package,
    titulo: "Stock de Componentes",
    desc: "Gabinetes, placas de video y agregados en el local.",
    href: "/catalogo",
  },
  {
    icon: Laptop,
    titulo: "Notebooks",
    desc: "Dealer oficial NetComeX: notebooks originales con garantía.",
    href: "/notebooks",
  },
];

export function Tienda() {
  return (
    <section
      id="tienda"
      className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16"
    >
      <FadeIn>
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#8b9bb4] uppercase">
          Comprá lo que necesitás
        </p>
        <h2 className="mb-4 text-3xl font-bold uppercase md:text-4xl">
          Nuestra <span className="text-[#1c62ff]">tienda</span>
        </h2>
        <p className="mb-10 max-w-md text-base text-[#8b9bb4]">
          Componentes y equipos con stock real, disponibles en el local o por
          consulta.
        </p>
      </FadeIn>

      <ServiceList items={TIENDA} />
    </section>
  );
}
