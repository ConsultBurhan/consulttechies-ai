import { lazy, Suspense, useState } from 'react'
import { SectionHeading } from '../SectionHeading'
import { usePrefersReducedMotion, useInView } from '../../hooks/useMotion'
import { canUseWebGL } from '../three/webgl'

const Scene = lazy(() => import('./ConnectorOrbitScene'))

const SOURCES = [
  { t: 'SQL databases', d: 'Questions in plain language become queries against your relational data, run within the asking user’s permissions.' },
  { t: 'Oracle', d: 'Enterprise records stay where they are. Context reads from them rather than copying them elsewhere.' },
  { t: 'MongoDB', d: 'Document-style data is queried the same way: ask the question, get the answer and its source.' },
  { t: 'Documents', d: 'Policies, handbooks, PDFs and files become part of the knowledge base the assistant retrieves from first.' },
  { t: 'APIs', d: 'Where an answer lives in another service, an API connection lets Context reach it. Scope is agreed per organization.' },
  { t: 'Business systems', d: 'CRM and other enterprise tools can be connected, so answers reflect how work actually moves. Scoped with each client.' },
] as const

/** Technology page: drag the ring, pick a source. R3F scene with a plain list as the accessible equivalent. */
export function ConnectorOrbit() {
  const calm = usePrefersReducedMotion()
  const [webgl] = useState(canUseWebGL)
  const [on, setOn] = useState(0)
  const [ref, visible] = useInView<HTMLDivElement>({ repeat: true, rootMargin: '120px' })
  return (
    <section className="section orbit" aria-labelledby="orb-title">
      <div className="container">
        <SectionHeading eyebrow="Connected sources" title={<span id="orb-title">One layer, <em>reaching everything you already run.</em></span>} lede="Drag to turn the ring. Select a source to see how Context uses it." />
        <div className="orbit__grid">
          <div ref={ref} className="orbit__stage glass-card" data-gl={webgl ? '1' : '0'}>
            {webgl && <Suspense fallback={null}><Scene count={SOURCES.length} active={on} onPick={setOn} calm={calm} paused={!visible} /></Suspense>}
            <span className="orbit__hint mono" aria-hidden="true">Drag · Select</span>
          </div>
          <div className="orbit__side">
            <ul className="orbit__list" role="tablist" aria-label="Connected sources" aria-orientation="vertical">
              {SOURCES.map((s, i) => (
                <li key={s.t}><button role="tab" aria-selected={on === i} onClick={() => setOn(i)}><span className="mono">0{i + 1}</span>{s.t}</button></li>
              ))}
            </ul>
            <div className="orbit__detail" role="tabpanel" aria-live="polite"><h3>{SOURCES[on].t}</h3><p className="muted">{SOURCES[on].d}</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
