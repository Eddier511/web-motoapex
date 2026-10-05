import { useParams } from 'react-router'
import { parsePromotion, parsePromotions } from '../api/content'
import { usePublicResource } from '../data/PublicDataContext'
import { useCatalog } from '../data/CatalogContext'
import LoadingOverlay from '../components/LoadingOverlay'
import ResourceStatus from '../components/ResourceStatus'
import PromotionCard from '../components/PromotionCard'
import Seo from '../components/Seo'
import CatalogStatus from '../components/CatalogStatus'
import useOffers from '../data/useOffers'

export default function PromotionsPage() {
  const resource = usePublicResource('promotions', parsePromotions)
  const catalog = useCatalog()
  const { offers } = useOffers()
  const heroMoto = catalog.motorcycles.find(m => m.id === offers[0]?.relation.motorcycleId)
  const heroImage = heroMoto?.colorOptions.flatMap(c => c.images)[0]
  return <main className="pt-16 pb-16 min-h-screen bg-[#f7f7f5]"><Seo title="Promociones | MotoApex" />
    {resource.loading && !catalog.loading && <LoadingOverlay />}
    <section className="relative bg-[#111] text-white overflow-hidden border-b-4 border-[#f97316]">
      <div className="absolute -right-16 -top-32 w-96 h-96 rounded-full bg-[#f97316]/15 blur-3xl" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-20 relative grid md:grid-cols-2 items-center gap-8">
        <div><p className="font-display text-xs tracking-[0.35em] uppercase text-[#fb923c] mb-4">MotoApex Costa Rica</p><h1 className="font-display text-[clamp(2.5rem,5.4vw,5rem)] font-black uppercase leading-none">Promociones</h1><p className="text-white/60 text-sm sm:text-base max-w-md mt-5 leading-relaxed">Tu próxima moto, una oportunidad única. Descubre nuestras promociones vigentes.</p><a href="#ofertas" className="inline-flex mt-7 font-display text-xs tracking-widest uppercase font-black bg-[#f97316] px-6 py-3 hover:bg-[#ea580c]">Explorar ofertas ↓</a></div>
        {heroImage && <img src={heroImage.url} alt={heroImage.alt || heroMoto?.model} className="w-full max-h-72 sm:max-h-80 object-contain" />}
      </div>
    </section>
    <div id="ofertas" className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 scroll-mt-20"><p className="font-display text-xs tracking-[0.3em] uppercase text-[#999] mb-2">Elige tu próxima aventura</p><h2 className="font-display text-3xl sm:text-4xl font-black uppercase mb-8">Ofertas vigentes</h2>
      {(catalog.loading || catalog.error) && <CatalogStatus />}
      <ResourceStatus resource={resource} label="promociones" empty={!resource.data?.length} emptyMessage="No hay promociones publicadas en este momento." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{resource.data?.map(p => <PromotionCard key={p.id} promotion={p} />)}</div>
    </div>
  </main>
}
export function PromotionDetailPage() {
  const { slug = '' } = useParams()
  const resource = usePublicResource(`promotions/${encodeURIComponent(slug)}`, parsePromotion)
  const catalog = useCatalog()
  return <main className="pt-24 pb-16 min-h-screen"><Seo title={resource.data ? `${resource.data.title} | MotoApex` : 'Promoción | MotoApex'} />
    {resource.loading && !catalog.loading && <LoadingOverlay />}
    <div className="max-w-7xl mx-auto px-4 sm:px-6"><ResourceStatus resource={resource} label="promoción" />
      {resource.data && <><h1 className="font-display text-4xl font-black uppercase mb-8">{resource.data.title}</h1><p className="text-[#888] mb-8">{resource.data.description}</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"><PromotionCard promotion={resource.data} detail /></div></>}
    </div>
  </main>
}
