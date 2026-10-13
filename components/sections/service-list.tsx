import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/fade-in";

export interface ServiceListItem {
  icon: LucideIcon;
  titulo: string;
  desc: string;
  href: string;
  external?: boolean;
}

export function ServiceList({ items }: { items: ServiceListItem[] }) {
  return (
    <StaggerContainer className="flex flex-col divide-y divide-white/8 border-y border-white/8">
      {items.map(({ icon: Icon, titulo, desc, href, external }, i) => (
        <StaggerItem key={titulo}>
          <Link
            href={href}
            target={external ? "_blank" : undefined}
            className="group relative flex items-center gap-5 overflow-hidden py-6 pr-4 pl-2 transition-colors duration-300 hover:bg-[#1c62ff]/[0.06] sm:gap-8 sm:py-8"
          >
            <span className="font-heading w-10 shrink-0 text-2xl font-bold text-white/15 tabular-nums transition-colors duration-300 group-hover:text-[#1c62ff]/40 sm:w-16 sm:text-4xl">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="glass-panel flex h-12 w-12 shrink-0 items-center justify-center rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-16 sm:w-16">
              <Icon size={22} className="text-[#1c62ff] sm:size-7" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-heading mb-1 text-sm font-bold tracking-tight sm:text-lg">
                {titulo}
              </h3>
              <p className="text-xs leading-relaxed text-[#8b9bb4] sm:text-sm">{desc}</p>
            </div>

            <span className="shrink-0 translate-x-0 text-[#1c62ff] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
              →
            </span>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
