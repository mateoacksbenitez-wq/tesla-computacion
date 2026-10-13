import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/db";
import { BuilderWizard } from "@/components/builder/builder-wizard";

export const metadata: Metadata = {
  title: "Armá tu PC | Tesla Computación",
};

export const dynamic = "force-dynamic";

export default async function ArmaTuPcPage() {
  const productos = await getAllProducts();
  return (
    <Suspense>
      <BuilderWizard productos={productos} />
    </Suspense>
  );
}
