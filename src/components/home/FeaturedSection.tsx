import { useState } from 'react'
import type { Motorcycle } from '../../types'
import MotorcycleCard from '../motorcycle/MotorcycleCard'
import MotorcycleModal from '../motorcycle/MotorcycleModal'

interface FeaturedSectionProps {
  motorcycles: Motorcycle[]
}

export default function FeaturedSection({ motorcycles }: FeaturedSectionProps) {
  const [selected, setSelected] = useState<Motorcycle | null>(null)

  if (!motorcycles.length) return null

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.35em] uppercase text-[#ccc] mb-2">
              Selección especial
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#111] leading-none">
              Modelos<br />destacados
            </h2>
          </div>
          <a
            href="/motocicletas"
            className="font-display text-xs font-black tracking-widest uppercase text-[#999] hover:text-[#111] transition-colors flex items-center gap-2"
          >
            Ver catálogo completo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {motorcycles.map((moto) => (
            <MotorcycleCard
              key={moto.id}
              motorcycle={moto}
              onClick={setSelected}
            />
          ))}
        </div>
      </div>

      {selected && (
        <MotorcycleModal
          motorcycle={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  )
}
