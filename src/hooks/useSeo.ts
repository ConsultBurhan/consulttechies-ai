import { useEffect } from 'react'
import { SITE } from '../content/site'

export function useSeo({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    const full = path === '/' ? `${SITE.name} — Enterprise AI that understands your business` : `${title} — ${SITE.name}`
    document.title = full
    const set = (sel: string, attr: string, val: string, create?: () => HTMLElement) => {
      let el = document.head.querySelector<HTMLElement>(sel)
      if (!el && create) { el = create(); document.head.appendChild(el) }
      el?.setAttribute(attr, val)
    }
    const meta = (key: 'name' | 'property', k: string) => () => { const m = document.createElement('meta'); m.setAttribute(key, k); return m }
    set('meta[name="description"]', 'content', description, meta('name', 'description'))
    set('meta[property="og:title"]', 'content', full, meta('property', 'og:title'))
    set('meta[property="og:description"]', 'content', description, meta('property', 'og:description'))
    set('meta[property="og:url"]', 'content', SITE.url + path, meta('property', 'og:url'))
    set('meta[name="twitter:title"]', 'content', full, meta('name', 'twitter:title'))
    set('link[rel="canonical"]', 'href', SITE.url + path, () => { const l = document.createElement('link'); l.rel = 'canonical'; return l })
  }, [title, description, path])
}
