import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'
import type { Brand, Category, Motorcycle } from '../types'
import { parseBrands, parseCategories, parseMotorcycles } from '../api/catalog'
import { usePublicResource } from './PublicDataContext'
import LoadingOverlay from '../components/LoadingOverlay'

interface Catalog {
  brands: Brand[]; categories: Category[]; motorcycles: Motorcycle[]
  loading: boolean; error: string; retryAt: number; reload: () => void
}
const Context = createContext<Catalog | null>(null)
export function CatalogProvider({ children }: { children: ReactNode }) {
  const brandsResource = usePublicResource('brands', parseBrands)
  const categoriesResource = usePublicResource('categories', parseCategories)
  const motorcyclesResource = usePublicResource('motorcycles', parseMotorcycles)
  const failure = brandsResource.error || categoriesResource.error || motorcyclesResource.error
  const loading = !failure && (brandsResource.loading || categoriesResource.loading || motorcyclesResource.loading)
  const errorMessage = failure?.code === 'INVALID_CONTENT' ? 'La respuesta del catálogo no es válida. Intenta de nuevo más tarde.' : failure?.message
  const error = failure ? `${errorMessage}${failure.requestId ? ` Referencia: ${failure.requestId}` : ''}` : ''
  const retryAt = Math.max(brandsResource.retryAt, categoriesResource.retryAt, motorcyclesResource.retryAt)
  const reloadBrands = brandsResource.reload, reloadCategories = categoriesResource.reload, reloadMotorcycles = motorcyclesResource.reload
  const reload = useCallback(() => { reloadBrands(); reloadCategories(); reloadMotorcycles() }, [reloadBrands, reloadCategories, reloadMotorcycles])
  const data = useMemo(() => {
    if (failure || !brandsResource.data || !categoriesResource.data || !motorcyclesResource.data) return { brands: [], categories: [], motorcycles: [] }
    const categories = categoriesResource.data
    const brands = brandsResource.data.map(brand => ({ ...brand, categories: categories.filter(cat => !cat.brandId || cat.brandId === brand.id) }))
    return { brands, categories, motorcycles: motorcyclesResource.data }
  }, [failure, brandsResource.data, categoriesResource.data, motorcyclesResource.data])
  return <Context.Provider value={{ ...data, loading, error, retryAt, reload }}>{children}{loading && <LoadingOverlay />}</Context.Provider>
}
export function useCatalog() { const value = useContext(Context); if (!value) throw new Error('Falta CatalogProvider'); return value }
