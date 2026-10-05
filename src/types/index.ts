export interface MotorcycleImage {
  id: string
  url: string
  alt: string
  label?: string
  order?: number
  isPrimary?: boolean
}

export interface ColorOption {
  id: string
  name: string
  hex: string
  images: MotorcycleImage[]
  available?: boolean
  order?: number
}

export interface Spec {
  group: string
  label: string
  value: string
}

export interface Category {
  id: string
  slug: string
  name: string
  brandId: string
  order?: number
}

export interface Brand {
  logo?: string
  order?: number
  id: string
  slug: string
  name: string
  tagline: string
  slogan: string
  description: string
  primaryColor: string
  secondaryColor: string
  accentLight: string
  heroImageUrl: string
  tileImageUrl: string
  categories: Category[]
}

export interface Motorcycle {
  id: string
  slug: string
  brandId: string
  brandName: string
  brandColor: string
  model: string
  year: number
  categoryId: string
  categoryName: string
  price?: number
  promoPrice?: number
  showPrice: boolean
  allowQuote: boolean
  currency: string
  description: string
  availability: 'available' | 'reserved' | 'sold-out' | 'coming-soon'
  shortDescription?: string
  isNew?: boolean
  isFeatured?: boolean
  cc?: number
  hp?: number
  colorOptions: ColorOption[]
  specs: Spec[]
  tagline?: string
}

export interface Promotion {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  brand: BrandSummary | null
  motorcycles: PromotionMotorcycle[]
  startsAt: string
  endsAt: string
  featured: boolean
  showOnHome: boolean
  order: number
  buttonLabel: string
  buttonHref: string
}

export interface BrandSummary { id: string; name: string; slug: string; primaryColor: string }
export interface PromotionMotorcycle {
  id: string; motorcycleId: string; currency: 'CRC' | 'USD'; originalPrice?: number; promoPrice?: number
  motorcycle: { id: string; slug: string; model: string; version: string; year: number; showPrice: boolean; allowQuote: boolean; brand: BrandSummary }
}
export type PageBlock = { type: 'heading'; text: string; level: number } | { type: 'paragraph'; text: string } | { type: 'image'; url: string; alt: string } | { type: 'link'; text: string; href: string }
export interface PublicPage { id: string; slug: string; title: string; contentFormat: 'text' | 'blocks'; content: string | PageBlock[]; order: number; seo: { title: string; description: string } }
export interface Contact { id: string; businessName: string; phone: string; whatsapp: string; email: string; address: string; latitude: number | null; longitude: number | null; hours: { day: number; closed: boolean; opens: string | null; closes: string | null }[]; logoUrl: string; faviconUrl: string }
export interface SocialLink { id: string; platform: string; label: string; url: string; order: number }
export interface PublicSetting { id: string; key: 'site_url' | 'timezone' | 'default_currency'; value: string }

export interface HeroSlide {
  brandSlug?: string
  id: string
  title: string
  subtitle: string
  imageUrl: string
  mobileImageUrl?: string
  alt: string
  ctaPrimary: { label: string; href: string } | null
  ctaSecondary: { label: string; href: string } | null
  accentColor?: string
}
