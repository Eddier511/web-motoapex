import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import type { Motorcycle, Promotion } from '../types'
import { useCatalog } from '../data/CatalogContext'
import MotorcycleModal from './motorcycle/MotorcycleModal'
import MotorcycleCard from './motorcycle/MotorcycleCard'
import { type PromotionContext, promotionDate, usePromotionActive } from './PromotionPrices'

export default function PromotionCard({ promotion: p, detail = false, motorcycleId }: { promotion: Promotion; detail?: boolean; motorcycleId?: string }) {
  const catalog = useCatalog()
  const active = usePromotionActive(p)
  const [opened, setOpened] = useState<{ motorcycle: Motorcycle; context: PromotionContext } | null>(null)
  const relations = p.motorcycles.filter(rel => (!motorcycleId || rel.motorcycleId === motorcycleId) && catalog.motorcycles.some(m => m.id === rel.motorcycleId && m.currency === rel.currency))
  if (!active) return null
  return <>
    {relations.map(relation => {
      const motorcycle = catalog.motorcycles.find(m => m.id === relation.motorcycleId)!
      const context = { promotion: p, relation }
      return <article key={relation.id} data-promotion-id={p.id} data-motorcycle-id={motorcycle.id} className="flex flex-col">
        <MotorcycleCard motorcycle={motorcycle} promotionContext={context} promotionText={{ title: p.title, description: p.description, buttonLabel: p.buttonLabel }} onClick={m => setOpened({ motorcycle: m, context })} />
        {!detail && <Link className="text-xs text-[#777] hover:text-[#111] underline underline-offset-4 mt-3 self-start" to={`/promociones/${p.slug}`}>Ver detalle</Link>}
      </article>
    })}
    {!p.motorcycles.length && <article data-promotion-id={p.id} className="bg-white border border-[#e6e6e6] overflow-hidden">
      <img src={p.imageUrl} alt={p.title} className="w-full aspect-[16/10] object-contain bg-[#f3f3f3]" />
      <div className="p-6"><h3 className="font-display text-2xl font-black uppercase">{p.title}</h3><p className="text-sm text-[#888] mt-3">{p.description}</p><p className="text-xs mt-5">Hasta el {promotionDate(p.endsAt)}</p>{!detail && <Link to={`/promociones/${p.slug}`} className="inline-block mt-4 text-sm underline">Ver detalle</Link>}</div>
    </article>}
    {!!p.motorcycles.length && !catalog.loading && !catalog.error && !relations.length && <p data-promotion-id={p.id} className="p-6 text-sm text-[#777]">Las motocicletas de esta promoción no están disponibles.</p>}
    {opened && createPortal(<MotorcycleModal key={opened.motorcycle.id} motorcycle={opened.motorcycle} promotionContext={opened.context} onClose={() => setOpened(null)} />, document.body)}
  </>
}
