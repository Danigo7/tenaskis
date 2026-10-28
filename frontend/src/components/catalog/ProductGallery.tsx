'use client'

import { useState, useCallback } from 'react'

type GalleryImage = {
  url: string
  alt: string
  principal: boolean
}

type Props = {
  images: GalleryImage[]
  nombre: string
}

export default function ProductGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#141414]">
        <p className="text-white/20 text-sm tracking-widest uppercase text-xs">
          Sin imágenes
        </p>
      </div>
    )
  }

  const active = images[activeIndex]
  const hasMultiple = images.length > 1

  return (
    <div className="relative w-full h-full flex flex-col bg-[#141414]">

      {/* ── Imagen activa ──────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <img
          key={activeIndex}
          src={active.url}
          alt={active.alt}
          className="w-full h-full object-cover animate-fade-in"
          style={{ animation: 'fadeIn 0.4s ease' }}
        />

        {/* Flechas de navegación — solo si hay más de una imagen */}
        {hasMultiple && (
          <>
            {/* Flecha izquierda */}
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="
                absolute left-4 top-1/2 -translate-y-1/2
                w-10 h-10 flex items-center justify-center
                bg-[var(--overlay-medium)] backdrop-blur-sm
                text-[var(--text-muted)] hover:text-[var(--foreground)]
                border border-[var(--border)] hover:border-[var(--border-hover)]
                transition-all duration-200
              "
            >
              ←
            </button>

            {/* Flecha derecha */}
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                w-10 h-10 flex items-center justify-center
                bg-[#0F0F0F]/60 backdrop-blur-sm
                text-white/70 hover:text-white
                border border-white/10 hover:border-white/30
                transition-all duration-200
              "
            >
              →
            </button>

            {/* Indicadores de puntos */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Ir a imagen ${i + 1}`}
                  className={`
                    transition-all duration-300
                    ${i === activeIndex
                      ? 'w-6 h-1.5 bg-[var(--accent)]'
                      : 'w-1.5 h-1.5 bg-[var(--text-soft)] hover:bg-[var(--text-muted)]'
                    }
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Miniaturas — solo mobile, debajo de la imagen ─ */}
      {hasMultiple && (
        <div className="shrink-0 lg:hidden flex gap-1.5 p-3 bg-[var(--background)] overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`
                shrink-0 w-14 h-14 overflow-hidden transition
                ${i === activeIndex
                ? 'ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--background)]'
                : 'opacity-40 hover:opacity-70'
                }
              `}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}