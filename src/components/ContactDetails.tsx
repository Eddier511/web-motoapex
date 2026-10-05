import { whatsappHref } from '../api/content'
import { useContact } from './PublicSite'
import ResourceStatus from './ResourceStatus'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
export default function ContactDetails() {
  const resource = useContact(), contact = resource.data
  return <>
    <ResourceStatus resource={resource} label="contacto" />
    {contact && <div className="space-y-3">
      {contact.businessName && <p className="font-display font-bold text-lg">{contact.businessName}</p>}
      {[
        { label: 'Dirección', value: contact.address },
        { label: 'Teléfono', value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/[^+\d]/g, '')}` : '' },
        { label: 'WhatsApp', value: contact.whatsapp, href: whatsappHref(contact.whatsapp) },
        { label: 'Email', value: contact.email, href: contact.email ? `mailto:${contact.email}` : '' },
      ].filter(item => item.value).map(item => <div key={item.label} className="flex gap-5 items-start">
        <p className="font-display text-xs font-black tracking-widest uppercase text-white/40 w-20 flex-shrink-0 pt-0.5">{item.label}</p>
        <p className="text-sm text-white/70">{item.href ? <a href={item.href}>{item.value}</a> : item.value}</p>
      </div>)}
      {contact.hours.length > 0 && <div className="flex gap-5 items-start"><p className="font-display text-xs font-black tracking-widest uppercase text-white/40 w-20 flex-shrink-0">Horario</p><ul className="text-sm text-white/70">{contact.hours.map(h => <li key={h.day}>{days[h.day - 1]}: {h.closed ? 'Cerrado' : `${h.opens} – ${h.closes}`}</li>)}</ul></div>}
      {contact.latitude !== null && contact.longitude !== null && <a className="inline-block text-sm underline" href={`https://www.google.com/maps/search/?api=1&query=${contact.latitude},${contact.longitude}`} target="_blank" rel="noopener noreferrer">Ver ubicación</a>}
      {!contact.phone && !contact.whatsapp && !contact.email && !contact.address && !contact.hours.length && <p className="text-sm text-white/50">Los datos de contacto aún no están publicados.</p>}
    </div>}
  </>
}
