import { createContext, useContext, useEffect, useCallback, useState, type ReactNode } from 'react'
import type { Brand, Category, Motorcycle } from '../types'
import { request, ApiError } from '../api/client'
import { parseBrands, parseCategories, parseMotorcycles } from '../api/catalog'
import LoadingOverlay from '../components/LoadingOverlay'

interface Catalog {
  brands: Brand[]; categories: Category[]; motorcycles: Motorcycle[]
  loading: boolean; error: string; retryAt: number; reload: () => void
}
const Context = createContext<Catalog | null>(null)
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({ brands: [] as Brand[], categories: [] as Category[], motorcycles: [] as Motorcycle[] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryAt, setRetryAt] = useState(0)
  const [revision, setRevision] = useState(0)
  const reload = useCallback(() => setRevision(v => v + 1), [])
  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    Promise.all([request('brands'), request('categories'), request('motorcycles')]).then(([b, c, m]) => {
      const categories = parseCategories(c)
      const brands = parseBrands(b).map(brand => ({ ...brand, categories: categories.filter(cat => !cat.brandId || cat.brandId === brand.id) }))
      const motorcycles = parseMotorcycles(m)
      if (active) { setData({ brands, categories, motorcycles }); setRetryAt(0) }
    }).catch(e => {
      if (active) {
        setData({ brands: [], categories: [], motorcycles: [] })
        setError(e instanceof ApiError ? e.message : 'La respuesta del catálogo no es válida. Intenta de nuevo más tarde.')
        setRetryAt(e instanceof ApiError && e.status === 429 ? Date.now() + e.retryAfter * 1000 : 0)
      }
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [revision])
  return <Context.Provider value={{ ...data, loading, error, retryAt, reload }}>{children}{loading && <LoadingOverlay />}</Context.Provider>
}
export function useCatalog() { const value = useContext(Context); if (!value) throw new Error('Falta CatalogProvider'); return value }
