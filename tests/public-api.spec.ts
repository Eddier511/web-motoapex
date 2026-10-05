import { test, expect, type Page } from '@playwright/test'

// Isolated contract fixtures only. They are never imported into the application.
const image = (id: string, order = 0, isPrimary = false) => ({ id, url: `https://images.example.test/${id}.png`, alt: id, order, isPrimary })
const categories = [
  { id: '201', slug: 'urbanas', name: 'Urbanas', brandId: '101', order: 1 },
  { id: '202', slug: 'aventura', name: 'Aventura', brandId: '', order: 2 },
]
const brand = { id: '101', slug: 'marca-real', name: 'Marca real', primaryColor: '#cc0000', secondaryColor: '#880000', accentLight: '#fff0f0', categories, heroImageUrl: '', tileImageUrl: '', tagline: '', slogan: '', description: 'Descripción de marca', order: 1 }
const motorcycle = {
  id: '301', slug: 'moto-real', brandId: '101', categoryId: '201', brandName: 'Marca real', brandColor: '#cc0000', categoryName: 'Urbanas',
  model: 'Modelo real', year: 2024, price: 7800000, currency: 'CRC', availability: 'reserved', showPrice: true, allowQuote: true, isFeatured: true,
  description: '<b>Texto sin HTML crudo</b>', specs: [{ group: 'Motor', label: 'Potencia', value: '44 HP' }],
  colorOptions: [
    { id: '401', name: 'Rojo', hex: '#ff0000', available: true, order: 0, images: [image('501', 0), image('502', 1, true)] },
    { id: '402', name: 'Azul', hex: '#0000ff', available: false, order: 1, images: [image('503')] },
    { id: '403', name: 'Negro', hex: '#000000', available: true, order: 2, images: [] },
  ],
}
const hidden = { ...motorcycle, id: '302', slug: 'oculta', model: 'Modelo oculto', categoryId: '202', categoryName: 'Aventura', year: 2023, showPrice: false, allowQuote: false, price: 987654321, promoPrice: 123456789, availability: 'sold-out', colorOptions: [] }
const coming = { ...motorcycle, id: '303', slug: 'futura', model: 'Modelo futuro', year: 2027, categoryId: '202', availability: 'coming-soon', price: undefined, cc: 0, hp: 0, isNew: true }

async function catalog(page: Page, motos: unknown[] = [motorcycle, hidden, coming]) {
  await page.route('https://**/*', async route => {
    const url = new URL(route.request().url())
    if (url.pathname.includes('/v1/public/')) {
      const kind = url.pathname.split('/').pop()
      const data = kind === 'brands' ? [brand] : kind === 'categories' ? categories : motos
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data }) })
    } else if (url.hostname === 'images.example.test') {
      await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#ddd"/></svg>' })
    } else await route.abort()
  })
}
const card = (page: Page, model = 'Modelo real') => page.getByRole('button').filter({ has: page.getByRole('heading', { name: model, exact: true }) })
async function fields(form: ReturnType<Page['locator']>) {
  await form.getByLabel('Nombre', { exact: true }).fill('Prueba de contrato')
  await form.getByLabel('Teléfono', { exact: true }).fill('88888888')
  await form.getByLabel('Email (opcional)', { exact: true }).fill('test@example.test')
  await form.getByLabel('Mensaje (opcional)', { exact: true }).fill('Consulta de prueba')
}

