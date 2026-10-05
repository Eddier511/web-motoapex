import type { ColorOption } from '../../types'

interface ColorSelectorProps {
  colors: ColorOption[]
  activeId: string
  brandColor: string
  onChange: (colorId: string) => void
}

export default function ColorSelector({ colors, activeId, brandColor, onChange }: ColorSelectorProps) {
  if (colors.length <= 1) return null

  const active = colors.find((c) => c.id === activeId)

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-[#aaa]">
          Color:
        </p>
        <p className="font-display text-xs font-bold tracking-widest uppercase text-[#333]">
          {active?.name}{active?.available === false ? ' · No disponible' : ''}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onChange(color.id)}
            title={`${color.name}${color.available === false ? ' · No disponible' : ''}`}
            className="transition-all duration-150 relative"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: color.hex,
              boxShadow:
                color.id === activeId
                  ? `0 0 0 2px white, 0 0 0 4px ${brandColor}`
                  : '0 0 0 1.5px #d0d0d0',
              transform: color.id === activeId ? 'scale(1.15)' : 'scale(1)',
            }}
            aria-label={`Color ${color.name}`}
            aria-pressed={color.id === activeId}
          />
        ))}
      </div>
    </div>
  )
}

