import { Link } from 'react-router'
import { useCatalog } from '../../data/CatalogContext'
import LeadForm from '../LeadForm'
import logoImg from '@/imports/motoapex-logo.png'

export default function Footer() {
  const { brands: BRANDS } = useCatalog()
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
            <div className="space-y-3">
              {[
                { l: 'Dirección', v: 'San José, Costa Rica — Zona Industrial Pavas' },
                { l: 'Teléfono', v: '+506 2200 0000' },
                { l: 'WhatsApp', v: '+506 8800 0000' },
                { l: 'Email', v: 'ventas@motoapexcr.com' },
                { l: 'Horario', v: 'Lun–Sáb 8:00 am – 6:00 pm' },
              ].map((item) => (
                <div key={item.l} className="flex gap-5 items-start">
                  <p className="font-display text-xs font-black tracking-widest uppercase text-white/40 w-20 flex-shrink-0 pt-0.5">
                    {item.l}
                  </p>
                  <p className="text-sm text-white/70">{item.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <LeadForm dark />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={logoImg} alt="Moto Apex Costa Rica" width={1254} height={1254} loading="lazy" className="h-16 w-16 object-contain" />
          <span className="text-white/30 text-xs">© {year} Moto Apex Costa Rica</span>
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
          <span className="text-white/20 text-xs mx-1">|</span>
          {['Instagram', 'Facebook', 'WhatsApp'].map((s) => (
            <a
              key={s}
              href="#"
              className="font-display text-xs tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
