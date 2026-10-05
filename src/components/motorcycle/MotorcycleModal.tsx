import { useState, useEffect } from 'react'
import type { Motorcycle } from '../../types'
import { visiblePrice, formatPrice } from '../../api/catalog'
import Gallery from './Gallery'
import ColorSelector from './ColorSelector'
import SpecsSection from './SpecsSection'
import LeadForm from '../LeadForm'

interface MotorcycleModalProps {
  motorcycle: Motorcycle
  onClose: () => void
}



export default function MotorcycleModal({ motorcycle, onClose }: MotorcycleModalProps) {
  const { brandColor, colorOptions, specs } = motorcycle
  const [activeColorId, setActiveColorId] = useState(colorOptions[0]?.id ?? '')

  const activeColor = colorOptions.find((c) => c.id === activeColorId) ?? colorOptions[0]
  const images = activeColor?.images ?? []

  // Lock body scroll
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  const handleColorChange = (colorId: string) => {
    setActiveColorId(colorId)
  }

  const availLabel: Record<string, string> = {
    available: 'Disponible',
    reserved: 'Reservado',
    'sold-out': 'Agotado',
    'coming-soon': 'Próximamente',
  }

  const availColor: Record<string, string> = {
    available: '#16a34a',
    reserved: '#d97706',
    'sold-out': '#dc2626',
    'coming-soon': '#6b7280',
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-6xl flex flex-col"
        style={{
          height: 'min(95dvh, 800px)',
          borderTop: `4px solid ${brandColor}`,
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#f0f0f0] flex-shrink-0 bg-white z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span
              className="font-display text-xs font-black tracking-widest uppercase text-white px-2 py-1 flex-shrink-0"
              style={{ background: brandColor }}
            >
              {motorcycle.brandName}
            </span>
            <span className="text-[#ccc] hidden sm:block">/</span>
            <span className="font-display text-sm sm:text-base font-black uppercase text-[#111] truncate">
              {motorcycle.model}
            </span>
            <span className="text-[#ccc] text-sm hidden sm:block">{motorcycle.year}</span>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 w-9 h-9 flex items-center justify-center text-[#888] hover:text-[#111] hover:bg-[#f5f5f5] transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — split layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Gallery — left / top */}
          <div className="flex-1 lg:flex-none lg:w-[58%] flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-[#f0f0f0]"
            style={{ maxHeight: '55%', flex: '0 0 55%' }}
          >
            <div className="flex-1 min-h-0 lg:max-h-none" style={{ maxHeight: 'calc(55vh - 60px)' }}>
              <Gallery key={activeColorId} images={images} brandColor={brandColor} />
            </div>
          </div>

          {/* Details — right / bottom */}
          <div className="flex-1 overflow-y-auto lg:w-[42%] min-h-0 flex flex-col">
            <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
              {/* Title block */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#111] leading-none">
                    {motorcycle.model}
                  </h2>
                  {motorcycle.isNew && (
                    <span
                      className="font-display text-[10px] font-black tracking-widest uppercase px-2 py-1 text-white flex-shrink-0"
                      style={{ background: brandColor }}
                    >
                      Nuevo
                    </span>
                  )}
                </div>
                <p className="text-[#888] text-sm italic">{motorcycle.tagline}</p>
              </div>

              {/* Color selector */}
              {colorOptions.length > 1 && (
                <ColorSelector
                  colors={colorOptions}
                  activeId={activeColorId}
                  brandColor={brandColor}
                  onChange={handleColorChange}
                />
              )}

              {/* Price & availability */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                {visiblePrice(motorcycle) !== undefined ? (
                  <div>
                    {motorcycle.showPrice && motorcycle.promoPrice !== undefined && motorcycle.price !== undefined && <p className="text-sm text-[#888] line-through">{formatPrice(motorcycle.price, motorcycle.currency)}</p>}
                    <p className="font-display text-3xl sm:text-4xl font-black text-[#111] leading-none">
                      {formatPrice(visiblePrice(motorcycle)!, motorcycle.currency)}
                    </p>
                    <p className="text-xs text-[#bbb] mt-1">{motorcycle.currency} · Precio de referencia</p>
                  </div>
                ) : (
                  <p className="font-display text-xl font-black text-[#888]">Precio no publicado</p>
                )}
                <span
                  className="font-display text-xs font-black tracking-widest uppercase px-3 py-1.5"
                  style={{
                    color: availColor[motorcycle.availability],
                    background: `${availColor[motorcycle.availability]}18`,
                  }}
                >
                  {availLabel[motorcycle.availability]}
                </span>
              </div>

              {/* Quick specs */}
              {(motorcycle.cc || motorcycle.hp) && (
                <div
                  className="flex gap-6 py-4 px-4 border-l-2"
                  style={{ borderColor: brandColor, background: `${brandColor}08` }}
                >
                  {motorcycle.cc && (
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#bbb] mb-0.5">Cilindraje</p>
                      <p className="font-display text-xl font-black text-[#111]">{motorcycle.cc} cc</p>
                    </div>
                  )}
                  {motorcycle.hp && (
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#bbb] mb-0.5">Potencia</p>
                      <p className="font-display text-xl font-black text-[#111]">{motorcycle.hp} HP</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-[#bbb] mb-0.5">Año</p>
                    <p className="font-display text-xl font-black text-[#111]">{motorcycle.year}</p>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-[#666] leading-relaxed">{motorcycle.description}</p>

              {/* Specs */}
              {specs.length > 0 && (
                <SpecsSection specs={specs} brandColor={brandColor} />
              )}

              <LeadForm key={motorcycle.id} motorcycle={motorcycle} />

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-2">
                {motorcycle.allowQuote && <a
                  href={`https://wa.me/50688000000?text=Hola, me interesa la ${motorcycle.brandName} ${motorcycle.model} ${motorcycle.year}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display flex-1 text-center text-sm font-black tracking-widest uppercase py-3.5 text-white hover:opacity-85 transition-opacity"
                  style={{ background: brandColor }}
                >
                  Cotizar por WhatsApp
                </a>}
                <a
                  href="#contacto"
                  onClick={onClose}
                  className="font-display flex-1 text-center text-sm font-black tracking-widest uppercase py-3.5 border-2 text-[#111] hover:bg-[#111] hover:text-white transition-colors"
                  style={{ borderColor: '#111' }}
                >
                  Contactar asesor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

