import { useState, useEffect, useCallback } from 'react'
import type { MotorcycleImage } from '../../types'

interface GalleryProps {
  images: MotorcycleImage[]
  brandColor: string
  onImageChange?: (index: number) => void
}

export default function Gallery({ images, brandColor, onImageChange }: GalleryProps) {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // Reset to first image when images array changes (color switch)
  useEffect(() => {
    setCurrent(0)
    setLoaded(false)
  }, [images])

  const go = useCallback(
    (index: number) => {
      const next = (index + images.length) % images.length
      setCurrent(next)
      setLoaded(false)
      onImageChange?.(next)
    },
    [images.length, onImageChange],
  )

  const prev = useCallback(() => go(current - 1), [current, go])
  const next = useCallback(() => go(current + 1), [current, go])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prev, next])

  // Touch swipe
  useEffect(() => {
    let startX = 0
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }
    const onTouchEnd = (e: TouchEvent) => {
      const delta = startX - e.changedTouches[0].clientX
      if (Math.abs(delta) > 50) delta > 0 ? next() : prev()
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [prev, next])

  if (!images.length) return null

  const img = images[current]

  return (
    <div className="flex flex-col h-full">
      {/* Main image — CRITICAL: object-contain so image never overflows */}
      <div className="flex-1 relative bg-[#f5f5f5] flex items-center justify-center min-h-0 overflow-hidden">
        <img
          key={img.id}
          src={img.url}
          alt={img.alt}
          onLoad={() => setLoaded(true)}
          className="max-w-full max-h-full transition-opacity duration-300"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: loaded ? 1 : 0,
          }}
        />

        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-[#f0f0f0] animate-pulse" />
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-white/90 hover:bg-white shadow-md transition-all hover:scale-105 z-10"
              aria-label="Imagen anterior"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: brandColor }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-white/90 hover:bg-white shadow-md transition-all hover:scale-105 z-10"
              aria-label="Siguiente imagen"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: brandColor }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter badge */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 font-display text-xs font-bold bg-black/50 text-white px-2 py-1 tracking-widest">
            {current + 1} / {images.length}
          </span>
        )}

        {/* Label */}
        {img.label && (
          <span className="absolute bottom-3 left-3 font-display text-xs font-bold tracking-widest uppercase bg-black/50 text-white px-2 py-1">
            {img.label}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 p-2 sm:p-3 bg-[#f8f8f8] overflow-x-auto flex-shrink-0">
          {images.map((image, i) => (
            <button
              key={image.id}
              onClick={() => go(i)}
              className="flex-shrink-0 w-14 h-10 sm:w-16 sm:h-12 overflow-hidden transition-all duration-150"
              style={{
                outline: i === current ? `2px solid ${brandColor}` : '2px solid transparent',
                outlineOffset: '1px',
                opacity: i === current ? 1 : 0.55,
              }}
              aria-label={image.alt}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators for small counts */}
      {images.length > 1 && images.length <= 6 && (
        <div className="flex justify-center gap-1.5 py-2 bg-[#f8f8f8]">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-150"
              style={{
                width: i === current ? 16 : 6,
                height: 6,
                background: i === current ? brandColor : '#ccc',
              }}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
