import { Link } from 'react-router'
import type { Promotion } from '../types'
import { parseSettings } from '../api/content'
import { usePublicResource } from '../data/PublicDataContext'

const formatPrice = (amount: number, currency: string) => `${currency === 'USD' ? '$' : '₡'}${amount.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 })}`

export default function PromotionCard({ promotion: p, detail = false }: { promotion: Promotion; detail?: boolean }) {
  const settings = usePublicResource('settings', parseSettings)
  const timeZone = settings.data?.find(s => s.key === 'timezone')?.value || 'UTC'
  const date = (v: string) => new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeZone }).format(new Date(v))
  return <article data-promotion-id={p.id} className="group relative bg-[#0d0d0d] flex overflow-hidden text-white">
    <div className="w-1 flex-shrink-0" style={{ background: p.brand?.primaryColor || '#444' }} />
    <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden">
      <img src={p.imageUrl} alt={p.title} loading="lazy" className="w-full h-full object-cover opacity-70" style={{ minHeight: '120px' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d0d]" />
    </div>
    <div className="flex-1 min-w-0 px-5 py-5">
      {p.brand && <Link to={`/${p.brand.slug}`} className="font-display text-xs font-black tracking-widest uppercase" style={{ color: p.brand.primaryColor }}>{p.brand.name}</Link>}
      {p.featured && <p className="text-xs text-white/50">Destacada</p>}
      <h3 className="font-display text-base font-black uppercase mb-2">{p.title}</h3>
      <p className={`text-white/50 text-xs leading-relaxed whitespace-pre-line ${detail ? '' : 'line-clamp-2'}`}>{p.description}</p>
      <ul className="mt-4 space-y-3">{p.motorcycles.map(rel => <li key={rel.id} data-motorcycle-id={rel.motorcycleId}>
        <p className="font-display font-bold text-sm">{rel.motorcycle.brand.name} · {rel.motorcycle.model} {rel.motorcycle.version} · {rel.motorcycle.year}</p>
        {rel.motorcycle.showPrice && <div>
          {rel.originalPrice !== undefined && <p className={`text-xs ${rel.promoPrice !== undefined ? 'line-through text-white/40' : 'text-white'}`}>{formatPrice(rel.originalPrice, rel.currency)} {rel.currency}</p>}
          {rel.promoPrice !== undefined && <p className="font-display text-xl font-black">{formatPrice(rel.promoPrice, rel.currency)} {rel.currency}</p>}
        </div>}
        <Link className="text-xs underline text-white/70" to={`/motocicletas?model=${encodeURIComponent(rel.motorcycle.slug)}`}>Ver modelo</Link>
        {rel.motorcycle.allowQuote && <Link className="ml-3 text-xs underline text-white/70" to={`/?motorcycleId=${encodeURIComponent(rel.motorcycleId)}#contacto`}>Consultar</Link>}
      </li>)}</ul>
      <p className="mt-3 text-xs text-white/40">Vigencia: {date(p.startsAt)} – {date(p.endsAt)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {p.buttonLabel && <Link to={p.buttonHref} className="font-display text-xs font-black tracking-widest uppercase px-4 py-2" style={{ background: p.brand?.primaryColor || '#333' }}>{p.buttonLabel}</Link>}
        {!detail && <Link className="text-xs underline text-white/60" to={`/promociones/${p.slug}`}>Ver detalle</Link>}
      </div>
    </div>
  </article>
}
