import type { HeroSlide, Promotion } from '../types'

const UNS = (id: string, w = 900, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    brandSlug: 'ducati',
    title: 'Panigale V4 R',
    subtitle: '240 CV. La moto de carrera homologada para la calle.',
    imageUrl: UNS('photo-1699522785021-0bc2b9e792f3', 1600, 900),
    ctaPrimary: { label: 'Ver motocicleta', href: '/ducati' },
    ctaSecondary: { label: 'Solicitar cotización', href: '#contacto' },
    accentColor: '#CC0000',
  },
  {
    id: 'hero-2',
    brandSlug: 'ktm',
    title: '1390 Super Duke R EVO',
    subtitle: 'Full-Scream Ahead. 187 CV de pura locura austriaca.',
    imageUrl: UNS('photo-1771497705786-62cbb1e35c4b', 1600, 900),
    ctaPrimary: { label: 'Ver motocicleta', href: '/ktm' },
    ctaSecondary: { label: 'Solicitar cotización', href: '#contacto' },
    accentColor: '#FF6B00',
  },
  {
    id: 'hero-3',
    brandSlug: 'gasgas',
    title: 'MC 450F',
    subtitle: 'For the fearless! El arma definitiva para el circuito.',
    imageUrl: UNS('photo-1606497058128-19b758a3dd88', 1600, 900),
    ctaPrimary: { label: 'Ver motocicleta', href: '/gasgas' },
    ctaSecondary: { label: 'Solicitar cotización', href: '#contacto' },
    accentColor: '#D10000',
  },
]

export const PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Ducati Panigale V2 — Precio especial',
    description: 'Financiamiento a 48 meses con tasa preferencial. Incluye kit de servicio gratuito.',
    brandSlug: 'ducati',
    imageUrl: UNS('photo-1699522785157-336f58d9e9d9', 800, 500),
    originalPrice: 22900,
    promoPrice: 21400,
    validUntil: '2025-12-31',
    cta: 'Ver oferta',
    href: '/ducati',
  },
  {
    id: 'promo-2',
    title: 'KTM 390 Duke — Stock limitado',
    description: 'Últimas unidades del año. Entrega inmediata. Accesorios de regalo.',
    brandSlug: 'ktm',
    imageUrl: UNS('photo-1581910403548-51d577b3e804', 800, 500),
    originalPrice: 8400,
    promoPrice: 7900,
    validUntil: '2025-11-30',
    cta: 'Consultar disponibilidad',
    href: '/ktm',
  },
]

