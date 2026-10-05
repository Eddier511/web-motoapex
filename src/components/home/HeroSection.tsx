import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import type { HeroSlide } from '../../types'

interface HeroSectionProps {
  slides: HeroSlide[]
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length)
    setLoaded(false)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + slides.length) % slides.length)
    setLoaded(false)
  }, [slides.length])

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  const slide = slides[current] ?? slides[0]
  if (!slide) return null

  return (
    <section className="relative h-[62vh] min-h-[420px] max-h-[620px] overflow-hidden bg-[#111]">
      {/* Background image */}
      <picture key={slide.id}>
      {slide.mobileImageUrl && <source media="(max-width: 639px)" srcSet={slide.mobileImageUrl} />}
      <img
        key={slide.id}
        src={slide.imageUrl}
        alt={slide.alt}
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: loaded ? 0.7 : 0 }}
      />
      </picture>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Brand color accent at top */}
      {slide.accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-1 z-10"
          style={{ background: slide.accentColor }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-5 sm:px-8 md:px-14 pb-14 sm:pb-20">
        {slide.brandSlug && (
          <p
            className="font-display text-xs font-black tracking-[0.4em] uppercase mb-3"
            style={{ color: slide.accentColor ?? '#fff' }}
          >
            {slide.brandSlug}
          </p>
        )}
        <h1
          className="font-display font-black uppercase text-white leading-none mb-4"
          style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)' }}
        >
          {slide.title}
        </h1>
        <p className="text-white/70 text-base sm:text-lg max-w-lg leading-relaxed mb-8 sm:mb-10">
          {slide.subtitle}
        </p>
        <div className="flex gap-3 flex-wrap">
          {slide.ctaPrimary && <Link
            to={slide.ctaPrimary.href}
            className="font-display text-sm font-black tracking-widest uppercase px-7 py-3.5 text-white hover:opacity-85 transition-opacity"
            style={{ background: slide.accentColor ?? '#fff', color: slide.accentColor ? '#fff' : '#111' }}
          >
            {slide.ctaPrimary.label}
          </Link>}
          {slide.ctaSecondary && <Link
            to={slide.ctaSecondary.href}
            className="font-display text-sm font-black tracking-widest uppercase px-7 py-3.5 border-2 border-white/50 text-white hover:border-white hover:bg-white/10 transition-all"
          >
            {slide.ctaSecondary.label}
          </Link>}
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
            aria-label="Slide anterior"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
            aria-label="Siguiente slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-6 right-6 sm:right-8 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setLoaded(false) }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  background: i === current
                    ? (slides[i].accentColor ?? '#fff')
                    : 'rgba(255,255,255,0.35)',
                }}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
