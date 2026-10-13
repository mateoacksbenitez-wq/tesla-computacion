"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FOTOS = Array.from(
  { length: 15 },
  (_, i) => `/images/taller/taller${i + 1}.jpg`
).filter(
  (src) =>
    ![
      "/images/taller/taller4.jpg",
      "/images/taller/taller5.jpg",
      "/images/taller/taller6.jpg",
      "/images/taller/taller7.jpg",
    ].includes(src)
);

export function TallerCarousel({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % FOTOS.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className}>
      <div className="relative h-[380px] w-full overflow-hidden rounded-2xl bg-[#0a1128] md:h-[480px]">
        {FOTOS.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Taller Tesla Computación"
            fill
            className="object-cover transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={i === 0}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {FOTOS.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            aria-label={`Foto ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-[#1c62ff]" : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
