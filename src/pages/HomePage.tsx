import { BRANDS, HERO_SLIDES, getFeaturedMotorcycles, PROMOTIONS } from '../data/mock'
import HeroSection from '../components/home/HeroSection'
import BrandsSection from '../components/home/BrandsSection'
import FeaturedSection from '../components/home/FeaturedSection'
import { Link } from 'react-router'

export default function HomePage() {
  const featured = getFeaturedMotorcycles()

  return (
    <main>
      <HeroSection slides={HERO_SLIDES} />

      {/* Stats strip */}
      <section className="bg-[#111] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { v: '15+', l: 'Años en el mercado' },
            { v: '4', l: 'Marcas oficiales' },
            { v: '500+', l: 'Motos vendidas' },
            { v: '98%', l: 'Satisfacción' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-black text-white mb-0.5">{s.v}</p>
              <p className="font-display text-xs tracking-widest uppercase text-white/30">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <BrandsSection brands={BRANDS} />

      {/* Promotions */}
      {PROMOTIONS.length > 0 && (
        <section className="bg-white border-t border-[#ebebeb] py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-display text-xs tracking-[0.35em] uppercase text-[#ccc] mb-1">Ofertas activas</p>
                <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#111] leading-none">Promociones</h2>
              </div>
              <Link
                to="/motocicletas"
                className="font-display text-[10px] font-black tracking-widest uppercase text-[#bbb] hover:text-[#111] transition-colors flex items-center gap-1.5"
              >
                Ver todas
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {PROMOTIONS.map((promo) => {
                const brand = BRANDS.find((b) => b.id === promo.brandId)
                const saving = promo.originalPrice && promo.promoPrice
                  ? promo.originalPrice - promo.promoPrice
                  : null

                return (
                  <Link
                    key={promo.id}
                    to={promo.href}
                    className="group relative bg-[#0d0d0d] flex overflow-hidden hover:bg-[#1a1a1a] transition-colors"
                  >
                    {/* Brand color left bar */}
                    <div
                      className="w-1 flex-shrink-0 self-stretch"
                      style={{ background: brand?.primaryColor ?? '#444' }}
                    />

                    {/* Image */}
                    <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden">
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity group-hover:scale-105 duration-500"
                        style={{ minHeight: '120px' }}
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d0d]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-5 py-5 flex flex-col justify-between">
                      <div>
                        {brand && (
                          <p
                            className="font-display text-[9px] font-black tracking-[0.4em] uppercase mb-1.5"
                            style={{ color: brand.primaryColor }}
                          >
                            {brand.name}
                          </p>
                        )}
                        <h3 className="font-display text-sm sm:text-base font-black uppercase text-white leading-tight mb-1.5">
                          {promo.title}
                        </h3>
                        <p className="text-white/35 text-xs leading-relaxed line-clamp-2">
                          {promo.description}
                        </p>
                      </div>

                      <div className="flex items-end justify-between mt-4 flex-wrap gap-2">
                        {promo.promoPrice ? (
                          <div>
                            {promo.originalPrice && (
                              <p className="text-white/20 text-xs line-through leading-none mb-0.5">
                                ${promo.originalPrice.toLocaleString('en-US')}
                              </p>
                            )}
                            <div className="flex items-baseline gap-2">
                              <p className="font-display text-xl font-black text-white leading-none">
                                ${promo.promoPrice.toLocaleString('en-US')}
                              </p>
                              <span className="font-display text-[9px] tracking-widest uppercase text-white/30">USD</span>
                            </div>
                            {saving && (
                              <p
                                className="font-display text-[9px] font-black tracking-widest uppercase mt-1"
                                style={{ color: brand?.primaryColor ?? '#fff' }}
                              >
                                Ahorrás ${saving.toLocaleString('en-US')}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div />
                        )}
                        <span
                          className="font-display text-[10px] font-black tracking-widest uppercase px-4 py-2 text-white group-hover:opacity-80 transition-opacity"
                          style={{ background: brand?.primaryColor ?? '#333' }}
                        >
                          {promo.cta}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <FeaturedSection motorcycles={featured} />

      {/* Why MotoApex */}
      <section className="py-14 sm:py-20 bg-white border-t border-[#eee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8 sm:gap-12">
          {[
            {
              title: 'Distribuidores oficiales',
              text: 'Somos el canal oficial de Ducati, KTM, Husqvarna y GASGAS en Costa Rica. Garantía de fábrica en cada motocicleta.',
            },
            {
              title: 'Taller especializado',
              text: 'Técnicos certificados por cada marca. Servicio de mantenimiento, reparación y preparación de motos de competición.',
            },
            {
              title: 'Financiamiento',
              text: 'Planes de financiamiento flexibles con las mejores tasas del mercado. Entrega inmediata en unidades en stock.',
            },
          ].map((item) => (
            <div key={item.title}>
              <div className="w-8 h-1 bg-[#111] mb-5" />
              <h3 className="font-display text-2xl font-black uppercase text-[#111] mb-3">{item.title}</h3>
              <p className="text-[#888] text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
