import { createBrowserRouter, Outlet, useLocation, useParams } from 'react-router'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import BrandPage from './pages/BrandPage'
import CatalogPage from './pages/CatalogPage'
import PromotionsPage, { PromotionDetailPage } from './pages/PromotionsPage'
import PublicPage from './pages/PublicPage'
import PublicSite from './components/PublicSite'
import ResourceStatus from './components/ResourceStatus'
import { usePublicResource } from './data/PublicDataContext'
import { parseSettings } from './api/content'
import { useCatalog } from './data/CatalogContext'

function Root() {
  const { pathname, hash } = useLocation()
  const settings = usePublicResource('settings', parseSettings)
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return (
    <div className="min-h-screen flex flex-col">
      <PublicSite />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      {settings.error && <ResourceStatus resource={settings} label="ajustes públicos" />}
    </div>
  )
}

function BrandOrPage() {
  const { brand } = useParams()
  const catalog = useCatalog()
  if (catalog.loading || catalog.error || catalog.brands.some(b => b.slug === brand)) return <BrandPage />
  return <PublicPage slug={brand} />
}

function NotFound() {
  return (
    <main className="pt-24 min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <p className="font-display text-[8rem] font-black leading-none text-[#eee]">404</p>
        <h1 className="font-display text-3xl font-black uppercase text-[#111] mb-3">
          Página no encontrada
        </h1>
        <p className="text-[#aaa] mb-8">La ruta que buscas no existe.</p>
        <a
          href="/"
          className="font-display text-sm font-black tracking-widest uppercase px-8 py-3.5 bg-[#111] text-white hover:bg-[#333] transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </main>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'motocicletas', Component: CatalogPage },
      { path: 'promociones', Component: PromotionsPage },
      { path: 'promociones/:slug', Component: PromotionDetailPage },
      { path: 'paginas/:slug', Component: PublicPage },
      { path: ':brand', Component: BrandOrPage },
      { path: '*', Component: NotFound },
    ],
  },
])
