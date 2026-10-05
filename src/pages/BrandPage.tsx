import { useState, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router'
import { useCatalog } from '../data/CatalogContext'
import CatalogStatus from '../components/CatalogStatus'
import MotorcycleCard from '../components/motorcycle/MotorcycleCard'
import MotorcycleModal from '../components/motorcycle/MotorcycleModal'
import type { Motorcycle } from '../types'

export default function BrandPage() {
  const { brands, motorcycles, loading, error } = useCatalog()
  const { brand: brandSlug } = useParams<{ brand: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<Motorcycle | null>(null)

  const brand = brands.find(b => b.slug === brandSlug)
  const allMotorcycles = motorcycles.filter(m => m.brandId === brand?.id)
  const activeCatSlug = searchParams.get('category') ?? ''

  const filtered = useMemo(() => {
    if (!activeCatSlug) return allMotorcycles
    return allMotorcycles.filter((m) => m.categoryId === brand?.categories.find(c => c.slug === activeCatSlug)?.id)
  }, [allMotorcycles, activeCatSlug, brand])

  if (loading || error) return <main className="pt-16 min-h-screen"><CatalogStatus /></main>

  if (!brand) {
    return (
      <div className="pt-24 text-center py-32">
        <p className="font-display text-5xl font-black uppercase text-[#eee] mb-4">404</p>
        <p className="text-[#aaa] mb-6">Marca no encontrada.</p>
        <Link to="/" className="font-display text-sm font-black tracking-widest uppercase px-6 py-3 bg-[#111] text-white">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const { primaryColor, secondaryColor, accentLight } = brand

  const setCategory = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug })
    } else {
      setSearchParams({})
    }
  }

  return (
    <main className="pt-16">
      {/* ── BRAND HERO ── */}
      <section
        className="relative w-full"
        style={{ minHeight: 'min(calc(100svh - 64px), 580px)', background: '#0A0A0A' }}
      >
        {/* Brand accent line — top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] z-20"
          style={{ background: primaryColor }}
        />

        {/* Motorcycle — absolute, decorative background element (right side) */}
        <div
          aria-hidden="true"
          className="brand-hero-moto absolute right-0 top-0 bottom-0 z-0"
          style={{ width: '62%' }}
        >
          {brand.heroImageUrl && <img
            src={brand.heroImageUrl}
            alt=""
            className="w-full h-full"
            style={{ objectFit: 'contain', objectPosition: 'right center' }}
          />}
          {/* Horizontal gradient: black → transparent */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, #0A0A0A 0%, #0A0A0Af2 10%, #0A0A0Acc 26%, #0A0A0A88 44%, #0A0A0A33 62%, transparent 85%)',
            }}
          />
          {/* Subtle bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '28%',
              background: 'linear-gradient(to top, #0A0A0Aaa, transparent)',
            }}
          />
        </div>

        {/* ── Content wrapper — in document flow, never clipped ── */}
        <div
          className="relative z-10 flex flex-col"
          style={{
            minHeight: 'min(calc(100svh - 64px), 580px)',
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
          }}
        >
          {/* Back link — top */}
          <div
            className="flex-shrink-0"
            style={{ padding: 'clamp(20px, 3vw, 48px) clamp(20px, 5vw, 80px) 0' }}
          >
            <Link
              to="/"
              className="font-display inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 hover:text-white/70 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              MotoApex
            </Link>
          </div>

          {/* Brand content block — vertically centered, grows with content */}
          <div
            className="flex-1 flex flex-col justify-center"
            style={{ padding: 'clamp(32px, 4vw, 64px) clamp(20px, 5vw, 80px)' }}
          >
            <div
              className="brand-hero-content flex flex-col"
              style={{
                maxWidth: 'min(520px, 46%)',
                gap: 'clamp(10px, 1.5vw, 20px)',
              }}
            >
              <p
                className="font-display font-bold uppercase"
                style={{
                  color: primaryColor,
                  fontSize: 'clamp(9px, 0.85vw, 11px)',
                  letterSpacing: '0.42em',
                }}
              >
                Distribuidor Oficial · Costa Rica
              </p>

              <h1
                className="font-display font-black uppercase text-white leading-[0.88]"
                style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
              >
                {brand.name}
              </h1>

              <p
                className="font-display text-white/50 italic leading-snug"
                style={{ fontSize: 'clamp(13px, 1.2vw, 18px)' }}
              >
                {brand.slogan ? `"${brand.slogan}"` : null}
              </p>

              <p
                className="text-white/35 leading-relaxed hidden sm:block"
                style={{ fontSize: 'clamp(11px, 1vw, 14px)', maxWidth: '38ch' }}
              >
                {brand.description}
              </p>

              <div
                className="flex flex-wrap"
                style={{ gap: 'clamp(8px, 1vw, 12px)', paddingTop: 'clamp(4px, 0.8vw, 12px)' }}
              >
                <a
                  href="#catalogo"
                  className="font-display font-black uppercase text-white hover:opacity-80 transition-opacity whitespace-nowrap"
                  style={{
                    background: primaryColor,
                    fontSize: 'clamp(10px, 0.85vw, 12px)',
                    letterSpacing: '0.18em',
                    padding: 'clamp(10px, 1vw, 14px) clamp(20px, 2.5vw, 32px)',
                  }}
                >
                  Ver Modelos
                </a>
                <a
                  href="#contacto"
                  className="font-display font-black uppercase text-white/70 hover:text-white border border-white/20 hover:border-white/50 transition-all whitespace-nowrap"
                  style={{
                    fontSize: 'clamp(10px, 0.85vw, 12px)',
                    letterSpacing: '0.18em',
                    padding: 'clamp(10px, 1vw, 14px) clamp(20px, 2.5vw, 32px)',
                  }}
                >
                  Cotizar
                </a>
              </div>
            </div>
          </div>

          {/* Bottom detail — safe margin guarantees it never touches edge */}
          <div
            className="flex-shrink-0 flex justify-end"
            style={{ padding: '0 clamp(20px, 5vw, 80px) clamp(20px, 2.5vw, 36px)' }}
          >
            <p
              className="font-display uppercase text-white/20 tracking-widest hidden sm:block"
              style={{ fontSize: 'clamp(9px, 0.75vw, 10px)', letterSpacing: '0.3em' }}
            >
              {brand.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalogo" className="bg-white">
        {/* Sticky category filter */}
        <div
          className="sticky top-16 z-30 bg-white"
          style={{
            borderBottom: `2px solid ${primaryColor}`,
            borderTop: '1px solid #f0f0f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-6">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setCategory('')}
                className="font-display text-xs sm:text-sm font-black tracking-widest uppercase px-4 sm:px-6 py-4 whitespace-nowrap transition-all relative flex-shrink-0"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: !activeCatSlug ? '#fff' : '#555',
                  background: !activeCatSlug ? primaryColor : 'transparent',
                }}
              >
                Todos
                {!activeCatSlug && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: primaryColor }} />
                )}
              </button>
              {brand.categories.map((cat) => {
                const isActive = activeCatSlug === cat.slug
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className="font-display text-xs sm:text-sm font-black tracking-widest uppercase px-4 sm:px-6 py-4 whitespace-nowrap transition-all relative flex-shrink-0"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: isActive ? '#fff' : '#555',
                      background: isActive ? primaryColor : 'transparent',
                    }}
                  >
                    {cat.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: primaryColor }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
            <div>
              <p className="font-display text-xs tracking-[0.35em] uppercase font-bold mb-1" style={{ color: primaryColor }}>
                {activeCatSlug
                  ? brand.categories.find((c) => c.slug === activeCatSlug)?.name
                  : 'Todos los modelos'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#111] leading-none">
                {filtered.length === 1 ? '1 modelo' : `${filtered.length} modelos`}
              </h2>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-4xl font-black uppercase text-[#eee] mb-3">Sin modelos</p>
              <p className="text-[#bbb] text-sm mb-6">No hay modelos en esta categoría.</p>
              <button
                onClick={() => setCategory('')}
                className="font-display text-sm font-black tracking-widest uppercase px-6 py-3 text-white"
                style={{ background: primaryColor }}
              >
                Ver todos
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((moto) => (
                <MotorcycleCard
                  key={moto.id}
                  motorcycle={moto}
                  onClick={setSelected}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand footer info */}
      <section className="py-12 sm:py-16 border-t border-[#eee]" style={{ background: accentLight }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-display text-xs tracking-[0.35em] uppercase mb-3" style={{ color: primaryColor }}>
            {brand.tagline}
          </p>
          <p className="text-[#777] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            {brand.description}
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <a
              href="#contacto"
              className="font-display text-sm font-black tracking-widest uppercase px-8 py-3.5 text-white hover:opacity-85 transition-opacity"
              style={{ background: primaryColor }}
            >
              Solicitar cotización
            </a>
            <a
              href={`https://wa.me/50688000000?text=Hola, me interesa un modelo de ${brand.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-sm font-black tracking-widest uppercase px-8 py-3.5 border-2 text-[#111] hover:bg-[#111] hover:text-white transition-all"
              style={{ borderColor: '#111' }}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {selected && (
        <MotorcycleModal motorcycle={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  )
}
