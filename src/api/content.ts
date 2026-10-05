import type { BrandSummary, Contact, HeroSlide, PageBlock, Promotion, PublicPage, PublicSetting, SocialLink } from '../types'

const record = (v: unknown): Record<string, unknown> => { if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('Contenido no válido'); return v as Record<string, unknown> }
const list = (v: unknown): unknown[] => { if (!Array.isArray(v)) throw new Error('Listado no válido'); return v }
const text = (v: unknown) => typeof v === 'string' ? v : ''
const id = (v: unknown) => { if (typeof v !== 'string' || !v) throw new Error('ID no válido'); return v }
const color = (v: unknown) => /^#[a-f\d]{6}$/i.test(text(v)) ? text(v) : '#111111'
const money = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined
const order = (v: unknown) => typeof v === 'number' && Number.isInteger(v) ? v : 0
const flag = (v: unknown) => { if (typeof v !== 'boolean') throw new Error('Permiso no válido'); return v }
const unsafe = (v: string) => { try { return /[\x00-\x20\x7f\\]/.test(v) || /[\x00-\x20\x7f\\]/.test(decodeURIComponent(v)) } catch { return true } }
export function safeHttps(v: unknown) {
  const s = text(v)
  if (!s || unsafe(s)) return ''
  try { const u = new URL(s); return u.protocol === 'https:' && !u.username && !u.password ? u.href : '' } catch { return '' }
}
export function safeDestination(v: unknown) {
  const s = text(v)
  if (!s || unsafe(s)) return ''
  if (s.startsWith('/') && !s.startsWith('//') && !decodeURIComponent(s).startsWith('//')) return s
  return safeHttps(s)
}
const requiredUrl = (v: unknown, internal = false) => { const s = internal ? safeDestination(v) : safeHttps(v); if (!s) throw new Error('Enlace público no válido'); return s }
const summary = (v: unknown): BrandSummary => { const r = record(v); return { id: id(r.id), name: text(r.name), slug: id(r.slug), primaryColor: color(r.primaryColor) } }
const date = (v: unknown) => { const s = text(v); if (!s || !Number.isFinite(Date.parse(s))) throw new Error('Vigencia no válida'); return s }

