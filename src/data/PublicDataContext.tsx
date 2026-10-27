import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { ApiError, request, requestDiagnostics } from '../api/client'

export interface Resource<T> { data?: T; loading: boolean; error?: ApiError; retryAt: number; reload: () => void }
type Entry = Omit<Resource<unknown>, 'reload'> & { updatedAt: number }
type Parser = (v: unknown) => unknown
const CACHE_TTL = 60000
const Context = createContext<{ entries: Record<string, Entry>; load: (path: string, parse: Parser, force?: boolean) => void; watch: (path: string, parse: Parser) => () => void } | null>(null)
export default function PublicDataProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Record<string, Entry>>({})
  const cache = useRef<Record<string, Entry>>({})
  const flights = useRef(new Map<string, AbortController>())
  const watchers = useRef(new Map<string, { count: number; parse: Parser }>())
  const load = useCallback((path: string, parse: Parser, force = false) => {
    const previous = cache.current[path]
    if (flights.current.has(path) || (previous && previous.retryAt > Date.now())) return
    if (previous && !force && (previous.error || Date.now() - previous.updatedAt < CACHE_TTL)) return
    const controller = new AbortController()
    flights.current.set(path, controller)
    const update = (entry: Entry) => { cache.current[path] = entry; setEntries(current => ({ ...current, [path]: entry })) }
    // Keep successful content in place during revalidation, without a second overlay.
    update({ ...previous, loading: previous?.data === undefined, error: undefined, retryAt: 0, updatedAt: previous?.updatedAt ?? 0 })
    request<unknown>(path, { signal: controller.signal }).then(raw => {
      if (controller.signal.aborted) return
      let data: unknown
      try { data = parse(raw) } catch { throw new ApiError('La API devolvió contenido no válido. Intenta de nuevo más tarde.', 200, 0, requestDiagnostics.get(path)?.requestId || '', 'INVALID_CONTENT') }
      update({ data, loading: false, retryAt: 0, updatedAt: Date.now() })
    }).catch(error => {
      if (controller.signal.aborted) return
      const failure = error instanceof ApiError ? error : new ApiError('No se pudo cargar el contenido.')
      update({ loading: false, error: failure, retryAt: failure.status === 429 ? Date.now() + failure.retryAfter * 1000 : 0, updatedAt: Date.now() })
    }).finally(() => { if (flights.current.get(path) === controller) flights.current.delete(path) })
  }, [])
  const watch = useCallback((path: string, parse: Parser) => {
    const previous = watchers.current.get(path)
    watchers.current.set(path, { count: (previous?.count ?? 0) + 1, parse })
    load(path, parse)
    return () => {
      const item = watchers.current.get(path)
      if (item && item.count > 1) watchers.current.set(path, { ...item, count: item.count - 1 })
      else {
        watchers.current.delete(path)
        flights.current.get(path)?.abort()
        flights.current.delete(path)
        const cached = cache.current[path]
        if (cached?.loading) {
          delete cache.current[path]
          setEntries(current => { const next = { ...current }; delete next[path]; return next })
        }
      }
    }
  }, [load])
  useEffect(() => {
    const refresh = (focus = false) => {
      if (document.visibilityState !== 'visible') return
      for (const [path, { parse }] of watchers.current) {
        const entry = cache.current[path]
        if (!entry?.error && (!entry || Date.now() - entry.updatedAt >= (focus ? 5000 : CACHE_TTL))) load(path, parse, true)
      }
    }
    const onFocus = () => refresh(true)
    const timer = setInterval(() => refresh(), 15000)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
      flights.current.forEach(controller => controller.abort())
      flights.current.clear()
      for (const path of Object.keys(cache.current)) if (cache.current[path].loading) delete cache.current[path]
    }
  }, [load])
  return <Context.Provider value={{ entries, load, watch }}>{children}</Context.Provider>
}
export function usePublicResource<T>(path: string, parse: (v: unknown) => T): Resource<T> {
  const context = useContext(Context)
  if (!context) throw new Error('Falta PublicDataProvider')
  const { load, entries, watch } = context
  useEffect(() => watch(path, parse), [watch, path, parse])
  const reload = useCallback(() => load(path, parse, true), [load, path, parse])
  return { ...(entries[path] as Entry || { loading: true, retryAt: 0 }), reload } as Resource<T>
}
