import { useEffect, useRef, useState } from 'react'

export function usePrefersReducedMotion() {
  const [r, setR] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setR(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return r
}

/** true once the element has entered the viewport (stays true unless `repeat`) */
export function useInView<T extends Element>(opts: { threshold?: number; rootMargin?: string; repeat?: boolean } = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (!opts.repeat) io.disconnect() } else if (opts.repeat) setInView(false)
    }, { threshold: opts.threshold ?? 0.15, rootMargin: opts.rootMargin ?? '0px 0px -8% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [opts.threshold, opts.rootMargin, opts.repeat])
  return [ref, inView] as const
}

/** 0..1 progress of an element passing through the viewport, written to a CSS variable (no re-renders) */
export function useScrollProgress<T extends HTMLElement>(name = '--p') {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = calm ? 1 : Math.min(1, Math.max(0, -r.top / Math.max(total, 1)))
      el.style.setProperty(name, p.toFixed(4))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [name])
  return ref
}
