import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import { BRANDS } from '../../data/mock'
import logoImg from '@/imports/motoapex-logo.png'

const NAV_LINKS = [
  { label: 'Motocicletas', href: '/motocicletas', hasMega: true },
  { label: 'Promociones', href: '/promociones', hasMega: false },
  { label: 'Usados', href: '/usados', hasMega: false },
  { label: 'Contacto', href: '#contacto', hasMega: false },
]

function MegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-0 right-0 bg-white border-t-2 border-[#e0e0e0] shadow-2xl z-50"
      style={{ borderTopColor: '#111' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-4 gap-8">
          {BRANDS.map((brand) => (
            <div key={brand.id}>
              {/* Brand header */}
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#f0f0f0]">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: brand.primaryColor }}
                />
                <Link
                  to={`/${brand.slug}`}
                  onClick={onClose}
                  className="font-display text-sm font-black tracking-widest uppercase hover:opacity-70 transition-opacity"
                  style={{ color: brand.primaryColor }}
                >
                  {brand.name}
                </Link>
              </div>
              {/* Categories */}
              <ul className="space-y-2">
                {brand.categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/${brand.slug}?category=${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-2 text-sm text-[#666] hover:text-[#111] transition-colors group py-0.5"
                    >
                      <svg
                        className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: brand.primaryColor }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        {cat.name}
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    to={`/${brand.slug}`}
                    onClick={onClose}
                    className="font-display text-xs font-black tracking-widest uppercase transition-colors"
                    style={{ color: brand.primaryColor }}
                  >
                    Ver todos los modelos →
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0]">
        <Link to="/" onClick={onClose} aria-label="Moto Apex Costa Rica — Inicio">
          <img src={logoImg} alt="Moto Apex Costa Rica" width={1254} height={1254} className="h-16 w-16 object-contain" />
        </Link>
        <button onClick={onClose} className="p-2 text-[#333]" aria-label="Cerrar menú">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-5 py-6 space-y-1">
        {/* Brands */}
        <p className="font-display text-xs tracking-[0.3em] uppercase text-[#ccc] mb-4">Motocicletas</p>
        {BRANDS.map((brand) => (
          <div key={brand.id} className="border-b border-[#f5f5f5]">
            <button
              className="w-full flex items-center justify-between py-4"
              onClick={() =>
                setExpandedBrand(expandedBrand === brand.id ? null : brand.id)
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: brand.primaryColor }}
                />
                <span
                  className="font-display text-base font-black tracking-widest uppercase"
                  style={{ color: brand.primaryColor }}
                >
                  {brand.name}
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-[#ccc] transition-transform ${expandedBrand === brand.id ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedBrand === brand.id && (
              <div className="pb-4 pl-6 space-y-3">
                {brand.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/${brand.slug}?category=${cat.slug}`}
                    onClick={onClose}
                    className="block text-sm text-[#666] py-1"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  to={`/${brand.slug}`}
                  onClick={onClose}
                  className="font-display block text-xs font-black tracking-widest uppercase pt-1"
                  style={{ color: brand.primaryColor }}
                >
                  Ver todos →
                </Link>
              </div>
            )}
          </div>
        ))}

        {/* Other links */}
        <div className="pt-4 space-y-1">
          {[
            { label: 'Catálogo completo', href: '/motocicletas' },
            { label: 'Promociones', href: '/promociones' },
            { label: 'Usados', href: '/usados' },
            { label: 'Contacto', href: '#contacto' },
          ].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className="font-display block text-sm font-bold tracking-widest uppercase text-[#555] py-3 border-b border-[#f5f5f5] hover:text-[#111] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="pt-6">
          <Link
            to="#contacto"
            onClick={onClose}
            className="font-display block w-full text-center text-sm font-black tracking-widest uppercase py-4 bg-[#111] text-white hover:bg-[#333] transition-colors"
          >
            Cotizar ahora
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()

  const activeBrand = BRANDS.find((b) => location.pathname === `/${b.slug}`)

  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }, [])

  const scheduleMegaClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMegaOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 bg-white transition-all duration-300"
        style={{
          borderBottom: activeBrand
            ? `3px solid ${activeBrand.primaryColor}`
            : '1px solid #e8e8e8',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" aria-label="Moto Apex Costa Rica — Inicio" className="flex items-center gap-3 flex-shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]">
            <img src={logoImg} alt="Moto Apex Costa Rica" width={1254} height={1254} fetchPriority="high" className="h-14 w-14 sm:h-[60px] sm:w-[60px] object-contain" />
            {activeBrand && (
              <span
                className="font-display hidden sm:inline text-xs font-black tracking-widest uppercase px-2.5 py-1 text-white"
                style={{ background: activeBrand.primaryColor }}
              >
                {activeBrand.name}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0" ref={megaRef}>
            {/* Brand quick links */}
            {BRANDS.map((brand) => (
              <Link
                key={brand.id}
                to={`/${brand.slug}`}
                className="font-display text-xs font-bold tracking-widest uppercase px-3 py-2 relative transition-colors duration-150"
                style={{
                  color: activeBrand?.id === brand.id ? brand.primaryColor : '#999',
                }}
              >
                {activeBrand?.id === brand.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: brand.primaryColor }}
                  />
                )}
                {brand.name}
              </Link>
            ))}

            <div className="w-px h-5 bg-[#e8e8e8] mx-2" />

            {/* Mega trigger */}
            <button
              className="font-display text-xs font-bold tracking-widest uppercase px-3 py-2 text-[#555] hover:text-[#111] transition-colors flex items-center gap-1.5"
              onMouseEnter={openMega}
              onMouseLeave={scheduleMegaClose}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Modelos
              <svg
                className={`w-3 h-3 transition-transform ${megaOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {NAV_LINKS.filter((l) => !l.hasMega).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-display text-xs font-bold tracking-widest uppercase px-3 py-2 text-[#999] hover:text-[#111] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#contacto"
              className="hidden md:inline-flex font-display text-xs font-black tracking-widest uppercase px-4 sm:px-5 py-2.5 text-white bg-[#111] hover:bg-[#333] transition-colors"
            >
              Cotizar
            </a>
            {/* Hamburger */}
            <button
              className="lg:hidden p-2 text-[#333]"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span className="block h-px bg-current" />
                <span className="block h-px bg-current" />
                <span className="block h-px bg-current" />
              </div>
            </button>
          </div>
        </div>

        {/* Mega menu */}
        {megaOpen && (
          <div
            onMouseEnter={openMega}
            onMouseLeave={scheduleMegaClose}
          >
            <MegaMenu onClose={() => setMegaOpen(false)} />
          </div>
        )}
      </header>

      {/* Mobile menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
