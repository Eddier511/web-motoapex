import { useState } from 'react'
import type { Motorcycle } from '../../types'
import { visiblePrice } from '../../api/catalog'

interface MotorcycleCardProps {
  motorcycle: Motorcycle
  onClick: (motorcycle: Motorcycle) => void
  compact?: boolean
}

const availabilityLabel = {
  available: 'Disponible', reserved: 'Reservado', 'sold-out': 'Agotado', 'coming-soon': 'Próximamente',
}

function cardPrice(amount: number, currency: string) {
  const symbol = currency === 'USD' ? '$' : currency === 'CRC' ? '₡' : ''
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })}`
}

export default function MotorcycleCard({ motorcycle, onClick, compact = false }: MotorcycleCardProps) {
  const { brandColor, colorOptions } = motorcycle
  const [activeColorId, setActiveColorId] = useState(colorOptions[0]?.id ?? '')
  const activeColor = colorOptions.find(color => color.id === activeColorId) ?? colorOptions[0]
  const coverImage = activeColor?.images[0]
  const price = visiblePrice(motorcycle)
  const titleHasYear = new RegExp(`\\b${motorcycle.year}\\b`).test(motorcycle.model)
  const openModel = () => onClick({
    ...motorcycle,
    // Open the detail gallery in the color selected on this card.
    colorOptions: activeColor ? [activeColor, ...colorOptions.filter(color => color.id !== activeColor.id)] : colorOptions,
  })

  return (
    <div
      className="group bg-white border border-[#e6e6e6] overflow-hidden cursor-pointer flex flex-col transition-shadow duration-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4"
      onClick={openModel}
      role="button"
      tabIndex={0}
      aria-label={`Ver modelo ${motorcycle.brandName} ${motorcycle.model}`}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openModel() }
      }}
    >
      <div className="h-1 shrink-0" style={{ background: brandColor }} />

      {/* Keep every part of the supplied photo visible, including embedded brand artwork. */}
      <div className={`relative bg-[#f3f3f3] ${compact ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
        {coverImage ? (
          <img
            src={coverImage.url}
            alt={coverImage.alt || `${motorcycle.brandName} ${motorcycle.model}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-2 sm:p-3"
          />
        ) : <div className="absolute inset-0 flex items-center justify-center text-sm text-[#888]">Sin imagen para este color</div>}
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="font-display text-[10px] font-black tracking-[0.15em] uppercase bg-[#111] text-white px-2.5 py-1">{motorcycle.categoryName}</span>
          <span className="text-[11px] text-[#888]">{availabilityLabel[motorcycle.availability]}</span>
        </div>

        <div className="flex-1">
          <div className="font-display text-2xl sm:text-[28px] font-black uppercase text-[#111] leading-tight mb-3">
            <h3 className="inline">{motorcycle.model}</h3>
            {!titleHasYear && <span> {motorcycle.year}</span>}
          </div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: brandColor }}>{motorcycle.brandName}</p>
          {!compact && <p className="text-[#888] text-sm leading-relaxed line-clamp-3 min-h-[4.5em]">{motorcycle.shortDescription || motorcycle.description || motorcycle.tagline}</p>}
        </div>

        {colorOptions.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap mt-5" aria-label="Opciones de color">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#999]">Colores</span>
            <div className="flex gap-2.5 flex-wrap">
              {colorOptions.map(color => <button
                key={color.id}
                type="button"
                aria-label={`Ver color ${color.name}`}
                aria-pressed={color.id === activeColor?.id}
                title={`${color.name}${color.available === false ? ' · No disponible' : ''}`}
                onClick={event => { event.stopPropagation(); setActiveColorId(color.id) }}
                className="w-5 h-5 rounded-full border-2 border-white transition-shadow focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ background: color.hex, boxShadow: color.id === activeColor?.id ? `0 0 0 1.5px ${brandColor}` : '0 0 0 1px #ddd' }}
              />)}
            </div>
            <span className="text-xs text-[#888]">{activeColor?.name}{activeColor?.available === false ? ' · No disponible' : ''}</span>
          </div>
        )}

        <div className="flex items-end justify-between gap-3 flex-wrap border-t border-[#ededed] mt-6 pt-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#aaa] mb-1">Precio</p>
            {price !== undefined ? <p className="font-display text-3xl font-black text-[#111] leading-none">
              {cardPrice(price, motorcycle.currency)}<span className="text-[10px] text-[#aaa] font-bold ml-1.5">{motorcycle.currency}</span>
            </p> : <p className="font-display text-sm font-bold text-[#888]">Precio no publicado</p>}
          </div>
          <span className="font-display text-xs font-black tracking-[0.15em] uppercase py-1 group-hover:underline underline-offset-4" style={{ color: brandColor }}>Ver modelo →</span>
        </div>
      </div>
    </div>
  )
}
