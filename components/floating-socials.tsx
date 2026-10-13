"use client";

import { usePathname } from "next/navigation";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";

export function FloatingSocials() {
  const pathname = usePathname();
  // El configurador ya tiene su propia barra inferior fija (pasos, volver, checkout);
  // los botones flotantes se superponían y tapaban esos controles en mobile.
  if (pathname?.startsWith("/armatupc")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      <a
        href="https://wa.me/5493425117356"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition hover:scale-110"
      >
        <WhatsappIcon size={24} />
      </a>
      <a
        href="https://www.instagram.com/tesla.computacion/"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-black/40 transition hover:scale-110"
      >
        <InstagramIcon size={24} />
      </a>
    </div>
  );
}
