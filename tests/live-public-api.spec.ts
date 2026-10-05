import { test, expect } from '@playwright/test'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
test('installed public API CORS from the exact deployed web origin (GET only)', async ({ page }, testInfo) => {
  test.skip(process.env.LIVE_PUBLIC_API !== '1', 'Opt-in live GET check; no writes or leads.')
  await page.route('**/*', route => ['image', 'font', 'media'].includes(route.request().resourceType()) ? route.abort() : route.continue())
  await page.goto('https://wheat-stinkbug-153908.hostingersite.com/', { waitUntil: 'domcontentloaded' })
  const report = await page.evaluate(async () => {
    const paths = ['brands', 'categories', 'motorcycles', 'promotions', 'banners?placement=home_hero', 'pages', 'contact', 'social-links', 'settings', 'promotions/not-published-check', 'pages/not-published-check']
    return Promise.all(paths.map(async path => {
      const response = await fetch(`https://darksalmon-quetzal-730302.hostingersite.com/v1/public/${path}`, { credentials: 'omit' })
      const envelope = await response.json()
      return { origin: location.origin, path, status: response.status, requestId: response.headers.get('X-Request-ID'), count: Array.isArray(envelope.data) ? envelope.data.length : null, validEnvelope: 'data' in envelope || 'error' in envelope }
    }))
  })
  for (const result of report) { expect(result.origin).toBe('https://wheat-stinkbug-153908.hostingersite.com'); expect(result.validEnvelope).toBe(true); expect(result.requestId).toBeTruthy(); expect(result.status).toBe(result.path.includes('not-published-check') ? 404 : 200) }
  await testInfo.attach('live-public-get-report', { body: JSON.stringify(report, null, 2), contentType: 'application/json' })
  writeFileSync('.tmp-live-browser-report.json', JSON.stringify(report, null, 2))
})

test('compiled web against installed API at the authorized origin, no API interception or POST', async ({ page }) => {
  test.skip(process.env.LIVE_PUBLIC_API !== '1', 'Opt-in live GET check; no writes or leads.')
  const origin = 'https://wheat-stinkbug-153908.hostingersite.com'
  let posts = 0
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url())
    if (request.method() !== 'GET') { posts++; await route.abort(); return }
    if (url.origin === origin) {
      if (/^\/assets\/[a-zA-Z0-9_.-]+$/.test(url.pathname)) {
        const file = resolve('dist', url.pathname.slice(1))
        await route.fulfill({ contentType: file.endsWith('.js') ? 'application/javascript' : 'text/css', body: readFileSync(file) })
      } else await route.fulfill({ contentType: 'text/html', body: readFileSync('dist/index.html') })
    } else if (['image', 'font', 'media'].includes(request.resourceType())) await route.abort()
    else await route.continue()
  })
  await page.goto(`${origin}/motocicletas`)
  await expect(page.locator('#root')).toHaveJSProperty('inert', false)
  await expect(page.locator('main h3').first()).toBeVisible()
  expect(await page.locator('main h3').count()).toBeGreaterThan(0)
  await page.getByPlaceholder('Modelo o marca...').fill('Adventure')
  await expect(page.locator('main h3').first()).toContainText(/Adventure/i)
  await page.getByPlaceholder('Modelo o marca...').fill('')
  const card = page.getByRole('button').filter({ has: page.locator('h3') }).first()
  await card.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('img').first()).toHaveAttribute('src', /^https:\/\//)
  await page.keyboard.press('Escape')
  await page.locator('header nav').getByRole('link', { name: 'Ducati', exact: true }).click()
  await expect(page).toHaveURL(/\/ducati$/)
  await expect(page.getByRole('button', { name: 'Todos', exact: true })).toHaveCSS('color', 'rgb(255, 255, 255)')
  await page.locator('header nav').getByRole('link', { name: 'Promociones', exact: true }).click()
  await expect(page.getByText('No hay promociones publicadas en este momento.')).toBeVisible()
  expect(posts).toBe(0)
})
