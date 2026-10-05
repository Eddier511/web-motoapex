import { Link } from 'react-router'
import { useCatalog } from '../data/CatalogContext'
import { usePublicResource } from '../data/PublicDataContext'
import { parseBanners, parsePromotions } from '../api/content'
import CatalogStatus from '../components/CatalogStatus'
import ResourceStatus from '../components/ResourceStatus'
import PromotionCard from '../components/PromotionCard'
import useOffers from '../data/useOffers'
import HeroSection from '../components/home/HeroSection'
import BrandsSection from '../components/home/BrandsSection'
import FeaturedSection from '../components/home/FeaturedSection'
import Seo from '../components/Seo'

export default function HomePage() {
  const { brands, motorcycles, loading, error } = useCatalog()
  const banners = usePublicResource('banners?placement=home_hero', parseBanners)
  const promotions = usePublicResource('promotions', parsePromotions)
  const { offers } = useOffers()
  const homePromotions = offers.filter(o => o.promotion.showOnHome).filter((o, i, all) => all.findIndex(x => x.relation.motorcycleId === o.relation.motorcycleId) === i).slice(0, 4)
  return <main>
    <Seo title="MotoApex | Motocicletas en Costa Rica" />
    <div className={banners.data?.length ? '' : 'pt-16'}>
      <ResourceStatus resource={banners} label="carrusel" />
      {banners.data && <HeroSection slides={banners.data} />}
    </div>
{/* Stats strip */}
      <section className="bg-[#111] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { v: '15+', l: 'Años en el mercado' },
            { v: '4', l: 'Marcas oficiales' },
            { v: '2000+', l: 'Motos vendidas' },
            { v: '98%', l: 'Satisfacción' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-black text-white mb-0.5">{s.v}</p>
              <p className="font-display text-xs tracking-widest uppercase text-white/30">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    <CatalogStatus />
    {!loading && !error && <BrandsSection brands={brands} />}
    {(promotions.loading || promotions.error || homePromotions.length > 0) && <section className="bg-white border-t border-[#ebebeb] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div><p className="font-display text-xs tracking-[0.35em] uppercase text-[#ccc] mb-1">Ofertas activas</p><h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#111] leading-none">Promociones</h2></div>
          <Link to="/promociones" className="font-display text-xs font-black tracking-widest uppercase text-[#bbb] hover:text-[#111]">Ver todas →</Link>
        </div>
        <ResourceStatus resource={promotions} label="promociones" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{homePromotions.map(o => <PromotionCard key={`${o.promotion.id}-${o.relation.id}`} promotion={o.promotion} motorcycleId={o.relation.motorcycleId} />)}</div>
      </div>
    </section>}
    <FeaturedSection motorcycles={motorcycles.filter(m => m.isFeatured)} />
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
}
