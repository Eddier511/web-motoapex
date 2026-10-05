import { test, expect, type Page } from '@playwright/test'
import { testContact } from './public-fixtures'

const brand = { id: '101', name: 'Marca pública', slug: 'marca-publica', primaryColor: '#cc0000' }
const related = (id: string, showPrice = true, allowQuote = true) => ({ id: `rel-${id}`, motorcycleId: id, currency: 'USD', originalPrice: 10000, promoPrice: 9000, motorcycle: { id, slug: `modelo-${id}`, model: `Modelo ${id}`, version: 'S', year: 2026, showPrice, allowQuote, brand } })
const promotion = { id: '601', slug: 'oferta-publica', title: 'Oferta pública', description: 'Varios modelos, precios individuales.', imageUrl: 'https://images.example.test/promotion.png', brand, motorcycles: [related('301'), related('302', false, false), { ...related('303', true, false), currency: 'CRC', originalPrice: 2000000, promoPrice: 1800000 }], startsAt: '2026-10-01T00:00:00Z', endsAt: '2026-12-01T00:00:00Z', status: 'active', featured: true, showOnHome: true, order: 1, buttonLabel: 'Ver catálogo', buttonHref: '/motocicletas' }
const pageDocument = { id: '701', slug: 'acerca', title: 'Acerca de la tienda', contentFormat: 'blocks', content: [{ type: 'heading', text: 'Nuestra historia', level: 2 }, { type: 'paragraph', text: '<script>texto plano</script>' }, { type: 'image', url: 'https://images.example.test/page.png', alt: 'Imagen pública' }, { type: 'link', text: 'Ir al catálogo', href: '/motocicletas' }], status: 'published', order: 1, seo: { title: 'Acerca SEO', description: 'Descripción pública SEO' } }
const banner = { id: '801', title: 'Banner público', subtitle: 'Texto del servidor', imageUrl: 'https://images.example.test/desktop.png', mobileImageUrl: 'https://images.example.test/mobile.png', alt: 'Moto en carretera', brandSlug: brand.slug, accentColor: '#cc0000', ctaPrimary: { label: 'Ver ofertas', href: '/promociones' }, ctaSecondary: null, status: 'active' }
const contact = { ...testContact, phone: '+506 2222-1234', whatsapp: '+506 8888-1234', email: 'public@example.test', address: 'Dirección pública', latitude: 9.99, longitude: -84.1, hours: [{ day: 1, closed: false, opens: '08:00', closes: '17:00' }, { day: 7, closed: true, opens: null, closes: null }] }
const settings = [{ id: '1', key: 'site_url', value: 'https://motoapexcr.com', public: true, valueType: 'string' }, { id: '4', key: 'timezone', value: 'America/Costa_Rica', public: true, valueType: 'string' }, { id: '5', key: 'default_currency', value: 'CRC', public: true, valueType: 'string' }]
async function contentRoutes(page: Page, overrides: Record<string, unknown> = {}) {
  let leads = 0
  const requests: string[] = []
  const data: Record<string, unknown> = { brands: [], categories: [], motorcycles: [], promotions: [promotion, { ...promotion, id: '602', slug: 'solo-catalogo', title: 'Solo en promociones', showOnHome: false, featured: false, motorcycles: [] }], 'promotions/oferta-publica': promotion, 'banners?placement=home_hero': [banner], pages: [pageDocument], 'pages/acerca': pageDocument, contact, 'social-links': [{ id: '901', platform: 'instagram', label: 'Instagram público', url: 'https://www.instagram.com/public-test', status: 'active', order: 1 }, { id: '902', platform: 'youtube', label: 'YouTube público', url: 'https://www.youtube.com/@public-test', status: 'active', order: 2 }], settings, ...overrides }
  await page.route('https://**/*', async route => {
    const url = new URL(route.request().url())
    if (url.pathname.includes('/v1/public/')) {
      const path = url.pathname.split('/v1/public/')[1] + url.search
      requests.push(path)
      if (path === 'leads') { leads++; await route.abort(); return }
      await route.fulfill({ status: path in data ? 200 : 404, headers: { 'X-Request-ID': 'content-test-request', 'Access-Control-Expose-Headers': 'X-Request-ID' }, contentType: 'application/json', body: JSON.stringify(path in data ? { data: data[path] } : { error: { code: 'NOT_FOUND', message: 'No publicado' } }) })
    } else if (url.hostname === 'images.example.test') await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#888"/></svg>' })
    else await route.abort()
  })
  return { requests, leads: () => leads }
}

