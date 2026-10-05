import type { Brand, Category, Motorcycle, ColorOption, MotorcycleImage } from '../types'

type RecordData = Record<string, unknown>
const record = (value: unknown): RecordData => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Respuesta de catálogo no válida')
  return value as RecordData
}
const text = (value: unknown) => typeof value === 'string' ? value : ''
const id = (value: unknown) => { if (typeof value !== 'string' || !value) throw new Error('ID de servidor no válido'); return value }
const array = (value: unknown): unknown[] => { if (!Array.isArray(value)) throw new Error('Listado de catálogo no válido'); return value }
const number = (value: unknown): number | undefined => typeof value === 'number' && Number.isFinite(value) ? value : undefined
const positive = (value: unknown) => { const n = number(value); return n !== undefined && n > 0 ? n : undefined }
const color = (value: unknown, fallback: string) => /^#[\da-f]{6}$/i.test(text(value)) ? text(value) : fallback
export const httpsImage = (value: unknown) => { try { const url = new URL(text(value)); return url.protocol === 'https:' && !url.username && !url.password ? url.href : '' } catch { return '' } }
const ordered = <T extends { order?: number }>(items: T[]) => items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

export function parseCategories(value: unknown): Category[] {
  return ordered(array(value).map(item => { const r = record(item); return {
    id: id(r.id), slug: id(r.slug), name: text(r.name), brandId: text(r.brandId), order: number(r.order),
  } }))
}
export function parseBrands(value: unknown): Brand[] {
  return ordered(array(value).map(item => { const r = record(item); return {
    id: id(r.id), slug: id(r.slug), name: text(r.name), description: text(r.description),
    tagline: text(r.tagline), slogan: text(r.slogan), order: number(r.order),
    primaryColor: color(r.primaryColor, '#111111'), secondaryColor: color(r.secondaryColor, '#333333'), accentLight: color(r.accentLight, '#f7f7f5'),
    logo: httpsImage(r.logo), heroImageUrl: httpsImage(r.heroImageUrl), tileImageUrl: httpsImage(r.tileImageUrl), categories: parseCategories(r.categories),
  } }))
}
export function parseMotorcycles(value: unknown): Motorcycle[] {
  return array(value).map(item => {
    const r = record(item)
    if (!['available', 'reserved', 'coming-soon', 'sold-out'].includes(text(r.availability))) throw new Error('Disponibilidad no válida')
    if (typeof r.showPrice !== 'boolean' || typeof r.allowQuote !== 'boolean') throw new Error('Permisos de catálogo no válidos')
    const year = number(r.year)
    if (year === undefined || !Number.isInteger(year) || year <= 0) throw new Error('Año de catálogo no válido')
    const colorOptions: ColorOption[] = ordered(array(r.colorOptions).map(item => {
      const c = record(item)
      const images: MotorcycleImage[] = ordered(array(c.images).map(item => { const i = record(item); return {
        id: id(i.id), url: httpsImage(i.url), alt: text(i.alt), label: text(i.label), order: number(i.order), isPrimary: i.isPrimary === true,
      } })).filter(i => i.url)
      images.sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      return { id: id(c.id), name: text(c.name), hex: color(c.hex, '#111111'), available: c.available === true, order: number(c.order), images }
    }))
    return {
      id: id(r.id), slug: id(r.slug), brandId: id(r.brandId), categoryId: id(r.categoryId),
      brandName: text(r.brandName), brandColor: color(r.brandColor, '#111111'), categoryName: text(r.categoryName),
      model: id(r.model), year, currency: text(r.currency), description: text(r.description), tagline: text(r.tagline),
      showPrice: r.showPrice, allowQuote: r.allowQuote,
      price: r.showPrice ? number(r.price) : undefined, promoPrice: r.showPrice ? number(r.promoPrice) : undefined,
      availability: r.availability as Motorcycle['availability'], isNew: r.isNew === true, isFeatured: r.isFeatured === true,
      cc: positive(r.cc), hp: positive(r.hp), colorOptions,
      specs: array(r.specs).map(item => { const s = record(item); return { group: text(s.group), label: text(s.label), value: text(s.value) } }),
    }
  })
}

export const visiblePrice = (m: Motorcycle) => m.showPrice && typeof m.price === 'number' ? (m.promoPrice ?? m.price) : undefined
export const formatPrice = (amount: number, currency: string) => {
  try { return new Intl.NumberFormat('es-CR', { style: 'currency', currency }).format(amount) }
  catch { return `${amount.toLocaleString('es-CR')} ${currency}` }
}
export function comparePrice(a: Motorcycle, b: Motorcycle, descending = false) {
  const x = visiblePrice(a), y = visiblePrice(b)
  if (x === undefined) return y === undefined ? 0 : 1
  if (y === undefined) return -1
  // Different currencies cannot be compared as equivalent amounts.
  return a.currency.localeCompare(b.currency) || (descending ? y - x : x - y)
}
