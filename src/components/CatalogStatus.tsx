import { useEffect, useState } from 'react'
import { useCatalog } from '../data/CatalogContext'

export default function CatalogStatus() {
  const { loading, error, retryAt, reload, motorcycles } = useCatalog()
  const [now, setNow] = useState(Date.now())
  useEffect(() => { if (!retryAt) return; const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [retryAt])
  if (!loading && !error && motorcycles.length) return null
  const waiting = Math.max(0, Math.ceil((retryAt - now) / 1000))
  return <div className="max-w-7xl mx-auto px-6 py-12 text-center" role={error ? 'alert' : 'status'}>
    <p className="font-display text-xl font-bold uppercase">{loading ? 'Cargando catálogo…' : error || 'El catálogo está vacío. Pronto publicaremos nuevos modelos.'}</p>
    {error && <button className="mt-5 px-6 py-3 bg-[#111] text-white disabled:opacity-50" disabled={waiting > 0} onClick={reload}>{waiting ? `Reintentar en ${waiting} s` : 'Reintentar'}</button>}
  </div>
}
