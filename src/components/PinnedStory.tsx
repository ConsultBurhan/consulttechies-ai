import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionHeading } from './SectionHeading'

gsap.registerPlugin(ScrollTrigger)
gsap.ticker.lagSmoothing(0) // tweens finish on wall-clock time, even if a frame is slow

export type PinStep = { id: string; label: string; title: ReactNode; body?: ReactNode; vis: ReactNode }
type Props = { id?: string; label: string; eyebrow: string; title: ReactNode; lede?: ReactNode; steps: PinStep[]; dwell?: number; center?: boolean; variant?: 'rail' | 'deck' }

const QUERY = '(min-width: 960px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)'

/** Pinned scroll story. On roomy screens the viewport stays fixed while scroll position walks through the steps
 *  (GSAP ScrollTrigger). On small screens or with reduced motion it becomes ordinary tabs: same content, no pinning. */
export function PinnedStory({ id, label, eyebrow, title, lede, steps, dwell = 0.8, center, variant = 'rail' }: Props) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const panels = useRef<(HTMLDivElement | null)[]>([])
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const st = useRef<ScrollTrigger | null>(null)
  const idxRef = useRef(0)
  const [idx, setIdx] = useState(0)
  const [pinned, setPinned] = useState(() => window.matchMedia(QUERY).matches)
  const deckEls = useRef<(HTMLDivElement | null)[]>([])
  const first = useRef(true)
  const n = steps.length
  const deck = variant === 'deck' && pinned

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setPinned(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // the pin itself: progress drives the active step and the progress line
  useLayoutEffect(() => {
    if (!pinned) return
    const ctx = gsap.context(() => {
      st.current = ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: () => `+=${Math.round(window.innerHeight * dwell * n)}`,
        pin: stage.current, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          root.current?.style.setProperty('--p', self.progress.toFixed(4))
          const i = Math.min(n - 1, Math.floor(self.progress * n))
          if (i !== idxRef.current) { idxRef.current = i; setIdx(i) }
        },
      })
    }, root)
    // layout above us can change height (e.g. the demo grows): keep the pin aligned
    let t = 0
    const ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 200) })
    ro.observe(document.body)
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { clearTimeout(settle); clearTimeout(t); ro.disconnect(); ctx.revert(); st.current = null; idxRef.current = 0; setIdx(0) }
  }, [pinned, n, dwell])

  // step transitions
  useEffect(() => {
    const els = panels.current.filter(Boolean) as HTMLDivElement[]
    if (!pinned) { gsap.set(els, { clearProps: 'all' }); return }
    els.forEach((el, i) => {
      if (i === idx) {
        gsap.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', overwrite: true })
        gsap.fromTo(el.querySelectorAll('[data-anim]'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07, delay: 0.12, overwrite: true })
      } else gsap.to(el, { autoAlpha: 0, y: -28, duration: 0.3, ease: 'power2.in', overwrite: true })
    })
  }, [idx, pinned])

  // deck: every visual sits in a 3D stack; the active one comes forward, earlier ones swing away, later ones wait behind
  useEffect(() => {
    if (!deck) { first.current = true; return }
    const dur = first.current ? 0 : 0.9
    first.current = false
    deckEls.current.forEach((el, i) => {
      if (!el) return
      const d = i - idx
      gsap.to(el, d === 0
        ? { x: 0, y: 0, z: 0, rotationY: 0, scale: 1, autoAlpha: 1, duration: dur, ease: 'power3.out', overwrite: true }
        : d > 0
          ? { x: 46 * d, y: -14 * d, z: -170 * d, rotationY: -16, scale: 1, autoAlpha: Math.max(0, 0.38 - (d - 1) * 0.2), duration: dur, ease: 'power3.out', overwrite: true }
          : { x: -240, y: 0, z: -120, rotationY: 38, scale: 0.94, autoAlpha: 0, duration: dur, ease: 'power3.inOut', overwrite: true })
    })
    steps.forEach((st, k) => { if (k !== idx) gsap.to(`#${CSS.escape(st.id)}-copy`, { autoAlpha: 0, y: -16, duration: dur ? 0.25 : 0, overwrite: true }) })
    gsap.fromTo(`#${CSS.escape(steps[idx].id)}-copy`, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: dur ? 0.7 : 0, ease: 'power3.out', overwrite: true })
  }, [idx, deck, steps])

  // pointer parallax: the whole deck leans a few degrees toward the cursor
  const lean = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2)}deg`)
    e.currentTarget.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * 6).toFixed(2)}deg`)
  }
  const unlean = (e: React.PointerEvent<HTMLDivElement>) => { e.currentTarget.style.setProperty('--ry', '0deg'); e.currentTarget.style.setProperty('--rx', '0deg') }

  const go = useCallback((i: number) => {
    const k = Math.max(0, Math.min(n - 1, i))
    if (pinned && st.current) window.scrollTo({ top: st.current.start + ((k + 0.5) / n) * (st.current.end - st.current.start), behavior: 'smooth' })
    else setIdx(k)
    tabs.current[k]?.focus({ preventScroll: true })
  }, [n, pinned])

  return (
    <section ref={root} id={id} className="pin" data-mode={pinned ? 'pinned' : 'flow'} data-center={center ? '1' : undefined} data-variant={deck ? 'deck' : undefined} aria-label={label}>
      <div ref={stage} className="pin__stage">
        <div className="container pin__inner">
          <SectionHeading eyebrow={eyebrow} title={title} lede={lede} />
          <div className="pin__body">
            <div className="pin__steps" role="tablist" aria-label={label} aria-orientation={pinned ? 'vertical' : 'horizontal'}>
              {steps.map((s, i) => (
                <button key={s.id} ref={(el) => { tabs.current[i] = el }} role="tab" id={`${s.id}-tab`} aria-selected={idx === i} aria-controls={`${s.id}-panel`} tabIndex={idx === i ? 0 : -1}
                  data-state={i < idx ? 'done' : i === idx ? 'now' : 'todo'} onClick={() => go(i)}
                  onKeyDown={(e) => {
                    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
                    if (next) { e.preventDefault(); go(i + next) }
                  }}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>{s.label}
                </button>
              ))}
            </div>
            {deck ? (
              <>
                <div className="deck__copy">
                  {steps.map((s, k) => (
                    <div key={s.id} id={`${s.id}-copy`} className="deck__txt" aria-hidden={idx !== k}>
                      <span className="eyebrow">{String(k + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
                      <h3 className="display">{s.title}</h3>{s.body && <p className="muted">{s.body}</p>}
                    </div>
                  ))}
                </div>
                <div className="deck" onPointerMove={lean} onPointerLeave={unlean}>
                  <div className="deck__orbit" aria-hidden="true"><i /><i /><i /></div>
                  <div className="deck__stack">
                    {steps.map((s, k) => (
                      <div key={s.id} ref={(el) => { deckEls.current[k] = el }} className="deck__card" id={`${s.id}-panel`} role="tabpanel" aria-labelledby={`${s.id}-tab`} inert={idx !== k} aria-hidden={idx !== k}>{s.vis}</div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="pin__panels">
                {steps.map((s, i) => (
                  <div key={s.id} ref={(el) => { panels.current[i] = el }} className="pin__panel" id={`${s.id}-panel`} role="tabpanel" aria-labelledby={`${s.id}-tab`} data-on={idx === i ? '1' : '0'} inert={idx !== i} aria-hidden={idx !== i}>
                    <div className="pin__text" data-anim><h3 className="display">{s.title}</h3>{s.body && <p className="muted">{s.body}</p>}</div>
                    <div className="pin__vis" data-anim>{s.vis}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
