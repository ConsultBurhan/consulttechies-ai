import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { JOURNEY, JOURNEY_INTRO, JOURNEY_ONE_LINE, type Chapter } from '../../content/journey'

gsap.registerPlugin(ScrollTrigger)

const QUERY = '(min-width: 760px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'
const DWELL = 0.85 // viewport heights of scroll per chapter
const pad = (n: number) => String(n).padStart(2, '0')

/** Cinematic pinned story. The stage stays fixed; scroll position decides which chapter is on screen, and each
 *  chapter blurs and drifts out while the next resolves in. Content lives in src/content/journey.ts.
 *  Small screens and reduced motion get the same chapters as a plain vertical read. */
export function JourneyStory({ chapters = JOURNEY }: { chapters?: Chapter[] }) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const scenes = useRef<(HTMLDivElement | null)[]>([])
  const idxRef = useRef(0)
  const first = useRef(true)
  const [idx, setIdx] = useState(0)
  const [pinned, setPinned] = useState(() => window.matchMedia(QUERY).matches)
  const n = chapters.length

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setPinned(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useLayoutEffect(() => {
    if (!pinned) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: () => `+=${Math.round(window.innerHeight * DWELL * n)}`,
        pin: stage.current, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          root.current?.style.setProperty('--p', self.progress.toFixed(4))
          const i = Math.min(n - 1, Math.floor(self.progress * n))
          if (i !== idxRef.current) { idxRef.current = i; setIdx(i) }
        },
      })
    }, root)
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { clearTimeout(settle); ctx.revert(); idxRef.current = 0; first.current = true; setIdx(0) }
  }, [pinned, n])

  // chapter transitions: the next chapter travels out of the screen toward the reader, the previous one flies past and dissolves
  useEffect(() => {
    const els = scenes.current.filter(Boolean) as HTMLDivElement[]
    if (!pinned) { gsap.set(els, { clearProps: 'all' }); return }
    const instant = first.current
    first.current = false
    scenes.current.forEach((el, i) => {
      if (!el) return
      const copy = el.querySelector('.jr__copy')
      if (i === idx) {
        gsap.set(el, { autoAlpha: 1 })
        gsap.fromTo(copy, { autoAlpha: 0, z: -420, scale: 0.86, rotationX: 7, filter: 'blur(10px)' },
          { autoAlpha: 1, z: 0, scale: 1, rotationX: 0, filter: 'blur(0px)', duration: instant ? 0 : 1, ease: 'power3.out', delay: instant ? 0 : 0.2, overwrite: true })
        gsap.fromTo(el.querySelectorAll('[data-part]'), { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: instant ? 0 : 0.7, ease: 'power3.out', stagger: 0.08, delay: instant ? 0 : 0.35, overwrite: true })
      } else {
        gsap.to(copy, { autoAlpha: 0, z: 260, scale: 1.1, filter: 'blur(8px)', duration: 0.45, ease: 'power2.in', overwrite: true })
        gsap.to(el, { autoAlpha: 0, duration: 0.01, delay: 0.5, overwrite: 'auto' })
      }
    })
  }, [idx, pinned])

  const jump = (i: number) => {
    const st = ScrollTrigger.getAll().find((s) => s.trigger === root.current)
    if (pinned && st) window.scrollTo({ top: st.start + ((i + 0.5) / n) * (st.end - st.start), behavior: 'smooth' })
  }

  return (
    <section ref={root} className="jr" data-mode={pinned ? 'pinned' : 'flow'} aria-label={JOURNEY_INTRO.title}>
      <div ref={stage} className="jr__stage">
        <div className="jr__glow" aria-hidden="true" />
        <div className="container jr__inner">
          <header className="jr__top">
            <span className="eyebrow">{JOURNEY_INTRO.eyebrow}</span>
            {pinned && <span className="mono jr__count" aria-hidden="true"><b>{pad(idx + 1)}</b> / {pad(n)}</span>}
          </header>

          {!pinned && <h2 className="display jr__h">{JOURNEY_INTRO.title}</h2>}

          <div className="jr__body-wrap">
            {pinned && (
              <nav className="jr__track" aria-label="Journey chapters">
                <span className="jr__line" aria-hidden="true"><i /></span>
                <ol>
                  {chapters.map((c, i) => (
                    <li key={c.title}><button type="button" onClick={() => jump(i)} aria-label={`${c.when}: ${c.title}`} aria-current={idx === i ? 'step' : undefined} data-state={i < idx ? 'done' : i === idx ? 'now' : 'todo'}><span className="mono">{c.when}</span></button></li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="jr__scenes" aria-live={pinned ? 'polite' : undefined}>
              {chapters.map((c, i) => (
                <div key={c.title} ref={(el) => { scenes.current[i] = el }} className="jr__scene" aria-hidden={pinned && idx !== i} data-on={idx === i ? '1' : '0'}>
                  <div className="jr__copy">
                    <span className="mono jr__when" data-part>{c.when}</span>
                    <h3 className="display jr__title" data-part>{c.title}</h3>
                    <p className="jr__tag" data-part>{c.tagline}</p>
                    <p className="jr__body" data-part>{c.body}</p>
                    <ul className="jr__skills" data-part>{c.skills.map((k) => <li key={k}>{k}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** The whole arc in one line, shown just after the pinned story. */
export function JourneyOneLine() {
  return (
    <div className="container jr__one">
      <span className="eyebrow">Evolution in one line</span>
      <p className="display">{JOURNEY_ONE_LINE.map((w, i) => <span key={w}>{w}{i < JOURNEY_ONE_LINE.length - 1 && <i aria-hidden="true"> → </i>}</span>)}</p>
    </div>
  )
}
