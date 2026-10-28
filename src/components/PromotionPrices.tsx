import { useEffect, useState } from 'react'
import type { Promotion, PromotionMotorcycle } from '../types'
import { promotionBoundaries, promotionIsActive } from '../api/promotionDates'
export { promotionDate } from '../api/promotionDates'

export interface PromotionContext { promotion: Promotion; relation: PromotionMotorcycle }
export function usePromotionActive(p: Pick<Promotion, 'startsAt' | 'endsAt'>) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { setNow(Date.now()) }, [p.startsAt, p.endsAt])
  useEffect(() => {
    const update = () => setNow(Date.now())
    const boundaries = promotionBoundaries(p).filter(t => t > Date.now())
    const timer = boundaries.length ? window.setTimeout(update, Math.max(1, Math.min(2147483647, Math.min(...boundaries) - Date.now()))) : undefined
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', update)
    return () => { clearTimeout(timer); window.removeEventListener('focus', update); document.removeEventListener('visibilitychange', update) }
  }, [p.startsAt, p.endsAt, now])
  return promotionIsActive(p, now)
}
const price = (amount: number, currency: string) => `${currency === 'USD' ? '$' : '₡'}${amount.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })} ${currency}`
export default function PromotionPrices({ relation, showPrice, dark = false }: { relation: PromotionMotorcycle; showPrice: boolean; dark?: boolean }) {
  if (!showPrice || !relation.motorcycle.showPrice) return null
  return <div data-promotion-prices>
    {relation.originalPrice !== undefined && <p className={`text-sm line-through ${dark ? 'text-white/50' : 'text-[#888]'}`}>{price(relation.originalPrice, relation.currency)}</p>}
    {relation.promoPrice !== undefined && <p className="font-display text-2xl font-black text-[#ef4444]">{price(relation.promoPrice, relation.currency)}</p>}
  </div>
}
