import { useEffect } from 'react'
const defaultTitle = document.title
const defaultDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
export default function Seo({ title, description = defaultDescription }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = title || defaultTitle
    const values = [
      { attribute: 'name', key: 'description', content: description, fallback: defaultDescription },
      { attribute: 'property', key: 'og:title', content: title || defaultTitle, fallback: defaultTitle },
      { attribute: 'property', key: 'og:description', content: description, fallback: defaultDescription },
    ]
    const metas = values.map(value => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[${value.attribute}="${value.key}"]`)
      if (!meta) { meta = document.createElement('meta'); meta.setAttribute(value.attribute, value.key); document.head.appendChild(meta) }
      meta.content = value.content
      return { meta, fallback: value.fallback }
    })
    return () => { document.title = defaultTitle; metas.forEach(({ meta, fallback }) => { meta.content = fallback }) }
  }, [title, description])
  return null
}
