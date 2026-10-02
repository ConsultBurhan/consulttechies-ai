import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'bct-theme'

const systemTheme = (): Theme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
const stored = (): Theme | null => {
  try { const v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : null } catch { return null }
}
const apply = (t: Theme) => document.documentElement.setAttribute('data-theme', t)

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.getAttribute('data-theme') as Theme) || stored() || systemTheme())

  // follow the OS only until the visitor makes an explicit choice
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => { if (!stored()) { const t = systemTheme(); apply(t); setTheme(t) } }
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

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
