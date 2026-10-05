import { useState } from 'react'
import type { Spec } from '../../types'
import { safeHttps } from '../../api/content'

interface SpecsSectionProps {
  specs: Spec[]
  brandColor: string
}

export default function SpecsSection({ specs, brandColor }: SpecsSectionProps) {
  const groups = [...new Set(specs.map((s) => s.group))]
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set([groups[0]]))

  const toggle = (group: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(group) ? next.delete(group) : next.add(group)
      return next
    })
  }

  return (
    <div className="space-y-1">
      <p className="font-display text-xs font-bold tracking-widest uppercase text-[#aaa] mb-3">
        Especificaciones técnicas
      </p>
      {groups.map((group) => {
        const groupSpecs = specs.filter((s) => s.group === group)
        const isOpen = openGroups.has(group)
        return (
          <div key={group} className="border border-[#ececec] overflow-hidden">
            <button
              onClick={() => toggle(group)}
              className="w-full flex items-center justify-between px-4 py-3 text-left bg-[#fafafa] hover:bg-[#f5f5f5] transition-colors"
            >
              <span className="min-w-0 [overflow-wrap:anywhere] font-display text-xs font-black tracking-widest uppercase text-[#333]">
                {group}
              </span>
              <svg
                className={`w-4 h-4 shrink-0 ml-3 text-[#999] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="divide-y divide-[#f5f5f5]">
                {groupSpecs.map((spec) => {
                  const href = safeHttps(spec.value.trim())
                  return <div key={spec.label} className="grid grid-cols-[minmax(0,6rem)_minmax(0,1fr)] sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-3 sm:gap-4 px-4 py-2.5">
                    <span className="min-w-0 text-xs text-[#aaa] [overflow-wrap:anywhere] whitespace-pre-wrap pt-0.5">{spec.label}</span>
                    {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 min-w-0 max-w-full w-fit self-start border rounded-sm px-3 py-2.5 font-display text-xs font-bold hover:opacity-75 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: brandColor, background: `${brandColor}0d`, borderColor: `${brandColor}40` }}>
                      <span className="min-w-0 [overflow-wrap:anywhere]">{spec.label || 'Abrir enlace'}</span>
                      <svg className="w-3.5 h-3.5 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 3h7v7M21 3l-9 9M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></svg>
                    </a> : <span className="min-w-0 text-sm text-[#333] font-medium whitespace-pre-wrap [overflow-wrap:anywhere]">{spec.value}</span>}
                  </div>
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
