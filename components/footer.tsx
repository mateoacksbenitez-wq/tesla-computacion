import Image from "next/image";
import { MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(28,98,255,0.06)_0%,transparent_50%)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-14 text-center md:flex-row md:justify-between md:text-left">
        <Image
          src="/images/logo-blanco-solido.png"
          alt="Tesla"
          width={140}
          height={40}
          className="h-9 w-auto object-contain"
        />
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/tesla.computacion/"
            target="_blank"
            rel="noreferrer"
            className="text-[#8b9bb4] transition hover:text-white"
            aria-label="Instagram"
          >
            <InstagramIcon size={20} />
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 border-t border-white/10 px-5 py-5 pb-24 text-center text-xs text-[#8b9bb4] md:flex-row md:justify-between md:pb-5">
        <p>© {new Date().getFullYear()} Tesla Computación. Todos los derechos reservados.</p>
        <p className="flex items-center gap-1">
          <MapPin size={14} />
          <a
            href="https://maps.app.goo.gl/Ah2QNaw8gM8JTATh6"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/30 underline-offset-4 hover:text-white"
          >
            Barrio Constituyentes, Santa Fe Capital
          </a>
        </p>
      </div>
    </footer>
  );
}
