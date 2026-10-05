import { useState } from 'react'
import { Link } from 'react-router'
import type { Brand } from '../../types'

interface BrandsSectionProps {
  brands: Brand[]
}

function BrandCard({ brand }: { brand: Brand }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/${brand.slug}`}
      className="group relative overflow-hidden block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-[#111]">
        <img
          src={brand.tileImageUrl}
          alt={brand.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: hovered ? 0.6 : 0.75 }}
        />
        {/* Gradient */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to top, ${brand.primaryColor}dd 0%, ${brand.primaryColor}44 40%, transparent 100%)`,
            opacity: hovered ? 0.9 : 0.7,
          }}
        />
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: brand.primaryColor }} />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <p
            className="font-display text-xs font-bold tracking-[0.35em] uppercase text-white/70 mb-1"
          >
            {brand.tagline}
          </p>
          <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-white leading-none mb-3">
            {brand.name}
          </h3>
          <div
            className="flex items-center gap-2 font-display text-xs font-black tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span>Explorar modelos</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 flex-wrap px-4 py-3 bg-white border-t border-[#e8e8e8]"
        style={{ borderBottomColor: hovered ? brand.primaryColor : '#e8e8e8', borderBottomWidth: 2 }}>
        {brand.categories.slice(0, 4).map((cat) => (
          <span
            key={cat.id}
            className="font-display text-[9px] font-black tracking-widest uppercase px-2.5 py-1 transition-all duration-200"
            style={{
              background: hovered ? `${brand.primaryColor}15` : '#f5f5f5',
              color: hovered ? brand.primaryColor : '#999',
            }}
          >
            {cat.name}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default function BrandsSection({ brands }: BrandsSectionProps) {
  return (
    <section className="py-14 sm:py-20 bg-[#f7f7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 sm:mb-14 flex-wrap gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.35em] uppercase text-[#ccc] mb-2">
              Nuestras marcas
            </p>
            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-[#111] leading-none">
              Elige tu<br />experiencia
            </h2>
          </div>
          <p className="text-[#aaa] text-sm max-w-xs leading-relaxed">
            Distribuidores oficiales de las marcas más apasionantes del motociclismo mundial.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}
