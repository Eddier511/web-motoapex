import { useParams } from 'react-router'
import { parsePromotion, parsePromotions } from '../api/content'
import { usePublicResource } from '../data/PublicDataContext'
import { useCatalog } from '../data/CatalogContext'
import LoadingOverlay from '../components/LoadingOverlay'
import ResourceStatus from '../components/ResourceStatus'
import PromotionCard from '../components/PromotionCard'
import Seo from '../components/Seo'

export default function PromotionsPage() {
  const resource = usePublicResource('promotions', parsePromotions)
  const catalog = useCatalog()
  return <main className="pt-24 pb-16 min-h-screen"><Seo title="Promociones | MotoApex" />
    {resource.loading && !catalog.loading && <LoadingOverlay />}
    <div className="max-w-7xl mx-auto px-4 sm:px-6"><h1 className="font-display text-4xl font-black uppercase mb-8">Promociones</h1>
      <ResourceStatus resource={resource} label="promociones" empty={!resource.data?.length} emptyMessage="No hay promociones publicadas en este momento." />
      <div className="grid sm:grid-cols-2 gap-4">{resource.data?.map(p => <PromotionCard key={p.id} promotion={p} />)}</div>
    </div>
  </main>
}
export function PromotionDetailPage() {
  const { slug = '' } = useParams()
  const resource = usePublicResource(`promotions/${encodeURIComponent(slug)}`, parsePromotion)
  const catalog = useCatalog()
  return <main className="pt-24 pb-16 min-h-screen"><Seo title={resource.data ? `${resource.data.title} | MotoApex` : 'Promoción | MotoApex'} />
    {resource.loading && !catalog.loading && <LoadingOverlay />}
    <div className="max-w-4xl mx-auto px-4 sm:px-6"><ResourceStatus resource={resource} label="promoción" />
      {resource.data && <><h1 className="font-display text-4xl font-black uppercase mb-8">{resource.data.title}</h1><PromotionCard promotion={resource.data} detail /></>}
    </div>
  </main>
}
