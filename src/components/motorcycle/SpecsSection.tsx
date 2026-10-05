import { useState } from 'react'
import type { Spec } from '../../types'

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
              <span className="font-display text-xs font-black tracking-widest uppercase text-[#333]">
                {group}
              </span>
              <svg
                className={`w-4 h-4 text-[#999] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="divide-y divide-[#f5f5f5]">
                {groupSpecs.map((spec) => (
                  <div key={spec.label} className="flex gap-4 px-4 py-2.5">
                    <span className="text-xs text-[#aaa] w-32 flex-shrink-0 pt-0.5">{spec.label}</span>
                    <span className="text-sm text-[#333] font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
