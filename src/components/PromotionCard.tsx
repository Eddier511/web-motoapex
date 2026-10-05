import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import type { Promotion } from '../types'
import { useCatalog } from '../data/CatalogContext'
import MotorcycleModal from './motorcycle/MotorcycleModal'
import CatalogStatus from './CatalogStatus'
import PromotionPrices, { promotionDate, usePromotionActive } from './PromotionPrices'

export default function PromotionCard({ promotion: p, detail = false }: { promotion: Promotion; detail?: boolean }) {
  const catalog = useCatalog()
  const active = usePromotionActive(p)
  const relations = p.motorcycles.filter(rel => catalog.motorcycles.some(m => m.id === rel.motorcycleId && m.currency === rel.currency))
  const [selectedId, setSelectedId] = useState('')
  const [openedId, setOpenedId] = useState('')
  const selected = relations.find(rel => rel.motorcycleId === selectedId) ?? relations[0]
  const selectedMoto = catalog.motorcycles.find(m => m.id === selected?.motorcycleId)
  const opened = relations.find(rel => rel.motorcycleId === openedId)
  const openedMoto = catalog.motorcycles.find(m => m.id === opened?.motorcycleId)
  const image = selectedMoto?.colorOptions.flatMap(c => c.images)[0]
  if (!active) return null
  return <>
    <article data-promotion-id={p.id} className="group relative bg-[#0d0d0d] flex overflow-hidden text-white">
      <div className="w-1 flex-shrink-0" style={{ background: p.brand?.primaryColor || '#444' }} />
      <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden">
        {image ? <img src={image.url} alt={image.alt || selectedMoto?.model} loading="lazy" className="w-full h-full object-contain" style={{ minHeight: '120px' }} /> : !p.motorcycles.length ? <img src={p.imageUrl} alt={p.title} loading="lazy" className="w-full h-full object-cover opacity-70" /> : null}
      </div>
      <div className="flex-1 min-w-0 px-5 py-5">
        {p.brand && <Link to={`/${p.brand.slug}`} className="font-display text-xs font-black tracking-widest uppercase" style={{ color: p.brand.primaryColor }}>{p.brand.name}</Link>}
        {p.featured && <p className="text-xs text-white/50">Destacada</p>}
        <h3 className="font-display text-base font-black uppercase mb-2">{p.title}</h3>
        <p className={`text-white/50 text-xs leading-relaxed whitespace-pre-line ${detail ? '' : 'line-clamp-2'}`}>{p.description}</p>
        {catalog.loading && <p role="status">Cargando motocicletas…</p>}
        {catalog.error && <CatalogStatus />}
        {!catalog.loading && !catalog.error && !!p.motorcycles.length && !relations.length && <p className="mt-4 text-xs text-white/60">Las motocicletas de esta promoción no están disponibles.</p>}
        {relations.length > 1 && <label className="block mt-4 text-xs">Elige una motocicleta
          <select aria-label="Motocicleta de la promoción" value={selected?.motorcycleId || ''} onChange={e => setSelectedId(e.target.value)} className="block mt-2 w-full bg-[#222] border border-white/30 p-2 text-white">
            {relations.map(rel => <option key={rel.id} value={rel.motorcycleId}>{rel.motorcycle.model} {rel.motorcycle.version} · {rel.motorcycle.year}</option>)}
          </select>
        </label>}
        <ul className="mt-4 space-y-3">{relations.map(rel => {
          const moto = catalog.motorcycles.find(m => m.id === rel.motorcycleId)!
          return <li key={rel.id} data-motorcycle-id={rel.motorcycleId}>
            <p className="font-display font-bold text-sm">{rel.motorcycle.brand.name} · {rel.motorcycle.model} {rel.motorcycle.version} · {rel.motorcycle.year}</p>
            <PromotionPrices relation={rel} showPrice={moto.showPrice} dark />
          </li>
        })}</ul>
        <p className="mt-3 text-xs text-white/60">Hasta el {promotionDate(p.endsAt)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {selected && p.buttonLabel && <button onClick={() => setOpenedId(selected.motorcycleId)} className="font-display text-xs font-black tracking-widest uppercase px-4 py-2" style={{ background: p.brand?.primaryColor || '#333' }}>{p.buttonLabel}</button>}
          {!detail && <Link className="text-xs underline text-white/60" to={`/promociones/${p.slug}`}>Ver detalle</Link>}
        </div>
      </div>
    </article>
    {opened && openedMoto && createPortal(<MotorcycleModal key={openedMoto.id} motorcycle={{ ...openedMoto, allowQuote: openedMoto.allowQuote && opened.motorcycle.allowQuote }} promotionContext={{ promotion: p, relation: opened }} onClose={() => setOpenedId('')} />, document.body)}
  </>
}
