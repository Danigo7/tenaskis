'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import SectionText from '../ui/SectionTest'

type HeroButton = {
  text: string
  href: string
  variant: 'primary' | 'secondary'
}

type HeroProps = {
  eyebrow: string
  title: string
  description: string
  imageUrl?: string
  buttons?: HeroButton[]  // Botones opcionales y configurables
}

type HeroFitClamp = 'none' | 'title' | 'both'

const HERO_FIT_SCALES = [1, 0.92, 0.85, 0.78, 0.72, 0.66, 0.6, 0.55, 0.5, 0.45]

function useHeroFit(key: string) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return

    let raf = 0

    const measure = () => {
      // La key forma parte de la medición: cambia cuando cambia el contenido.
      content.dataset.heroFitKey = key

      const styles = window.getComputedStyle(frame)
      const paddingTop = parseFloat(styles.paddingTop) || 0
      const paddingBottom = parseFloat(styles.paddingBottom) || 0
      const available = frame.clientHeight - paddingTop - paddingBottom
      if (available <= 0) return

      const fits = () => content.getBoundingClientRect().height <= available
      const apply = (scale: number, clamp: HeroFitClamp) => {
        content.style.setProperty('--hero-fit', String(scale))
        content.dataset.heroClamp = clamp
      }

      let chosen = HERO_FIT_SCALES[0]
      let clamp: HeroFitClamp = 'none'
      let found = false

      for (const scale of HERO_FIT_SCALES) {
        apply(scale, 'none')
        if (fits()) {
          chosen = scale
          found = true
          break
        }
      }

      if (!found) {
        chosen = HERO_FIT_SCALES[HERO_FIT_SCALES.length - 1]
        apply(chosen, 'title')
        clamp = fits() ? 'title' : 'both'
      }

      apply(chosen, clamp)
    }

    const schedule = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(measure)
    }

    schedule()
    const observer = new ResizeObserver(schedule)
    observer.observe(frame)

    return () => {
      window.cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [key])

  return { frameRef, contentRef }
}

export default function Hero({ eyebrow, title, description, imageUrl, buttons }: HeroProps) {
  const fitKey = [
    eyebrow,
    title,
    description,
    buttons?.map((button) => button.text).join('|') ?? '',
  ].join('§')

  const { frameRef, contentRef } = useHeroFit(fitKey)

  return (
    <section className="home-section relative min-h-screen h-svh overflow-hidden">

      {/* ── FONDO ─────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden">

        {/* 1. Imagen principal del Hero + Su propia transición inferior + Opacidad */}
        {imageUrl ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              opacity: 0.55, // <-- Aquí le damos el toque justo de opacidad para que trasluzca la madera
              
              // Creamos un fundido suave: arriba 100% visible, abajo se desvanece por completo
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
            }}
          />
        ) : (
          <div className="h-full w-full bg-[var(--surface-soft)]" />
        )}

        {/* 2. Filtro oscuro sutil sobre TODO el Hero para la legibilidad del texto,
            reajustado para que acompañe bien a la opacidad de la imagen */}
        <div 
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-[rgba(0,0,0,0.3)] to-[rgba(0,0,0,0.55)]" 
        />

      </div>

      {/* ── CONTENIDO ─────────────────────────────────────── */}
      <div
        ref={frameRef}
        className="hero-fit-frame absolute inset-0 z-10 flex flex-col justify-end px-6 pb-30 pt-28 md:pb-24"
      >
        <div ref={contentRef} className="hero-fit mx-auto w-full max-w-6xl">

        {/* Eyebrow en dorado */}
        <p className="home-section__eyebrow">
          {eyebrow}
        </p>

        {/* Título hero: escala con breakpoints */}
        <h1 className="home-section__title max-w-3xl break-words">
          {title}
        </h1>

        {/* Descripción con el componente compartido */}
        <div className="mt-6">
          <SectionText>{description}</SectionText>
        </div>

        {/* ── BOTONES ─────────────────────────────────────── */}
        {/* Solo se renderizan si se pasan botones */}
        {buttons && buttons.length > 0 && (
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            {buttons.map((button) => (
              button.variant === 'primary' ? (

                /* Botón primario: fondo dorado, texto oscuro */
                <Link
                  key={button.href}
                  href={button.href}
                  className="home-section__button-primary px-8 py-3 text-center"
                >
                  {button.text}
                </Link>

              ) : (

                /* Botón secundario: borde sutil, texto apagado */
                <Link
                  key={button.href}
                  href={button.href}
                  className="home-section__button-secondary px-8 py-3 text-center"
                >
                  {button.text}
                </Link>

              )
            ))}

          </div>
        )}

        </div>
      </div>
    </section>
  )
}