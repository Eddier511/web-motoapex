import { useEffect, useState } from 'react'
import type { Resource } from '../data/PublicDataContext'

export default function ResourceStatus({ resource, empty = false, emptyMessage = 'No hay contenido publicado.', label = 'contenido' }: { resource: Resource<unknown>; empty?: boolean; emptyMessage?: string; label?: string }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { if (!resource.retryAt) return; const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [resource.retryAt])
  if (!resource.loading && !resource.error && !empty) return null
  const waiting = Math.max(0, Math.ceil((resource.retryAt - now) / 1000))
  return <div className="px-4 py-6 text-center" role={resource.error ? 'alert' : 'status'}>
    <p>{resource.loading ? `Cargando ${label}…` : resource.error ? `No se pudo cargar ${label}. ${resource.error.message}` : emptyMessage}</p>
    {resource.error?.requestId && <p className="mt-2 text-xs opacity-60">Referencia: {resource.error.requestId}</p>}
    {resource.error && <button className="mt-4 px-5 py-2 bg-[#111] text-white disabled:opacity-50 border border-white/20" disabled={waiting > 0} onClick={resource.reload}>{waiting ? `Reintentar en ${waiting} s` : 'Reintentar'}</button>}
  </div>
}
