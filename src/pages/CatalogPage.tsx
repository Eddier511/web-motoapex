import { useState, useMemo } from 'react'
import { MOTORCYCLES, BRANDS } from '../data/mock'
import MotorcycleCard from '../components/motorcycle/MotorcycleCard'
import MotorcycleModal from '../components/motorcycle/MotorcycleModal'
import type { Motorcycle } from '../types'

type SortOption = 'price-asc' | 'price-desc' | 'year-desc' | 'model-asc'

const CURRENT_YEAR = new Date().getFullYear()

export default function CatalogPage() {
  const [selected, setSelected] = useState<Motorcycle | null>(null)
  const [filterBrand, setFilterBrand] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterYear, setFilterYear] = useState<number | ''>(CURRENT_YEAR)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('year-desc')
  const [filterNew, setFilterNew] = useState(false)

  const availableYears = useMemo(() => {
    const years = [...new Set(MOTORCYCLES.map((m) => m.year))].sort((a, b) => b - a)
    return years
  }, [])

  const categories = useMemo(() => {
    const brandData = filterBrand ? BRANDS.filter((b) => b.id === filterBrand) : BRANDS
    const cats = new Map<string, string>()
    brandData.forEach((b) => b.categories.forEach((c) => cats.set(c.slug, c.name)))
    return [...cats.entries()]
  }, [filterBrand])

  const filtered = useMemo(() => {
    let list = [...MOTORCYCLES]
    if (filterBrand) list = list.filter((m) => m.brandId === filterBrand)
    if (filterCategory) list = list.filter((m) => m.categoryId === filterCategory)
    if (filterYear !== '') list = list.filter((m) => m.year === filterYear)
    if (filterNew) list = list.filter((m) => m.isNew)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (m) => m.model.toLowerCase().includes(q) || m.brandName.toLowerCase().includes(q),
      )
    }
    list.sort((a: Motorcycle, b: Motorcycle) => {
      switch (sort) {
        case 'price-asc': return (a.price ?? 0) - (b.price ?? 0)
        case 'price-desc': return (b.price ?? 0) - (a.price ?? 0)
        case 'year-desc': return b.year - a.year
        case 'model-asc': return a.model.localeCompare(b.model)
        default: return 0
      }
    })
    return list
  }, [filterBrand, filterCategory, filterYear, search, sort, filterNew])

  return (
    <main className="pt-16 min-h-screen bg-[#f7f7f5]">
      {/* Page header */}
      <div className="bg-white border-b border-[#e8e8e8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <p className="font-display text-xs tracking-[0.35em] uppercase text-[#ccc] mb-2">
            Catálogo completo
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-[#111] leading-none">
            Motocicletas
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-56 xl:w-64 flex-shrink-0">
            <div className="bg-white border border-[#e8e8e8] p-5 sticky top-24">
              <p className="font-display text-xs font-black tracking-widest uppercase text-[#111] mb-5">Filtros</p>

              {/* Search */}
              <div className="mb-5">
                <label className="font-display text-xs font-bold tracking-widest uppercase text-[#aaa] block mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Modelo o marca..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-[#e8e8e8] px-3 py-2 text-sm focus:outline-none focus:border-[#999] transition-colors bg-[#fafafa]"
                />
              </div>

              {/* Brand filter */}
              <div className="mb-5">
                <p className="font-display text-xs font-bold tracking-widest uppercase text-[#aaa] mb-3">Marca</p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => { setFilterBrand(''); setFilterCategory('') }}
                    className="w-full text-left font-display text-xs font-bold tracking-widest uppercase py-1.5 transition-colors"
                    style={{ color: !filterBrand ? '#111' : '#aaa' }}
                  >
                    Todas
                  </button>
                  {BRANDS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setFilterBrand(b.id); setFilterCategory('') }}
                      className="w-full text-left flex items-center gap-2 font-display text-xs font-bold tracking-widest uppercase py-1.5 transition-colors"
                      style={{ color: filterBrand === b.id ? b.primaryColor : '#aaa' }}
                    >
                      <span
                        className="w-2 h-2 rounded-sm flex-shrink-0"
                        style={{ background: b.primaryColor }}
                      />
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              {categories.length > 0 && (
                <div className="mb-5">
                  <p className="font-display text-xs font-bold tracking-widest uppercase text-[#aaa] mb-3">Categoría</p>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setFilterCategory('')}
                      className="w-full text-left font-display text-xs font-bold tracking-widest uppercase py-1.5 transition-colors"
                      style={{ color: !filterCategory ? '#111' : '#aaa' }}
                    >
                      Todas
                    </button>
                    {categories.map(([slug, name]) => (
                      <button
                        key={slug}
                        onClick={() => setFilterCategory(slug)}
                        className="w-full text-left font-display text-xs font-bold tracking-widest uppercase py-1.5 transition-colors"
                        style={{ color: filterCategory === slug ? '#111' : '#aaa' }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Year filter */}
              <div className="mb-5">
                <p className="font-display text-xs font-bold tracking-widest uppercase text-[#aaa] mb-3">Año</p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setFilterYear('')}
                    className="w-full text-left font-display text-xs font-bold tracking-widest uppercase py-1.5 transition-colors"
                    style={{ color: filterYear === '' ? '#111' : '#aaa' }}
                  >
                    Todos los años
                  </button>
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setFilterYear(year)}
                      className="w-full text-left flex items-center justify-between font-display text-xs font-bold tracking-widest uppercase py-1.5 transition-colors"
                      style={{ color: filterYear === year ? '#111' : '#aaa' }}
                    >
                      <span>{year}</span>
                      {year === CURRENT_YEAR && (
                        <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-[#111] text-white">
                          NUEVO
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* New only */}
              <div className="mb-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
                    style={{ background: filterNew ? '#111' : '#e0e0e0' }}
                    onClick={() => setFilterNew(!filterNew)}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      style={{ transform: filterNew ? 'translateX(20px)' : 'translateX(2px)' }}
                    />
                  </div>
                  <span className="font-display text-xs font-bold tracking-widest uppercase text-[#555]">
                    Solo nuevos
                  </span>
                </label>
              </div>

              {/* Reset */}
              {(filterBrand || filterCategory || filterYear !== CURRENT_YEAR || search || filterNew) && (
                <button
                  onClick={() => { setFilterBrand(''); setFilterCategory(''); setFilterYear(CURRENT_YEAR); setSearch(''); setFilterNew(false) }}
                  className="font-display text-xs font-black tracking-widest uppercase text-[#cc3333] hover:text-[#aa1111] transition-colors w-full text-left"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort & count bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="font-display text-sm font-bold text-[#999]">
                <span className="text-[#111]">{filtered.length}</span> modelos
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="font-display text-xs font-bold tracking-widest uppercase border border-[#e8e8e8] bg-white px-3 py-2 focus:outline-none text-[#555]"
              >
                <option value="year-desc">Más recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="model-asc">Modelo A–Z</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white border border-[#e8e8e8]">
                <p className="font-display text-4xl font-black uppercase text-[#eee] mb-3">Sin resultados</p>
                <p className="text-[#bbb] text-sm mb-6">Prueba con otros filtros.</p>
                <button
                  onClick={() => { setFilterBrand(''); setFilterCategory(''); setFilterYear(CURRENT_YEAR); setSearch(''); setFilterNew(false) }}
                  className="font-display text-sm font-black tracking-widest uppercase px-6 py-3 bg-[#111] text-white hover:bg-[#333] transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((moto) => (
                  <MotorcycleCard
                    key={moto.id}
                    motorcycle={moto}
                    onClick={setSelected}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <MotorcycleModal motorcycle={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  )
}
