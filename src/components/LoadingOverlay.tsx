import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function LoadingOverlay() {
  const dialog = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const root = document.getElementById('root')
    const previousFocus = document.activeElement
    const previousInert = root?.inert ?? false
    const { scrollX, scrollY } = window
    const body = document.body
    const properties = ['position', 'top', 'left', 'width', 'overflow'] as const
    const previousStyles = properties.map(property => [property, body.style.getPropertyValue(property), body.style.getPropertyPriority(property)] as const)
    if (root) root.inert = true
    body.style.position = 'fixed'
    body.style.top = `${-scrollY}px`
    body.style.left = `${-scrollX}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    dialog.current?.focus({ preventScroll: true })

    return () => {
      if (root) root.inert = previousInert
      for (const [property, value, priority] of previousStyles) {
        if (value) body.style.setProperty(property, value, priority)
        else body.style.removeProperty(property)
      }
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' })
      if (previousFocus instanceof HTMLElement && previousFocus !== body && previousFocus.isConnected) previousFocus.focus({ preventScroll: true })
      if (document.activeElement === body || !document.activeElement || document.activeElement === dialog.current) {
        const main = root?.querySelector('main')
        if (main) {
          const previousTabIndex = main.getAttribute('tabindex')
          main.tabIndex = -1
          main.focus({ preventScroll: true })
          main.addEventListener('blur', () => {
            if (previousTabIndex === null) main.removeAttribute('tabindex')
            else main.setAttribute('tabindex', previousTabIndex)
          }, { once: true })
        }
      }
    }
  }, [])

  return createPortal(
    <div className="loading-backdrop fixed inset-0 z-[1000] flex items-center justify-center p-5">
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={titleId}
        aria-describedby={descriptionId} tabIndex={-1}
        onKeyDown={event => { if (event.key === 'Tab') { event.preventDefault(); dialog.current?.focus() } }}
        className="loading-popup w-full max-w-[360px] rounded-3xl bg-white p-8 text-center outline-none">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
          <svg aria-hidden="true" className="loading-spinner h-7 w-7 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 3a9 9 0 1 1-9 9" />
          </svg>
        </div>
        <div role="status" aria-live="polite" aria-atomic="true">
          <h2 id={titleId} className="text-xl font-semibold tracking-tight text-[#18181b]">Cargando experiencia</h2>
          <p id={descriptionId} className="mt-2 text-sm text-[#868b98]">Un momento, estamos preparando tu visita.</p>
        </div>
        <div role="progressbar" aria-label="Carga en curso" className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-orange-100">
          <div className="loading-progress absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
        </div>
      </div>
    </div>,
    document.body,
  )
}
