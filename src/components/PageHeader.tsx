import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

const CELL = 64, SIGMA = 140, PULL = 0.42

/** Draws the hero grid and bends it toward the pointer, like a gravity well in spacetime. */
function useWarpGrid(head: React.RefObject<HTMLElement | null>, canvas: React.RefObject<HTMLCanvasElement | null>, target: React.MutableRefObject<{ x: number; y: number; on: boolean }>) {
  useEffect(() => {
    const h = head.current, c = canvas.current, ctx = c?.getContext('2d')
    if (!h || !c || !ctx) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, ht = 0, raf = 0, k = 0, cx = 0, cy = 0
    const draw = () => {
      raf = 0
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, ht)
      ctx.strokeStyle = getComputedStyle(h).getPropertyValue('--grid').trim() || 'rgba(128,128,128,.05)'
      ctx.lineWidth = 1
      const warp = (x: number, y: number): [number, number] => {
        if (k < 0.002) return [x, y]
        const dx = x - cx, dy = y - cy, f = PULL * k * Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA))
        return [x - dx * f, y - dy * f]
      }
      ctx.beginPath()
      for (let x = -1; x <= w + CELL; x += CELL) {
        for (let y = 0; y <= ht + 8; y += 8) { const [px, py] = warp(x, y); y ? ctx.lineTo(px, py) : ctx.moveTo(px, py) }
      }
      for (let y = -1; y <= ht + CELL; y += CELL) {
        for (let x = 0; x <= w + 8; x += 8) { const [px, py] = warp(x, y); x ? ctx.lineTo(px, py) : ctx.moveTo(px, py) }
      }
      ctx.stroke()
      const light = document.documentElement.dataset.theme === 'light'
      if (k > 0.01) {
        // the lines catch a little light where they bend most
        const brand = getComputedStyle(h).getPropertyValue('--brand-text').trim() || '#62c3ee'
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIGMA * 1.7)
        g.addColorStop(0, brand); g.addColorStop(1, `color-mix(in srgb, ${brand} 0%, transparent)`)
        ctx.strokeStyle = g; ctx.globalAlpha = (light ? 0.14 : 0.42) * k; ctx.lineWidth = light ? 1 : 1.2
        ctx.stroke(); ctx.globalAlpha = 1
      }
      // ease toward the pointer (or back to flat), keep animating until settled
      const t = target.current, goal = t.on && !still ? 1 : 0
      cx += (t.x - cx) * 0.2; cy += (t.y - cy) * 0.2
      k += (goal - k) * 0.12
      if (Math.abs(goal - k) > 0.002 || (goal && Math.hypot(t.x - cx, t.y - cy) > 0.5)) raf = requestAnimationFrame(draw)
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const size = () => {
      const r = h.getBoundingClientRect(), dpr = window.devicePixelRatio || 1
      w = r.width; ht = r.height
      c.width = Math.round(w * dpr); c.height = Math.round(ht * dpr)
      kick()
    }
    const ro = new ResizeObserver(size); ro.observe(h)
    const mo = new MutationObserver(kick); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    c.addEventListener('warp', kick)
    size()
    return () => { c.removeEventListener('warp', kick); ro.disconnect(); mo.disconnect(); cancelAnimationFrame(raf) }
  }, [head, canvas, target])
}

export function PageHeader({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede: ReactNode; children?: ReactNode }) {
  const head = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const target = useRef({ x: 0, y: 0, on: false })
  useWarpGrid(head, canvas, target)
  const aim = (e: React.PointerEvent<HTMLElement>, on: boolean) => {
    const r = e.currentTarget.getBoundingClientRect()
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top, on }
    canvas.current?.dispatchEvent(new Event('warp'))
  }
  return (
    <header ref={head} className="page-head" onPointerMove={(e) => aim(e, true)} onPointerLeave={(e) => aim(e, false)}>
      <canvas ref={canvas} className="page-head__warp" aria-hidden="true" />
      <div className="container">
        <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
        <Reveal delay={1}><h1 className="display">{title}</h1></Reveal>
        <Reveal delay={2}><p className="lede">{lede}</p></Reveal>
        {children && <Reveal delay={3}>{children}</Reveal>}
      </div>
    </header>
  )
}
