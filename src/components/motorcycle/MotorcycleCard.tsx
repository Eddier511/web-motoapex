import { useState } from 'react'
import type { Motorcycle } from '../../types'
import { visiblePrice, formatPrice } from '../../api/catalog'

interface MotorcycleCardProps {
  motorcycle: Motorcycle
  onClick: (motorcycle: Motorcycle) => void
  compact?: boolean
}



export default function MotorcycleCard({ motorcycle, onClick, compact = false }: MotorcycleCardProps) {
  const [hovered, setHovered] = useState(false)
  const coverImage = motorcycle.colorOptions[0]?.images[0]
  const { brandColor } = motorcycle

  return (
    <div
      className="group bg-white border border-[#e8e8e8] overflow-hidden cursor-pointer flex flex-col transition-all duration-200"
      style={{ boxShadow: hovered ? `0 0 0 2px ${brandColor}` : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(motorcycle)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(motorcycle)}
    >
      {/* Brand accent top bar */}
      <div className="h-1" style={{ background: brandColor }} />

      {/* Image */}
      <div className={`relative overflow-hidden bg-[#f5f5f5] ${compact ? 'h-40' : 'h-52 sm:h-56'}`}>
        {coverImage ? (
          <img
            src={coverImage.url}
            alt={coverImage.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ opacity: 0.85 }}
          />
        ) : (
          <div className="w-full h-full bg-[#ececec]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {motorcycle.isNew && (
            <span
              className="font-display text-[9px] font-black tracking-widest uppercase px-2 py-0.5 text-white"
              style={{ background: brandColor }}
            >
              Nuevo
            </span>
          )}
          {motorcycle.colorOptions.length > 1 && (
            <span className="font-display text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-white/90 text-[#555]">
              {motorcycle.colorOptions.length} colores
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="mb-3 flex-1">
          <p className="text-xs text-[#888] mb-2">{{ available: 'Disponible', reserved: 'Reservado', 'coming-soon': 'Próximamente', 'sold-out': 'Agotado' }[motorcycle.availability]}</p>
          <p className="font-display text-xs font-bold tracking-widest uppercase mb-0.5"
            style={{ color: brandColor }}>
            {motorcycle.brandName} · {motorcycle.categoryName}
          </p>
          <h3 className="font-display text-sm sm:text-base font-black uppercase text-[#111] leading-tight">
            {motorcycle.model}
          </h3>
          {!compact && motorcycle.tagline && (
            <p className="text-[#bbb] text-xs italic mt-1 line-clamp-2">{motorcycle.tagline}</p>
          )}
        </div>

        {/* Specs row */}
        <div className="flex gap-3 mb-4">
          {motorcycle.cc && (
            <div>
              <p className="text-[9px] tracking-widest uppercase text-[#ccc]">CC</p>
              <p className="font-display text-sm font-bold text-[#333]">{motorcycle.cc}</p>
            </div>
          )}
          {motorcycle.hp && (
            <div>
              <p className="text-[9px] tracking-widest uppercase text-[#ccc]">HP</p>
              <p className="font-display text-sm font-bold text-[#333]">{motorcycle.hp}</p>
            </div>
          )}
          <div>
            <p className="text-[9px] tracking-widest uppercase text-[#ccc]">Año</p>
            <p className="font-display text-sm font-bold text-[#333]">{motorcycle.year}</p>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-4">
          {visiblePrice(motorcycle) !== undefined ? (
            <p className="font-display text-xl font-black text-[#111]">
              {formatPrice(visiblePrice(motorcycle)!, motorcycle.currency)}
              
            </p>
          ) : (
            <p className="font-display text-sm font-black text-[#888]">Precio no publicado</p>
          )}
          <button
            className="font-display text-[10px] font-black tracking-widest uppercase px-3 py-2 text-white hover:opacity-80 transition-opacity"
            style={{ background: brandColor }}
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  )
}

