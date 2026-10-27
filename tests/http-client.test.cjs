const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')

async function client() {
  const source = fs.readFileSync('src/api/client.ts', 'utf8').replace(/import\.meta\.env/g, '({ VITE_API_BASE_URL: "https://api.example.test/v1" })')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}#${Math.random()}`)
}

test('already cancelled requests never reach fetch', async t => {
  const api = await client()
  let calls = 0
  t.mock.method(globalThis, 'fetch', async () => { calls++; return Response.json({ data: [] }) })
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(api.request('brands', { signal: controller.signal }), { name: 'AbortError' })
  assert.equal(calls, 0)
})

test('caller cancellation aborts in-flight fetch and preserves credentials omission', async t => {
  const api = await client()
  let options
  t.mock.method(globalThis, 'fetch', (_, init) => {
    options = init
    return new Promise((resolve, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }))
  })
  const controller = new AbortController()
  const pending = api.request('brands', { signal: controller.signal })
  controller.abort()
  await assert.rejects(pending, { name: 'AbortError' })
  assert.equal(options.signal.aborted, true)
  assert.equal(options.credentials, 'omit')
})

test('Retry-After HTTP date and X-Request-ID survive a 429', async t => {
  const api = await client()
  t.mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 429, headers: { 'Retry-After': new Date(Date.now() + 60000).toUTCString(), 'X-Request-ID': 'audit-429' } }))
  await assert.rejects(api.request('promotions'), error => error.status === 429 && error.retryAfter >= 58 && error.retryAfter <= 60 && error.requestId === 'audit-429')
})

test('timeout still aborts when an external signal is supplied', async t => {
  const api = await client()
  t.mock.timers.enable({ apis: ['setTimeout'] })
  let signal
  t.mock.method(globalThis, 'fetch', (_, init) => {
    signal = init.signal
    return new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }))
  })
  const pending = api.request('brands', { signal: new AbortController().signal })
  t.mock.timers.tick(15000)
  await assert.rejects(pending, error => error instanceof api.ApiError && error.status === 0)
  assert.equal(signal.aborted, true)
})
