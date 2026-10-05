import { Link } from 'react-router'
import { useCatalog } from '../../data/CatalogContext'
import LeadForm from '../LeadForm'
import { PublicLogo, useContact } from '../PublicSite'
import ContactDetails from '../ContactDetails'
import ResourceStatus from '../ResourceStatus'
import { parsePages, parseSocialLinks } from '../../api/content'
import { usePublicResource } from '../../data/PublicDataContext'
import SocialLinks from '../SocialLinks'
import { useEffect } from 'react'

export default function Footer() {
  const { brands: BRANDS } = useCatalog()
  const contact = useContact()
  const socials = usePublicResource('social-links', parseSocialLinks)
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') socials.reload() }
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [socials.reload])
  const pages = usePublicResource('pages', parsePages)
  const year = new Date().getFullYear()

  return (
    <footer id="contacto" className="bg-[#111] text-white">
      {/* Contact bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid md:grid-cols-2 gap-10">
          <div>
            <p className="font-display text-xs tracking-[0.35em] uppercase text-white/40 mb-3">
              Contáctenos
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase leading-none mb-8">
              Hablemos<br />
              <span className="text-white/20">de tu moto</span>
            </h2>
            <ContactDetails />
            <SocialLinks links={socials.data || []} />
          </div>

          {/* Contact form */}
          <LeadForm dark />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <PublicLogo className="h-16 w-16 object-contain" />
          <span className="text-white/30 text-xs">© {year} {contact.data?.businessName}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {BRANDS.map((b) => (
            <Link
              key={b.id}
              to={`/${b.slug}`}
              className="font-display text-xs font-bold tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors"
            >
              {b.name}
            </Link>
          ))}
          {pages.data?.map(p => <Link key={p.id} to={`/paginas/${p.slug}`} className="font-display text-xs tracking-widest uppercase text-white/30 hover:text-white/60">{p.title}</Link>)}
        </div>
      </div>
      <ResourceStatus resource={socials} label="redes sociales" />
      <ResourceStatus resource={pages} label="páginas" />
    </footer>
  )
}
