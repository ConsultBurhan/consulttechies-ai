import { useEffect, useMemo, useRef } from 'react'
import { ALL, ECOSYSTEM } from '../../content/clients'

const F = 1000
const G = ECOSYSTEM.length
// where each group's three logos settle in the shared 3D space (unit coordinates; y grows downward)
const SLOTS: [number, number, number][][] = [
  [[-0.78, 0.12, -0.25], [0, -0.18, 0.3], [0.78, 0.12, -0.25]],      // arc
  [[-0.78, -0.32, 0.45], [0, 0, 0], [0.78, 0.32, -0.45]],           // descending stair
  [[-0.8, 0, -0.55], [0, 0, 0.1], [0.8, 0, 0.75]],                  // depth line
  [[-0.78, 0.32, -0.4], [0, 0, 0], [0.78, -0.32, 0.4]],             // ascending stair
]
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const byId = Object.fromEntries(ALL.map((c) => [c.id, c]))

/** Scroll-driven client ecosystem. One pinned 3D space; as you scroll, each group of clients arrives from depth, takes its formation, and hands over to the next. */
export function ClientEcosystem() {
  const root = useRef<HTMLElement>(null), sticky = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null)
  const nodes = useMemo(() => ECOSYSTEM.flatMap((g, gi) => g.ids.map((id, j) => ({ c: byId[id], gi, j }))), [])
  const nodeEls = useRef<(HTMLDivElement | null)[]>([]), textEls = useRef<(HTMLDivElement | null)[]>([]), rings = useRef<(HTMLSpanElement | null)[]>([]), ticks = useRef<(HTMLLIElement | null)[]>([]), fill = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const rootEl = root.current, stg = stage.current, stick = sticky.current; if (!rootEl || !stg || !stick) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const st = { tt: 0, mx: 0, my: 0, yaw: 0, pitch: 0, k: 1, w: 800, run: true, accent: -1, hot: -1 }
    const hov = nodes.map(() => 0)
    let raf = 0
    const size = () => { const r = stg.getBoundingClientRect(); st.w = r.width; st.k = Math.min(1, Math.max(0.42, r.width / 900)) }
    const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; const r = stg.getBoundingClientRect(); st.mx = ((e.clientX - r.left) / r.width - 0.5) * 2; st.my = ((e.clientY - r.top) / r.height - 0.5) * 2 }
    const leave = () => { st.mx = 0; st.my = 0 }
    const frame = (now: number) => {
      raf = 0; if (!st.run) return
      const t = now / 1000
      const r = rootEl.getBoundingClientRect(), total = Math.max(1, r.height - window.innerHeight)
      const p = Math.min(1, Math.max(0, -r.top / total)), g = p * (G - 1), fl = Math.min(G - 2, Math.floor(g))
      const target = fl + smooth(0.22, 0.78, g - fl)                       // holds on each group, glides between
      st.tt += (target - st.tt) * 0.1
      st.yaw += ((st.mx * 0.3 + (st.tt - 1.5) * 0.16 + Math.sin(t * 0.2) * 0.04) - st.yaw) * 0.06
      st.pitch += ((-st.my * 0.14) - st.pitch) * 0.06
      const cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch)
      const sx = 400 * st.k, sY = 190 * st.k, sz = 320 * st.k, W = 188 * st.k
      nodes.forEach((n, i) => {
        const el = nodeEls.current[i]; if (!el) return
        const d = st.tt - n.gi, a = Math.min(1, Math.max(0, 1 - Math.abs(d) * 1.7)), ae = a * a * (3 - 2 * a), dir = d < 0 ? 1 : -1
        const [ux, uy, uz] = SLOTS[n.gi][n.j], away = 1 - ae
        hov[i] += ((st.hot === i ? 1 : 0) - hov[i]) * 0.15
        const x0 = ux * sx + dir * away * sx * 1.7, y0 = uy * sY - away * sY * 0.5 + Math.sin(t * 0.8 + i * 1.3) * 6 * st.k, z0 = uz * sz - away * sz * 2.4 + hov[i] * 120 * st.k
        const x1 = x0 * cy + z0 * sy, z1 = -x0 * sy + z0 * cy, y2 = y0 * cp - z1 * sp, z2 = y0 * sp + z1 * cp, s = F / (F - z2)
        el.style.width = `${W}px`
        el.style.transform = `translate3d(${(x1 * s).toFixed(1)}px, ${(y2 * s).toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)}) perspective(700px) rotateY(${(away * dir * -55).toFixed(1)}deg)`
        el.style.opacity = ae.toFixed(2)
        el.style.filter = `blur(${(away * 3).toFixed(1)}px)`
        el.style.zIndex = String(Math.round(z2 + 1000))
        el.style.pointerEvents = ae > 0.6 ? 'auto' : 'none'
        el.style.setProperty('--lab', (ae > 0.55 || hov[i] > 0.3 ? 1 : 0).toString())
      })
      textEls.current.forEach((el, i) => { if (!el) return; const d = st.tt - i, a = Math.min(1, Math.max(0, 1 - Math.abs(d) * 1.9)); el.style.opacity = a.toFixed(2); el.style.transform = `translateY(${(-d * 46).toFixed(1)}px)`; el.style.filter = `blur(${((1 - a) * 4).toFixed(1)}px)`; el.style.pointerEvents = a > 0.6 ? 'auto' : 'none'; el.setAttribute('aria-hidden', a > 0.5 ? 'false' : 'true') })
      rings.current.forEach((el, i) => { if (!el) return; el.style.transform = `translate(-50%, -50%) rotateX(${72 + st.pitch * 20}deg) rotateZ(${st.tt * 46 * (i % 2 ? -1 : 1) + i * 38}deg) scale(${1 + i * 0.34})` })
      const near = Math.round(st.tt)
      if (near !== st.accent) { st.accent = near; stick.style.setProperty('--ga', ECOSYSTEM[near].accent); ticks.current.forEach((li, i) => li?.toggleAttribute('data-on', i === near)) }
      if (fill.current) fill.current.style.transform = `scaleY(${(st.tt / (G - 1)).toFixed(3)})`
      if (!calm) raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }
    const ro = new ResizeObserver(() => { size(); kick() }); ro.observe(stg)
    const io = new IntersectionObserver(([e]) => { st.run = e.isIntersecting; if (st.run) kick() }, { rootMargin: '200px' }); io.observe(rootEl)
    const hooks = nodeEls.current.map((el, i) => { if (!el) return () => {}; const on = () => { st.hot = i; kick() }, off = () => { st.hot = -1; kick() }; el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off); return () => { el.removeEventListener('pointerenter', on); el.removeEventListener('pointerleave', off) } })
    stg.addEventListener('pointermove', move); stg.addEventListener('pointerleave', leave)
    if (calm) window.addEventListener('scroll', kick, { passive: true })
    size(); kick()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); stg.removeEventListener('pointermove', move); stg.removeEventListener('pointerleave', leave); window.removeEventListener('scroll', kick); hooks.forEach((h) => h()) }
  }, [nodes])

  return (
    <section ref={root} className="ceco" aria-labelledby="ce-title">
      <div ref={sticky} className="ceco__sticky" style={{ '--ga': ECOSYSTEM[0].accent } as React.CSSProperties}>
        <div className="container ceco__grid">
          <div className="ceco__copy">
            <span className="eyebrow">CLIENTS / THE ECOSYSTEM</span>
            <h2 id="ce-title" className="visually-hidden">Our client ecosystem</h2>
            <div className="ceco__texts">
              {ECOSYSTEM.map((g, i) => (
                <div key={g.key} ref={(el) => { textEls.current[i] = el }} className="ceco__t">
                  <span className="ceco__n mono">{g.n} <i>/ 0{G}</i></span>
                  <h3 className="display">{g.title}</h3>
                  <p className="lede">{g.line}</p>
                  <p className="ceco__names">{g.ids.map((id) => byId[id].name).join('  ·  ')}</p>
                </div>
              ))}
            </div>
            <ol className="ceco__ticks" aria-hidden="true"><span className="ceco__rail"><span ref={fill} /></span>{ECOSYSTEM.map((g, i) => <li key={g.key} ref={(el) => { ticks.current[i] = el }}><span className="mono">{g.n}</span></li>)}</ol>
          </div>
          <div ref={stage} className="ceco__stage" aria-hidden="true">
            <div className="ceco__glow" />
            {[0, 1, 2].map((i) => <span key={i} ref={(el) => { rings.current[i] = el }} className="ceco__ring" />)}
            {nodes.map((n, i) => (
              <div key={n.c.id} ref={(el) => { nodeEls.current[i] = el }} className="cn">
                <span className="cn__card"><img src={n.c.logo} alt="" decoding="async" loading="lazy" /></span>
                <span className="cn__label">{n.c.name}</span>
              </div>
            ))}
          </div>
        </div>
        <span className="ceco__hint mono" aria-hidden="true">Scroll</span>
      </div>
      <ol className="ceco__static">
        {ECOSYSTEM.map((g) => (
          <li key={g.key}><h3>{g.n} — {g.title}</h3><p>{g.line}</p><ul>{g.ids.map((id) => <li key={id}><img src={byId[id].logo} alt={byId[id].name} loading="lazy" /></li>)}</ul></li>
        ))}
      </ol>
    </section>
  )
}
