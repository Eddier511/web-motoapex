import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { ApiError, request, requestDiagnostics } from '../api/client'

export interface Resource<T> { data?: T; loading: boolean; error?: ApiError; retryAt: number; reload: () => void }
type Entry = Omit<Resource<unknown>, 'reload'>
const Context = createContext<{ entries: Record<string, Entry>; load: (path: string, parse: (v: unknown) => unknown, force?: boolean) => void } | null>(null)
export default function PublicDataProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Record<string, Entry>>({})
  const cache = useRef<Record<string, Entry>>({})
  const load = useCallback((path: string, parse: (v: unknown) => unknown, force = false) => {
    const previous = cache.current[path]
    if (previous?.loading || (previous && !force) || (previous && previous.retryAt > Date.now())) return
    const update = (entry: Entry) => { cache.current[path] = entry; setEntries(current => ({ ...current, [path]: entry })) }
    update({ loading: true, retryAt: 0 })
    request<unknown>(path).then(raw => {
      let data: unknown
      try { data = parse(raw) } catch { throw new ApiError('La API devolvió contenido no válido. Intenta de nuevo más tarde.', 200, 0, requestDiagnostics.get(path)?.requestId || '', 'INVALID_CONTENT') }
      update({ data, loading: false, retryAt: 0 })
    }).catch(error => { const failure = error instanceof ApiError ? error : new ApiError('No se pudo cargar el contenido.'); update({ loading: false, error: failure, retryAt: failure.status === 429 ? Date.now() + failure.retryAfter * 1000 : 0 }) })
  }, [])
  return <Context.Provider value={{ entries, load }}>{children}</Context.Provider>
}
export function usePublicResource<T>(path: string, parse: (v: unknown) => T): Resource<T> {
  const context = useContext(Context)
  if (!context) throw new Error('Falta PublicDataProvider')
  const { load, entries } = context
  useEffect(() => { load(path, parse) }, [load, path, parse])
  const reload = useCallback(() => load(path, parse, true), [load, path, parse])
  return { ...(entries[path] as Entry || { loading: true, retryAt: 0 }), reload } as Resource<T>
}
