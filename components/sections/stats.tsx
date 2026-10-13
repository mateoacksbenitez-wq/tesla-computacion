import { Package, Users, Clock, HeartHandshake } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/fade-in";

const STATS = [
  { icon: Package, number: "+230", label: "PCs ensambladas" },
  { icon: Users, number: "+480", label: "Clientes atendidos" },
  { icon: Clock, number: "6+", label: "Años de experiencia" },
  { icon: HeartHandshake, number: "100%", label: "Atención personalizada" },
];

export function Stats() {
  return (
    <section className="border-y border-white/10">
      <StaggerContainer
        stagger={0.1}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-10 md:grid-cols-4"
      >
        {STATS.map(({ icon: Icon, number, label }) => (
          <StaggerItem key={label} className="flex items-center gap-4">
            <Icon size={28} className="text-[#1c62ff]" />
            <div>
              <div className="text-2xl font-bold text-white">{number}</div>
              <div className="text-xs text-[#8b9bb4]">{label}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
