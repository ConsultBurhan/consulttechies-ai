import { useCallback, useState } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'bct-theme'

// dark-first: the identity is designed dark; light is an explicit, saved choice
const systemTheme = (): Theme => 'dark'
const stored = (): Theme | null => {
  try { const v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null } catch { return null }
}
const apply = (t: Theme) => document.documentElement.setAttribute('data-theme', t)

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.getAttribute('data-theme') as Theme) || stored() || systemTheme())

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    const commit = () => { apply(next); setTheme(next); try { localStorage.setItem(KEY, next) } catch { /* private mode */ } }
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (doc.startViewTransition && !calm) {
      if (origin) {
        document.documentElement.style.setProperty('--tx', `${origin.x}px`)
        document.documentElement.style.setProperty('--ty', `${origin.y}px`)
      }
      doc.startViewTransition(commit)
    } else commit()
  }, [theme])

  return { theme, toggle }
}
