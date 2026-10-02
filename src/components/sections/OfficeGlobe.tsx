import { lazy, Suspense, useState } from 'react'
import { SITE } from '../../content/site'
import { usePrefersReducedMotion, useInView } from '../../hooks/useMotion'
import { canUseWebGL } from '../three/webgl'

const Scene = lazy(() => import('./OfficeGlobeScene'))
// approximate city coordinates, used only to place the markers
const PINS = [{ lat: 24.58, lon: 73.68 }, { lat: 30.27, lon: -97.74 }]

/** Contact page: a draggable globe linking the two offices. Abstract dot-sphere, not a map. */
export function OfficeGlobe() {
  const calm = usePrefersReducedMotion()
  const [webgl] = useState(canUseWebGL)
  const [focus, setFocus] = useState<number | null>(null)
  const [ref, visible] = useInView<HTMLDivElement>({ repeat: true, rootMargin: '120px' })
  return (
    <section className="section globe" aria-labelledby="globe-title">
      <div className="container globe__grid">
        <div ref={ref} className="globe__stage" data-gl={webgl ? '1' : '0'}>
          {webgl && <Suspense fallback={null}><Scene pins={PINS} focus={focus} calm={calm} paused={!visible} /></Suspense>}
          <span className="orbit__hint mono" aria-hidden="true">Drag to turn</span>
        </div>
        <div className="globe__side">
          <span className="eyebrow">Two offices</span>
          <h2 id="globe-title" className="display">Udaipur to Austin. <em>One team.</em></h2>
          <ul className="globe__offices">
            {SITE.offices.map((o, i) => (
              <li key={o.name}>
                <button aria-pressed={focus === i} onClick={() => setFocus(focus === i ? null : i)}>
                  <span className="eyebrow">{o.name} · {o.country}</span>
                  <address>{o.lines.map((l) => <span key={l}>{l}</span>)}</address>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
