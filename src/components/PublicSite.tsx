import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { parseContact, parseSettings } from '../api/content'
import { usePublicResource } from '../data/PublicDataContext'

export const useContact = () => usePublicResource('contact', parseContact)
export default function PublicSite() {
  const contact = useContact()
  const settings = usePublicResource('settings', parseSettings)
  const { pathname } = useLocation()
  useEffect(() => {
    const icon = contact.data?.faviconUrl
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(node => node.remove())
    if (!icon) return
    const elements = ['icon', 'apple-touch-icon'].map(rel => { const link = document.createElement('link'); link.rel = rel; link.href = icon; document.head.appendChild(link); return link })
    return () => elements.forEach(node => node.remove())
  }, [contact.data?.faviconUrl])
  useEffect(() => {
    const base = settings.data?.find(s => s.key === 'site_url')?.value
    if (!base) return
    const link = document.createElement('link')
    link.rel = 'canonical'; link.href = new URL(pathname, base).href
    document.querySelector('link[rel="canonical"]')?.remove()
    document.head.appendChild(link)
    return () => link.remove()
  }, [settings.data, pathname])
  return null
}
export function PublicLogo({ className, priority = false }: { className: string; priority?: boolean }) {
  const { data } = useContact()
  return data?.logoUrl ? <img src={data.logoUrl} alt={data.businessName} width={256} height={256} fetchPriority={priority ? 'high' : 'auto'} className={className} /> : <span className="font-display font-black uppercase text-sm leading-tight max-w-[160px]">{data?.businessName || 'Inicio'}</span>
}
