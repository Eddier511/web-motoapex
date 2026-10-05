import { useEffect, useMemo, useState } from 'react'
import { usePublicResource } from './PublicDataContext'
import { useCatalog } from './CatalogContext'
import { parsePromotions } from '../api/content'
import type { PromotionContext } from '../components/PromotionPrices'

export default function useOffers() {
  const resource = usePublicResource('promotions', parsePromotions)
  const catalog = useCatalog()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const update = () => setNow(Date.now())
    const boundaries = resource.data?.flatMap(p => [Date.parse(p.startsAt), Date.parse(p.endsAt) + 1]).filter(t => t > Date.now()) || []
    const timer = boundaries.length ? setTimeout(update, Math.min(2147483647, Math.max(1, Math.min(...boundaries) - Date.now()))) : undefined
    window.addEventListener('focus', update)
    return () => { clearTimeout(timer); window.removeEventListener('focus', update) }
  }, [resource.data, now])
  const offers = useMemo(() => {
    const result: PromotionContext[] = []
    for (const promotion of resource.data || []) {
      if (now < Date.parse(promotion.startsAt) || now > Date.parse(promotion.endsAt)) continue
      for (const relation of promotion.motorcycles) {
        if (catalog.motorcycles.some(m => m.id === relation.motorcycleId && m.currency === relation.currency)) result.push({ promotion, relation })
      }
    }
    return result
  }, [resource.data, catalog.motorcycles, now])
  // Preserve server order when a motorcycle participates in several active campaigns.
  const byId = useMemo(() => {
    const map = new Map<string, PromotionContext>()
    for (const offer of offers) if (!map.has(offer.relation.motorcycleId)) map.set(offer.relation.motorcycleId, offer)
    return map
  }, [offers])
  return { resource, offers, byId }
}
