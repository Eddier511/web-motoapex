import { Link } from 'react-router'
import { useCatalog } from '../data/CatalogContext'
import { usePublicResource } from '../data/PublicDataContext'
import { parseBanners, parsePromotions } from '../api/content'
import CatalogStatus from '../components/CatalogStatus'
import ResourceStatus from '../components/ResourceStatus'
import PromotionCard from '../components/PromotionCard'
import HeroSection from '../components/home/HeroSection'
import BrandsSection from '../components/home/BrandsSection'
import FeaturedSection from '../components/home/FeaturedSection'
import Seo from '../components/Seo'

export default function HomePage() {
  const { brands, motorcycles, loading, error } = useCatalog()
  const banners = usePublicResource('banners?placement=home_hero', parseBanners)
  const promotions = usePublicResource('promotions', parsePromotions)
  const homePromotions = promotions.data?.filter(p => p.showOnHome) || []
  return <main>
    <Seo title="MotoApex | Motocicletas en Costa Rica" />
    <div className={banners.data?.length ? '' : 'pt-16'}>
      <ResourceStatus resource={banners} label="carrusel" />
      {banners.data && <HeroSection slides={banners.data} />}
    </div>
    <CatalogStatus />
    {!loading && !error && <BrandsSection brands={brands} />}
    {(promotions.loading || promotions.error || homePromotions.length > 0) && <section className="bg-white border-t border-[#ebebeb] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div><p className="font-display text-xs tracking-[0.35em] uppercase text-[#ccc] mb-1">Ofertas activas</p><h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#111] leading-none">Promociones</h2></div>
          <Link to="/promociones" className="font-display text-xs font-black tracking-widest uppercase text-[#bbb] hover:text-[#111]">Ver todas →</Link>
        </div>
        <ResourceStatus resource={promotions} label="promociones" />
        <div className="grid sm:grid-cols-2 gap-4">{homePromotions.map(p => <PromotionCard key={p.id} promotion={p} />)}</div>
      </div>
    </section>}
    <FeaturedSection motorcycles={motorcycles.filter(m => m.isFeatured)} />
  </main>
}
