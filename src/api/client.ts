export class ApiError extends Error {
  constructor(message: string, public status = 0, public retryAfter = 0) { super(message) }
}

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://darksalmon-quetzal-730302.hostingersite.com/v1').replace(/\/$/, '')
if (!/^https:\/\/[^/]+\/v1$/.test(API_BASE_URL)) throw new Error('VITE_API_BASE_URL debe ser una URL HTTPS que termine en /v1')

export async function request<T>(path: string, init: RequestInit = {}, expectedStatus = 200): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(`${API_BASE_URL}/public/${path}`, {
      ...init, credentials: 'omit', signal: controller.signal,
      headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
    })
    if (response.status === 429) {
      const header = response.headers.get('Retry-After')
      const seconds = header && /^\d+$/.test(header) ? Number(header) : Math.ceil((Date.parse(header || '') - Date.now()) / 1000)
      throw new ApiError('Demasiadas solicitudes. Espera antes de volver a intentar.', 429, Number.isFinite(seconds) ? Math.max(1, seconds) : 60)
    }
    if (response.status !== expectedStatus) {
      const message = response.status === 422 ? 'Revisa los datos de la solicitud. La consulta puede no estar disponible para este modelo.' : 'No se pudo completar la solicitud. Intenta de nuevo más tarde.'
      throw new ApiError(message, response.status)
    }
    const envelope = await response.json()
    if (!envelope || !Object.prototype.hasOwnProperty.call(envelope, 'data')) throw new ApiError('La API devolvió una respuesta no válida.')
    return envelope.data as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(init.method === 'POST'
      ? 'No pudimos confirmar el envío. La conexión pudo interrumpirse; verifica con un asesor antes de repetir la consulta.'
      : 'No se pudo cargar el catálogo. Revisa la conexión o vuelve a intentar.')
  } finally { clearTimeout(timeout) }
}

export interface LeadInput {
  name: string
  phone: string
  email?: string
  type: 'quote' | 'availability' | 'test_ride' | 'contact' | 'whatsapp'
  message?: string
  motorcycleId?: string
}

export async function submitLead(input: LeadInput) {
  const data = await request<{ id: string }>('leads', { method: 'POST', body: JSON.stringify(input) }, 201)
  if (!data || typeof data.id !== 'string' || !data.id) throw new ApiError('No pudimos confirmar el envío de la consulta.')
  return data
}
