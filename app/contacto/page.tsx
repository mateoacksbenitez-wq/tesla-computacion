import type { Metadata } from "next";
import Link from "next/link";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Contacto | Tesla Computación",
};

const FAQS = [
  {
    q: "¿Cuánto tarda el armado de una PC a medida?",
    a: "Depende de la disponibilidad de componentes, pero en general entre 2 y 5 días hábiles desde que confirmás el pedido.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí, enviamos de forma segura a todo el país. Coordinamos el método de envío por WhatsApp según tu ubicación.",
  },
  {
    q: "¿Puedo llevar mi PC solo para un service o upgrade?",
    a: "Sí, hacemos service de mantenimiento, limpieza, upgrades y reparación de GPU y PlayStation 5, sin necesidad de comprar una PC nueva.",
  },
  {
    q: "¿Cómo sé qué componentes necesito?",
    a: "Usá el configurador \"Armá tu PC\" para que te ayude a filtrar según tu uso, o escribinos por WhatsApp y te asesoramos según tu presupuesto.",
  },
];

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
      <FadeIn className="mb-14 text-center">
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#8b9bb4] uppercase">
          Asesoría y contacto
        </p>
        <h1 className="mb-4 text-3xl font-bold uppercase md:text-4xl">
          Hablemos de tu <span className="text-[#1c62ff]">próxima PC</span>
        </h1>
        <p className="mx-auto mb-8 max-w-md text-sm text-[#8b9bb4]">
          Escribinos por WhatsApp y te asesoramos sin compromiso, o visitanos
          en el local en Barrio Constituyentes, Santa Fe Capital.
        </p>
        <Link
          href="https://wa.me/5493425117356"
          target="_blank"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
        >
          <WhatsappIcon size={18} />
          Escribinos por WhatsApp
        </Link>
      </FadeIn>

      <FadeIn delay={0.1} className="mb-14">
        <h2 className="mb-3 text-center text-xl font-bold uppercase">
          Dónde <span className="text-[#1c62ff]">estamos</span>
        </h2>
        <p className="mb-6 text-center text-sm text-[#8b9bb4]">
          Barrio Constituyentes, Santa Fe Capital · Visitanos en nuestro
          taller
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,20,40,0.85)] shadow-2xl">
          <iframe
            width="100%"
            height="380"
            loading="lazy"
            className="block border-0"
            src="https://maps.google.com/maps?q=Tesla%20Computaci%C3%B3n,%20Santa%20Fe&t=&z=15&ie=UTF8&iwloc=&output=embed"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <h2 className="mb-6 text-center text-xl font-bold uppercase">
          Preguntas <span className="text-[#1c62ff]">frecuentes</span>
        </h2>
        <Accordion className="mx-auto max-w-2xl">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={i}>
              <AccordionTrigger className="text-left text-sm font-semibold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#8b9bb4]">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeIn>
    </div>
  );
}
