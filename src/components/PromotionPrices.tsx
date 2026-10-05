import { useEffect, useState } from 'react'
import type { Promotion, PromotionMotorcycle } from '../types'

export interface PromotionContext { promotion: Promotion; relation: PromotionMotorcycle }
export function usePromotionActive(p: Pick<Promotion, 'startsAt' | 'endsAt'>) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const update = () => setNow(Date.now())
    const boundary = Date.now() < Date.parse(p.startsAt) ? Date.parse(p.startsAt) : Date.parse(p.endsAt) + 1
    const timer = boundary > Date.now() ? window.setTimeout(update, Math.max(1, Math.min(2147483647, boundary - Date.now()))) : undefined
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', update)
    return () => { clearTimeout(timer); window.removeEventListener('focus', update); document.removeEventListener('visibilitychange', update) }
  }, [p.startsAt, p.endsAt, now])
  return now >= Date.parse(p.startsAt) && now <= Date.parse(p.endsAt)
}
export const promotionDate = (value: string) => new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Costa_Rica' }).format(new Date(value))
const price = (amount: number, currency: string) => `${currency === 'USD' ? '$' : '₡'}${amount.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })} ${currency}`
export default function PromotionPrices({ relation, showPrice, dark = false }: { relation: PromotionMotorcycle; showPrice: boolean; dark?: boolean }) {
  if (!showPrice || !relation.motorcycle.showPrice) return null
  return <div data-promotion-prices>
    {relation.originalPrice !== undefined && <p className={`text-sm line-through ${dark ? 'text-white/50' : 'text-[#888]'}`}>{price(relation.originalPrice, relation.currency)}</p>}
    {relation.promoPrice !== undefined && <p className="font-display text-2xl font-black text-[#ef4444]">{price(relation.promoPrice, relation.currency)}</p>}
  </div>
}
