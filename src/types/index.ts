export interface MotorcycleImage {
  id: string
  url: string
  alt: string
  label?: string
}

export interface ColorOption {
  id: string
  name: string
  hex: string
  images: MotorcycleImage[]
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
}

export interface Brand {
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
  currency: string
  description: string
  availability: 'available' | 'pre-order' | 'sold-out' | 'coming-soon'
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
  title: string
  description: string
  brandId?: string
  imageUrl: string
  originalPrice?: number
  promoPrice?: number
  validUntil?: string
  cta: string
  href: string
}

export interface HeroSlide {
  id: string
  brandId?: string
  title: string
  subtitle: string
  imageUrl: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  accentColor?: string
}
