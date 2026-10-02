import { useEffect, useRef } from 'react'
import { readPalette } from './webgl'

/** live theme colors for three.js materials; updates when the theme toggles */
export function usePalette() {
  const ref = useRef(readPalette())
  useEffect(() => {
    const mo = new MutationObserver(() => { ref.current = readPalette() })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return ref
}