export function parsePromotion(v: unknown): Promotion {
  const r = record(v)
  if (r.status !== undefined && r.status !== 'active') throw new Error('Promoción no pública')
  return { id: id(r.id), slug: id(r.slug), title: text(r.title), description: text(r.description), imageUrl: requiredUrl(r.imageUrl), brand: r.brand == null ? null : summary(r.brand),
    startsAt: date(r.startsAt), endsAt: date(r.endsAt), featured: flag(r.featured), showOnHome: flag(r.showOnHome), order: order(r.order), buttonLabel: text(r.buttonLabel), buttonHref: requiredUrl(r.buttonHref, true),
    motorcycles: list(r.motorcycles).map(v => { const rel = record(v), m = record(rel.motorcycle)
      if (!['CRC', 'USD'].includes(text(rel.currency))) throw new Error('Moneda no válida')
      const showPrice = flag(m.showPrice)
      const motorcycleId = id(rel.motorcycleId)
      if (id(m.id) !== motorcycleId) throw new Error('Relación de moto no válida')
      return { id: id(rel.id), motorcycleId, currency: rel.currency as 'CRC' | 'USD', originalPrice: showPrice ? money(rel.originalPrice) : undefined, promoPrice: showPrice ? money(rel.promoPrice) : undefined,
        motorcycle: { id: motorcycleId, slug: id(m.slug), model: text(m.model), version: text(m.version), year: order(m.year), showPrice, allowQuote: flag(m.allowQuote), brand: summary(m.brand) } }
    }) }
}
export const parsePromotions = (v: unknown) => list(v).map(parsePromotion)
export function parseBanners(v: unknown): HeroSlide[] {
  return list(v).map(v => { const r = record(v)
    if (r.status !== undefined && r.status !== 'active') throw new Error('Banner no público')
    const button = (v: unknown) => { if (v == null) return null; const b = record(v); return { label: id(b.label), href: requiredUrl(b.href, true) } }
    return { id: id(r.id), title: text(r.title), subtitle: text(r.subtitle), imageUrl: requiredUrl(r.imageUrl), mobileImageUrl: r.mobileImageUrl ? requiredUrl(r.mobileImageUrl) : '', alt: text(r.alt), brandSlug: text(r.brandSlug), accentColor: color(r.accentColor), ctaPrimary: button(r.ctaPrimary), ctaSecondary: button(r.ctaSecondary) }
  })
}
export function parsePage(v: unknown): PublicPage {
  const r = record(v), seo = record(r.seo)
  if (r.status !== undefined && r.status !== 'published') throw new Error('Página no pública')
  if (r.contentFormat !== 'text' && r.contentFormat !== 'blocks') throw new Error('Formato no válido')
  let content: string | PageBlock[]
  if (r.contentFormat === 'text') { if (typeof r.content !== 'string') throw new Error('Texto no válido'); content = r.content }
  else content = list(r.content).map(v => { const b = record(v)
    switch (b.type) {
      case 'heading': { const level = order(b.level); if (level < 1 || level > 6) throw new Error('Encabezado no válido'); return { type: 'heading', text: text(b.text), level } }
      case 'paragraph': return { type: 'paragraph', text: text(b.text) }
      case 'image': return { type: 'image', url: requiredUrl(b.url), alt: text(b.alt) }
      case 'link': return { type: 'link', text: text(b.text), href: requiredUrl(b.href, true) }
      default: throw new Error('Bloque no permitido')
    }
  })
  return { id: id(r.id), slug: id(r.slug), title: text(r.title), contentFormat: r.contentFormat, content, order: order(r.order), seo: { title: text(seo.title), description: text(seo.description) } }
}
export const parsePages = (v: unknown) => list(v).map(parsePage)
export function parseContact(v: unknown): Contact {
  const r = record(v)
  const coordinate = (v: unknown, max: number) => { if (v == null) return null; if (typeof v !== 'number' || !Number.isFinite(v) || Math.abs(v) > max) throw new Error('Coordenadas no válidas'); return v }
  const latitude = coordinate(r.latitude, 90), longitude = coordinate(r.longitude, 180)
  if ((latitude === null) !== (longitude === null)) throw new Error('Coordenadas incompletas')
  const phone = (v: unknown) => { const s = text(v); if (!/^[+0-9 ()-]{0,40}$/.test(s)) throw new Error('Teléfono no válido'); return s }
  const email = text(r.email)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Correo no válido')
  return { id: id(r.id), businessName: text(r.businessName), phone: phone(r.phone), whatsapp: phone(r.whatsapp), email, address: text(r.address), latitude, longitude,
    logoUrl: r.logoUrl ? requiredUrl(r.logoUrl) : '', faviconUrl: r.faviconUrl ? requiredUrl(r.faviconUrl) : '',
    hours: list(r.hours).map(v => { const h = record(v), day = order(h.day), closed = flag(h.closed)
      if (day < 1 || day > 7 || (!closed && (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(text(h.opens)) || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(text(h.closes))))) throw new Error('Horario no válido')
      return { day, closed, opens: closed ? null : text(h.opens), closes: closed ? null : text(h.closes) }
    }) }
}
export const parseSocialLinks = (v: unknown): SocialLink[] => list(v).map(v => { const r = record(v); if (r.status !== undefined && r.status !== 'active') throw new Error('Red no pública'); return { id: id(r.id), platform: text(r.platform), label: text(r.label), url: requiredUrl(r.url), order: order(r.order) } })
export const parseSettings = (v: unknown): PublicSetting[] => list(v).map(v => { const r = record(v); if (!['site_url', 'timezone', 'default_currency'].includes(text(r.key)) || r.public !== true || r.valueType !== 'string') throw new Error('Ajuste no público'); const value = text(r.value); if (r.key === 'site_url') requiredUrl(value); if (r.key === 'default_currency' && !['CRC', 'USD'].includes(value)) throw new Error('Moneda no válida'); if (r.key === 'timezone') new Intl.DateTimeFormat('es', { timeZone: value }); return { id: id(r.id), key: r.key as PublicSetting['key'], value } })
export const whatsappHref = (phone: string, message = '') => { const digits = phone.replace(/\D/g, ''); return digits ? `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}` : '' }
