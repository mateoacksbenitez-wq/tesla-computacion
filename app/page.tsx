import { getAllProducts, getAllPcsArmadas } from "@/lib/db";
import { Hero } from "@/components/sections/hero";
import { Destacados } from "@/components/sections/destacados";
import { UsoGallery } from "@/components/sections/uso-gallery";
import { Stats } from "@/components/sections/stats";
import { BuildCta } from "@/components/sections/build-cta";
import { Servicios } from "@/components/sections/servicios";
import { Tienda } from "@/components/sections/tienda";
import { Testimonials } from "@/components/sections/testimonials";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [productos, pcs] = await Promise.all([getAllProducts(), getAllPcsArmadas()]);
  const usos = productos.filter((p) => p.categoria === "uso");

  return (
    <>
      <Hero />
      <Destacados productos={productos} pcs={pcs} />
      <UsoGallery usos={usos} />
      <Stats />
      <BuildCta />
      <Servicios />
      <Tienda />
      <Testimonials />
    </>
  );
}