test('real shape banners, per-bike promotion prices, hidden values and quote permissions', async ({ page }) => {
  await contentRoutes(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Banner público' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ver ofertas', exact: true })).toBeVisible()
  await expect(page.getByText('Solo en promociones', { exact: true })).toHaveCount(0)
  const card = page.locator('[data-promotion-id="601"]')
  await expect(card).toBeVisible()
  await expect(card.locator('[data-motorcycle-id="301"]')).toContainText('9,000')
  await expect(card.locator('[data-motorcycle-id="303"]')).toContainText('₡1,800,000 CRC')
  await expect(card.locator('[data-motorcycle-id="303"]').getByRole('link', { name: 'Consultar', exact: true })).toHaveCount(0)
  const hidden = card.locator('[data-motorcycle-id="302"]')
  await expect(hidden).not.toContainText('9,000')
  await expect(hidden).not.toContainText('10,000')
  await expect(hidden.getByRole('link', { name: 'Consultar', exact: true })).toHaveCount(0)
  await expect(card.locator('[data-motorcycle-id="301"]').getByRole('link', { name: 'Consultar', exact: true })).toHaveAttribute('href', /motorcycleId=301/)
  await page.getByRole('link', { name: 'Ver ofertas', exact: true }).click()
  await expect(page.getByText('Solo en promociones', { exact: true })).toBeVisible()
  await page.locator('[data-promotion-id="601"]').getByRole('link', { name: 'Ver detalle', exact: true }).click()
  await expect(page).toHaveURL(/promociones\/oferta-publica$/)
  await expect(page.locator('main')).toContainText('Vigencia:')
  await page.screenshot({ path: 'test-results/public-promotion.png', fullPage: true })
})

test('banner image selects mobile and desktop fallback, null CTA and server order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await contentRoutes(page, { 'banners?placement=home_hero': [{ ...banner, id: '802', title: 'Primero del servidor', ctaPrimary: null }, { ...banner, mobileImageUrl: '' }] })
  await page.goto('/')
  const image = page.getByRole('img', { name: 'Moto en carretera', exact: true })
  await expect(page.getByRole('heading', { name: 'Primero del servidor' })).toBeVisible()
  await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.currentSrc)).toContain('/mobile.png')
  await expect(page.getByRole('link', { name: 'Ver ofertas', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Ir al slide 2', exact: true }).click()
  await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.currentSrc)).toContain('/desktop.png')
  await page.screenshot({ path: 'test-results/public-home-mobile.png', fullPage: true })
})

