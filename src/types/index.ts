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
  brandSlug?: string
  id: string
  title: string
  description: string
  imageUrl: string
  originalPrice?: number
  promoPrice?: number
  validUntil?: string
  cta: string
  href: string
}

export interface HeroSlide {
  brandSlug?: string
  id: string
  title: string
  subtitle: string
  imageUrl: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  accentColor?: string
}
