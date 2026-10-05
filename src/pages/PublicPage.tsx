import { createElement } from 'react'
import { Link, useParams } from 'react-router'
import { parsePage } from '../api/content'
import { usePublicResource } from '../data/PublicDataContext'
import { useCatalog } from '../data/CatalogContext'
import LoadingOverlay from '../components/LoadingOverlay'
import ResourceStatus from '../components/ResourceStatus'
import Seo from '../components/Seo'

export default function PublicPage({ slug: explicitSlug }: { slug?: string }) {
  const params = useParams()
  const slug = explicitSlug ?? params.slug ?? params.brand ?? ''
  const resource = usePublicResource(`pages/${encodeURIComponent(slug)}`, parsePage)
  const { loading } = useCatalog()
  const page = resource.data
  return <main className="pt-24 pb-16 min-h-screen">
    <Seo title={page ? page.seo.title || `${page.title} | MotoApex` : 'Página | MotoApex'} description={page?.seo.description} />
    {resource.loading && !loading && <LoadingOverlay />}
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <ResourceStatus resource={resource} label="página" />
      {page && <><h1 className="font-display text-4xl font-black uppercase mb-8">{page.title}</h1>
        <div className="space-y-6 text-[#666] leading-relaxed">
          {typeof page.content === 'string' ? <p className="whitespace-pre-line">{page.content}</p> : page.content.map((block, index) => {
            if (block.type === 'heading') return createElement(`h${block.level}`, { key: index, className: 'font-display text-2xl font-black text-[#111]' }, block.text)
            if (block.type === 'paragraph') return <p key={index} className="whitespace-pre-line">{block.text}</p>
            if (block.type === 'image') return <img key={index} src={block.url} alt={block.alt} loading="lazy" className="max-w-full h-auto" />
            return <Link key={index} to={block.href} className="underline">{block.text}</Link>
          })}
        </div>
      </>}
    </div>
  </main>
}
