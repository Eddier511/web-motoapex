import type { SocialLink } from '../types'

function SocialIcon({ platform }: { platform: string }) {
  const common = { viewBox: '0 0 24 24', className: 'h-5 w-5', 'aria-hidden': true as const, focusable: false as const }
  switch (platform) {
    case 'instagram': return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
    case 'facebook': return <svg {...common} fill="currentColor"><path d="M14 22v-9h3l.5-4H14V7c0-1 .4-1.5 1.7-1.5H18V2.2A24 24 0 0 0 15 2c-3 0-5 1.8-5 5v2H7v4h3v9z" /></svg>
    case 'youtube': return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></svg>
    case 'tiktok': return <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v12.5a4.5 4.5 0 1 1-4-4.47M14 3c.6 3.4 2.5 5 6 5M14 7c1.8 2 3.7 3 6 3" /></svg>
    case 'x': return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 3h4.5L20 21h-4.5zM20 3 4 21" /></svg>
    case 'linkedin': return <svg {...common} fill="currentColor"><circle cx="5" cy="5" r="2" /><path d="M3 9h4v12H3zM10 9h4v1.6c.8-1.3 2-2 3.5-2 3 0 3.5 2.2 3.5 5V21h-4v-6.5c0-1.6-.2-2.6-1.5-2.6S14 13 14 14.5V21h-4z" /></svg>
    case 'whatsapp': return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 21l1.5-5A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="m8 7 2 3-1 1c1 2 2 3 4 4l1-1 3 2c-1 3-6 1-8-1s-4-7-1-8Z" /></svg>
    default: return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 8l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 0) scale(.9)" /></svg>
  }
}

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  if (!links.length) return null
  return <nav aria-label="Redes sociales" className="mt-8">
    <p className="font-display text-xs font-black tracking-widest uppercase text-white/40 mb-4">Síguenos</p>
    <div className="flex flex-wrap gap-3">{links.map(link => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
      aria-label={link.label} title={link.label} data-platform={link.platform}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 hover:bg-white hover:text-[#111] hover:border-white focus-visible:bg-white focus-visible:text-[#111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white transition-colors">
      <SocialIcon platform={link.platform} />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[160px] rounded-lg bg-white px-3 py-2 text-center text-xs font-medium text-[#111] shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">{link.label}</span>
    </a>)}</div>
  </nav>
}