test('navigation, server IDs, categories, search, year, new and sorting', async ({ page }) => {
  await catalog(page)
  await page.goto('/motocicletas')
  await expect(page.getByRole('heading', { name: 'Modelo real', exact: true })).toBeVisible()
  await page.locator('aside').getByRole('button', { name: 'Marca real', exact: true }).click()
  await page.locator('aside').getByRole('button', { name: 'Urbanas', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Modelo oculto', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).click()
  await page.getByPlaceholder('Modelo o marca...').fill('oculto')
  await expect(page.getByRole('heading', { name: 'Modelo oculto', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).click()
  await page.locator('aside').getByRole('button', { name: '2024', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Modelo futuro', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).click()
  await page.getByText('Solo nuevos', { exact: true }).locator('..').locator('div').first().click()
  await expect(page.getByRole('heading', { name: 'Modelo real', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).click()
  await page.locator('main select').selectOption('price-asc')
  await expect(page.locator('main h3').first()).toHaveText('Modelo real')
  await page.locator('header nav').getByRole('link', { name: 'Marca real', exact: true }).click()
  await expect(page).toHaveURL(/marca-real$/)
  await page.getByRole('button', { name: 'Urbanas', exact: true }).click()
  await expect(page).toHaveURL(/category=urbanas/)
  await expect(page.getByRole('heading', { name: 'Modelo real', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Modelo oculto', exact: true })).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Modelo real', exact: true })).toBeVisible()
  await page.screenshot({ path: 'test-results/desktop-brand.png', fullPage: true })
})

test('color galleries, primary image, reserved status, specs and escaped descriptions', async ({ page }) => {
  await catalog(page)
  await page.goto('/motocicletas')
  const modelCard = card(page)
  await modelCard.getByRole('button', { name: 'Ver color Azul', exact: true }).click()
  await expect(modelCard.locator('img')).toHaveAttribute('src', /503/)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await card(page).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator('img').first()).toHaveAttribute('src', /503/)
  await dialog.getByRole('button', { name: 'Color Rojo', exact: true }).click()
  await expect(dialog.getByText('Reservado', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Pre-orden', { exact: true })).toHaveCount(0)
  await expect(dialog.getByText('<b>Texto sin HTML crudo</b>', { exact: true })).toBeVisible()
  await expect(dialog.locator('b')).toHaveCount(0)
  await expect(dialog.getByText('44 HP', { exact: true })).toBeVisible()
  await expect(dialog.locator('img').first()).toHaveAttribute('src', /502/)
  await dialog.getByRole('button', { name: 'Siguiente imagen', exact: true }).click()
  await expect(dialog.locator('img').first()).toHaveAttribute('src', /501/)
  await dialog.getByRole('button', { name: 'Color Azul', exact: true }).click()
  await expect(dialog.locator('img').first()).toHaveAttribute('src', /503/)
  await expect(dialog.getByText('Azul · No disponible', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Color Negro', exact: true }).click()
  await expect(dialog.getByText('Sin imágenes para este color', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
})

test('showPrice and allowQuote hide leaked prices and quoting in both forms', async ({ page }) => {
  await catalog(page)
  await page.goto('/motocicletas')
  await card(page, 'Modelo oculto').click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Precio no publicado', { exact: true })).toBeVisible()
  await expect(dialog).not.toContainText('987')
  await expect(dialog).not.toContainText('123')
  await expect(dialog.getByRole('link', { name: 'Cotizar por WhatsApp' })).toHaveCount(0)
  await expect(dialog.locator('option[value="quote"]')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await page.locator('footer select').first().selectOption('302')
  await expect(page.locator('footer option[value="quote"]')).toHaveCount(0)
})

test('lead payload uses server ID and confirms only after 201', async ({ page }) => {
  await catalog(page)
  let payload: Record<string, unknown> = {}
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/v1/public/leads', async route => {
    payload = route.request().postDataJSON()
    expect(route.request().headers()['authorization']).toBeUndefined()
    expect(route.request().headers()['content-type']).toBe('application/json')
    await gate
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ data: { id: '801' } }) })
  })
  await page.goto('/motocicletas')
  await card(page).click()
  const form = page.getByRole('dialog').locator('form')
  await fields(form)
  await form.getByRole('button', { name: 'Enviar consulta', exact: true }).click()
  await expect(form.getByRole('button', { name: 'Enviando…' })).toBeDisabled()
  await expect(page.getByText('Consulta enviada.', { exact: true })).toHaveCount(0)
  release()
  await expect(page.getByRole('dialog').getByText('Consulta enviada.', { exact: true })).toBeVisible()
  expect(payload).toEqual({ name: 'Prueba de contrato', phone: '88888888', email: 'test@example.test', type: 'quote', message: 'Consulta de prueba', motorcycleId: '301' })
})

for (const status of [200, 422, 500]) test(`lead HTTP ${status} never confirms success`, async ({ page }) => {
  await catalog(page)
  await page.route('**/v1/public/leads', route => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ data: { id: '801' } }) }))
  await page.goto('/')
  const form = page.locator('footer form')
  await fields(form)
  await form.getByRole('button', { name: 'Enviar consulta', exact: true }).click()
  await expect(form.getByRole('alert')).toBeVisible()
  await expect(page.getByText('Consulta enviada.', { exact: true })).toHaveCount(0)
})

test('lead 429 preserves inputs and enforces Retry-After', async ({ page }) => {
  await catalog(page)
  await page.route('**/v1/public/leads', route => route.fulfill({ status: 429, headers: { 'Retry-After': '2', 'Access-Control-Expose-Headers': 'Retry-After' }, body: '{}' }))
  await page.goto('/')
  const form = page.locator('footer form')
  await fields(form)
  await form.getByRole('button', { name: 'Enviar consulta', exact: true }).click()
  await expect(form.getByRole('alert')).toContainText('Demasiadas solicitudes')
  await expect(form.getByRole('button', { name: /Reintentar en/ })).toBeDisabled()
  await expect(form.getByLabel('Nombre', { exact: true })).toHaveValue('Prueba de contrato')
  await expect(form.getByRole('button', { name: 'Enviar consulta', exact: true })).toBeEnabled({ timeout: 5000 })
})

test('catalog loading, failure, retry and empty state never use fallback motos', async ({ page }) => {
  await catalog(page, [])
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/v1/public/motorcycles', async route => { await gate; await route.fulfill({ status: 503, body: '{}' }) })
  await page.goto('/motocicletas')
  await expect(page.getByText('Cargando catálogo…', { exact: true })).toBeVisible()
  release()
  await expect(page.getByRole('alert')).toContainText('No se pudo completar')
  await expect(page.locator('main h3')).toHaveCount(0)
  await page.unroute('**/v1/public/motorcycles')
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click()
  await expect(page.getByText(/El catálogo está vacío/)).toBeVisible()
})

test('catalog 429 disables retry and invalid response is an error', async ({ page }) => {
  await catalog(page)
  await page.route('**/v1/public/motorcycles', route => route.fulfill({ status: 429, headers: { 'Retry-After': '3', 'Access-Control-Expose-Headers': 'Retry-After' }, body: '{}' }))
  await page.goto('/motocicletas')
  await expect(page.getByRole('button', { name: /Reintentar en/ })).toBeDisabled()
  await page.unroute('**/v1/public/motorcycles')
  await page.route('**/v1/public/motorcycles', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"data":{}}' }))
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click({ timeout: 6000 })
  await expect(page.getByRole('alert')).toContainText('respuesta del catálogo no es válida')
})

test('mobile navigation opens brand page without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await catalog(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  await page.getByRole('button', { name: 'Marca real', exact: true }).click()
  await page.getByRole('link', { name: 'Urbanas', exact: true }).click()
  await expect(page).toHaveURL(/marca-real\?category=urbanas/)
  await expect(page.getByRole('heading', { name: 'Modelo real', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/mobile-brand.png', fullPage: true })
})

test('absent prices are never replaced by zero and all availability labels remain distinct', async ({ page }) => {
  await catalog(page, [coming, { ...motorcycle, id: '304', model: 'Modelo disponible', availability: 'available' }])
  await page.goto('/motocicletas')
  await expect(card(page, 'Modelo futuro')).toContainText('Precio no publicado')
  await expect(card(page, 'Modelo futuro')).toContainText('Próximamente')
  await expect(card(page, 'Modelo futuro').getByText('CC', { exact: true })).toHaveCount(0)
  await expect(card(page, 'Modelo futuro').getByText('HP', { exact: true })).toHaveCount(0)
  await expect(card(page, 'Modelo disponible')).toContainText('Disponible')
  await card(page, 'Modelo futuro').click()
  await expect(page.getByRole('dialog').getByText('Precio no publicado', { exact: true })).toBeVisible()
})

test('contact form sends availability with server ID when quote is disabled', async ({ page }) => {
  await catalog(page)
  let payload: Record<string, unknown> = {}
  await page.route('**/v1/public/leads', async route => {
    payload = route.request().postDataJSON()
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{"data":{"id":"802"}}' })
  })
  await page.goto('/')
  const form = page.locator('footer form')
  await fields(form)
  await form.locator('select').first().selectOption('301')
  await form.getByLabel('Tipo de consulta').selectOption('quote')
  await form.locator('select').first().selectOption('302')
  await form.getByRole('button', { name: 'Enviar consulta', exact: true }).click()
  await expect(page.locator('footer').getByText('Consulta enviada.', { exact: true })).toBeVisible()
  expect(payload.type).toBe('availability')
  expect(payload.motorcycleId).toBe('302')
})

test('malformed 201 and broken connection never show lead confirmation', async ({ page }) => {
  await catalog(page)
  await page.route('**/v1/public/leads', route => route.fulfill({ status: 201, contentType: 'application/json', body: '{"data":{}}' }))
  await page.goto('/')
  const form = page.locator('footer form')
  await fields(form)
  await form.getByRole('button', { name: 'Enviar consulta', exact: true }).click()
  await expect(form.getByRole('alert')).toContainText('No pudimos confirmar')
  await page.unroute('**/v1/public/leads')
  await page.route('**/v1/public/leads', route => route.abort())
  await form.getByRole('button', { name: 'Enviar consulta', exact: true }).click()
  await expect(form.getByRole('alert')).toContainText('verifica con un asesor')
  await expect(page.getByText('Consulta enviada.', { exact: true })).toHaveCount(0)
})

test('non-HTTPS gallery URLs never become image sources', async ({ page }) => {
  await catalog(page, [{ ...motorcycle, colorOptions: [{ id: '404', name: 'Seguro', hex: '#000000', available: true, images: [{ id: '900', url: 'http://unsafe.example.test/photo.png', alt: 'No segura' }] }] }])
  await page.goto('/motocicletas')
  await card(page).click()
  await expect(page.getByRole('dialog').getByText('Sin imágenes para este color', { exact: true })).toBeVisible()
  await expect(page.locator('img[src^="http:"]')).toHaveCount(0)
})