test('contact, logo, favicon, ordered socials and settings never create leads', async ({ page }) => {
  const network = await contentRoutes(page)
  await page.goto('/')
  await expect(page.locator('footer')).toContainText(contact.address)
  await expect(page.locator('footer')).toContainText('Lunes: 08:00 – 17:00')
  await expect(page.locator('footer')).toContainText('Domingo: Cerrado')
  await expect(page.locator('footer a[href^="https://wa.me/"]')).toHaveAttribute('href', 'https://wa.me/50688881234')
  await expect(page.locator('footer a[href^="tel:"]')).toHaveAttribute('href', 'tel:+50622221234')
  await expect(page.locator('footer a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:public@example.test')
  await expect(page.locator('header img')).toHaveAttribute('src', /\/assets\/motoapex-brand-.*\.webp$/)
  await expect(page.locator('header img')).toHaveJSProperty('naturalWidth', 256)
  await expect(page.locator('head link[rel="icon"]')).toHaveAttribute('href', testContact.faviconUrl)
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://motoapexcr.com/')
  const socialNav = page.getByRole('navigation', { name: 'Redes sociales', exact: true })
  const instagram = socialNav.getByRole('link', { name: 'Instagram público', exact: true })
  await expect(instagram).toHaveAttribute('data-platform', 'instagram')
  await expect(instagram.locator('svg')).toHaveCount(1)
  await instagram.hover()
  await expect(instagram.locator('span')).toHaveCSS('opacity', '1')
  expect(await socialNav.getByRole('link').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-label')))).toEqual(['Instagram público', 'YouTube público'])
  expect(network.requests.filter(p => p === 'contact')).toHaveLength(1)
  expect(network.leads()).toBe(0)
})

test('published structured page detail uses safe text, SEO and cached navigation', async ({ page }) => {
  const network = await contentRoutes(page)
  await page.goto('/')
  await page.locator('footer').getByRole('link', { name: pageDocument.title, exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Nuestra historia', exact: true })).toBeVisible()
  await expect(page.locator('main')).toContainText('<script>texto plano</script>')
  await expect(page.locator('main script')).toHaveCount(0)
  await expect(page).toHaveTitle('Acerca SEO')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Descripción pública SEO')
  await page.getByRole('link', { name: 'Inicio', exact: true }).click()
  await page.locator('footer').getByRole('link', { name: pageDocument.title, exact: true }).click()
  expect(network.requests.filter(p => p === 'pages/acerca')).toHaveLength(1)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Nuestra historia', exact: true })).toBeVisible()
})

test('empty modules have no example content or fake contact fallback', async ({ page }) => {
  await contentRoutes(page, { promotions: [], 'banners?placement=home_hero': [], pages: [], 'social-links': [], contact: { ...testContact, logoUrl: '', faviconUrl: '' } })
  await page.goto('/')
  await expect(page.locator('#root')).toHaveJSProperty('inert', false)
  await expect(page.locator('main picture')).toHaveCount(0)
  await expect(page.locator('[data-promotion-id]')).toHaveCount(0)
  await expect(page.locator('head link[rel="icon"]')).toHaveCount(0)
  await expect(page.locator('header img')).toHaveAttribute('src', /\/assets\/motoapex-brand-.*\.webp$/)
  await expect(page.locator('header img')).toHaveJSProperty('naturalWidth', 256)
  await expect(page.locator('footer')).toContainText('Los datos de contacto aún no están publicados.')
  await expect(page.locator('footer')).not.toContainText('2200 0000')
  await page.locator('header nav').getByRole('link', { name: 'Promociones', exact: true }).click()
  await expect(page.getByText('No hay promociones publicadas en este momento.')).toBeVisible()
})

test('429 exposes request ID, waits Retry-After and then retries independently', async ({ page }) => {
  await contentRoutes(page)
  let attempts = 0
  await page.route('**/v1/public/promotions', async route => {
    attempts++
    await route.fulfill({ status: attempts === 1 ? 429 : 200, headers: { 'Retry-After': '1', 'X-Request-ID': 'retry-public-123', 'Access-Control-Expose-Headers': 'Retry-After, X-Request-ID' }, contentType: 'application/json', body: JSON.stringify(attempts === 1 ? { error: { code: 'RATE_LIMITED', message: 'Esperar' } } : { data: [promotion] }) })
  })
  await page.goto('/promociones')
  await expect(page.locator('main')).toContainText('Referencia: retry-public-123')
  const retry = page.locator('main').getByRole('button', { name: /Reintentar/ })
  await expect(retry).toBeDisabled()
  await expect(retry).toBeEnabled({ timeout: 5000 })
  await retry.click()
  await expect(page.locator('[data-promotion-id="601"]')).toBeVisible()
  expect(attempts).toBe(2)
})

test('unsafe URLs, invalid content, private pages and HTTP errors remain explicit', async ({ page }) => {
  await contentRoutes(page, { 'banners?placement=home_hero': [{ ...banner, ctaPrimary: { label: 'Inseguro', href: '//evil.test' } }], pages: [{ ...pageDocument, status: 'draft' }], 'pages/acerca': { ...pageDocument, content: [{ type: 'html', text: '<b>no</b>' }] } })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Inseguro' })).toHaveCount(0)
  await expect(page.locator('footer').getByRole('link', { name: pageDocument.title })).toHaveCount(0)
  await expect(page.locator('main')).toContainText('contenido no válido')
  await page.goto('/paginas/acerca')
  await expect(page.locator('main')).toContainText('contenido no válido')
  await page.goto('/promociones/no-publicada')
  await expect(page.locator('main')).toContainText('Este contenido no está disponible.')
  await expect(page.locator('main')).toContainText('Referencia: content-test-request')
})

test('plain text page and general promotion without bikes do not invent prices', async ({ page }) => {
  await contentRoutes(page, { 'pages/acerca': { ...pageDocument, contentFormat: 'text', content: 'Primera línea\n<b>Segunda línea</b>' }, 'promotions/oferta-publica': { ...promotion, brand: null, motorcycles: [] } })
  await page.goto('/acerca')
  await expect(page.locator('main')).toContainText('<b>Segunda línea</b>')
  await expect(page.locator('main b')).toHaveCount(0)
  await page.goto('/promociones/oferta-publica')
  await expect(page.locator('main')).not.toContainText('USD')
  await expect(page.locator('[data-motorcycle-id]')).toHaveCount(0)
})
