"use client";

import { useState } from "react";
import Image from "next/image";

export function PhotoGallery({ photoIds }: { photoIds: string[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (photoIds.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-xl overflow-hidden">
        {photoIds.map((id, i) => (
          <button
            key={id}
            onClick={() => setLightboxIdx(i)}
            className="relative aspect-square overflow-hidden bg-bg-card transition-all hover:brightness-110"
          >
            <Image
              src={`/api/photos/${id}`}
              alt={`Burger photo ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10"
            onClick={() => setLightboxIdx(null)}
          >
            &times;
          </button>

          {lightboxIdx > 0 && (
            <button
              className="absolute left-4 text-white/70 hover:text-white text-3xl z-10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev !== null ? prev - 1 : null));
              }}
            >
              &#8249;
            </button>
          )}

          {lightboxIdx < photoIds.length - 1 && (
            <button
              className="absolute right-4 text-white/70 hover:text-white text-3xl z-10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev !== null ? prev + 1 : null));
              }}
            >
              &#8250;
            </button>
          )}

          <div className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`/api/photos/${photoIds[lightboxIdx]}`}
              alt={`Burger photo ${lightboxIdx + 1}`}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
