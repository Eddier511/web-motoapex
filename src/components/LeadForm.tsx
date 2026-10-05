import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ApiError, submitLead, type LeadInput } from '../api/client'
import { useCatalog } from '../data/CatalogContext'
import type { Motorcycle } from '../types'
import { useSearchParams } from 'react-router'

export default function LeadForm({ motorcycle, dark = false }: { motorcycle?: Motorcycle; dark?: boolean }) {
  const { motorcycles } = useCatalog()
  const [searchParams] = useSearchParams()
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [retryAt, setRetryAt] = useState(0)
  const [now, setNow] = useState(Date.now())
  const inFlight = useRef(false)
  useEffect(() => { if (!retryAt) return; const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [retryAt])
  const waiting = Math.max(0, Math.ceil((retryAt - now) / 1000))
  const [selectedId, setSelectedId] = useState(motorcycle?.id ?? '')
  useEffect(() => { const id = searchParams.get('motorcycleId'); if (!motorcycle && id && motorcycles.some(m => m.id === id)) { setSelectedId(id); setType('quote') } }, [searchParams, motorcycles, motorcycle])
  const selected = motorcycle ?? motorcycles.find(m => m.id === selectedId)
  const [type, setType] = useState<LeadInput['type']>(motorcycle?.allowQuote ? 'quote' : motorcycle ? 'availability' : 'contact')
  const quoteAllowed = !selected || selected.allowQuote
  const selectedType = !quoteAllowed && type === 'quote' ? 'availability' : type
  const inputClass = `w-full border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${dark ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-[#ddd] text-[#111]'}`
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current || waiting) return
    const form = event.currentTarget
    const values = new FormData(form)
    const name = String(values.get('name') || '').trim(), phone = String(values.get('phone') || '').trim()
    if (!name || !phone) { setError('Completa tu nombre y teléfono.'); return }
    inFlight.current = true; setSending(true); setError(''); setSuccess(false)
    try {
      await submitLead({ name, phone, email: String(values.get('email') || '').trim(), message: String(values.get('message') || '').trim(), type: selectedType, ...(selected ? { motorcycleId: selected.id } : {}) })
      setSuccess(true); form.reset()
    } catch (e) {
      setError(e instanceof Error ? `${e.message}${e instanceof ApiError && e.requestId ? ` Referencia: ${e.requestId}` : ''}` : 'No se pudo enviar la consulta.')
      if (e instanceof ApiError && e.status === 429) setRetryAt(Date.now() + e.retryAfter * 1000)
    } finally { inFlight.current = false; setSending(false) }
  }
  if (success) return <div role="status" className="py-6"><p className="font-display text-xl font-bold">Consulta enviada.</p><p className="mt-2 text-sm">Un asesor se pondrá en contacto contigo.</p><button className="mt-4 underline" onClick={() => setSuccess(false)}>Enviar otra consulta</button></div>
  return <form onSubmit={send} className="space-y-4">
    <h3 className="font-display text-xl font-black uppercase">{motorcycle ? `Consultar ${motorcycle.model}` : 'Formulario de contacto'}</h3>
    <fieldset disabled={sending} className="space-y-4">
      {[
        { name: 'name', label: 'Nombre', type: 'text', required: true, max: 120, autocomplete: 'name' },
        { name: 'phone', label: 'Teléfono', type: 'tel', required: true, max: 40, autocomplete: 'tel' },
        { name: 'email', label: 'Email (opcional)', type: 'email', required: false, max: 190, autocomplete: 'email' },
      ].map(f => <label className="block text-sm" key={f.name}>{f.label}<input className={`${inputClass} mt-1`} name={f.name} type={f.type} required={f.required} maxLength={f.max} autoComplete={f.autocomplete} /></label>)}
      {!motorcycle && <label className="block text-sm">Moto de interés (opcional)<select className={`${inputClass} mt-1`} value={selectedId} onChange={e => setSelectedId(e.target.value)}><option className="text-black" value="">Consulta general</option>{motorcycles.map(m => <option className="text-black" key={m.id} value={m.id}>{m.brandName} {m.model} {m.year}</option>)}</select></label>}
      <label className="block text-sm">Tipo de consulta<select name="type" className={`${inputClass} mt-1`} value={selectedType} onChange={e => setType(e.target.value as LeadInput['type'])}>
        <option className="text-black" value="contact">Contacto</option><option className="text-black" value="availability">Disponibilidad</option>{quoteAllowed && <option className="text-black" value="quote">Cotización</option>}<option className="text-black" value="test_ride">Prueba de manejo</option>
      </select></label>
      <label className="block text-sm">Mensaje (opcional)<textarea name="message" maxLength={3000} rows={3} className={`${inputClass} mt-1`} /></label>
    </fieldset>
    {error && <p role="alert" className={dark ? 'text-red-300 text-sm' : 'text-red-700 text-sm'}>{error}</p>}
    <button disabled={sending || waiting > 0} type="submit" className={`font-display w-full py-4 text-sm font-black tracking-widest uppercase disabled:opacity-50 ${dark ? 'bg-white text-[#111]' : 'bg-[#111] text-white'}`}>{sending ? 'Enviando…' : waiting ? `Reintentar en ${waiting} s` : 'Enviar consulta'}</button>
  </form>
}
