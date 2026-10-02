import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

/** Scroll-reveal wrapper. Content is visible without JS-driven motion when reduced motion is on (CSS handles it). */
export function Reveal({ as: Tag = 'div' as ElementType, delay = 0, className, children }: { as?: ElementType; delay?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const T = Tag as unknown as 'div'
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <T ref={ref as React.RefObject<HTMLDivElement>} data-reveal className={className} style={{ '--i': delay } as React.CSSProperties}>{children}</T>
}
