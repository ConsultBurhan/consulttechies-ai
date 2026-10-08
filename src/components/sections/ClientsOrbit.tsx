import { lazy, Suspense, useState } from 'react'
import { FLAGSHIP, GROUP_BRANDS, OTHERS } from '../../content/clients'
import { usePrefersReducedMotion, useInView } from '../../hooks/useMotion'
import { canUseWebGL } from '../three/webgl'
import { SectionHeading } from '../SectionHeading'

const Scene = lazy(() => import('./ClientsOrbitScene'))
const pick = (c: { id: string; logo: string }) => ({ id: c.id, logo: c.logo })

/** Clients page: a draggable 3D constellation of logos orbiting the flagship client. */
export function ClientsOrbit() {
  const calm = usePrefersReducedMotion()
  const [webgl] = useState(canUseWebGL)
  const [ref, visible] = useInView<HTMLDivElement>({ repeat: true, rootMargin: '120px' })
  return (
    <section className="section corbit" aria-labelledby="co-title">
      <div className="container corbit__grid">
        <div className="corbit__side">
          <SectionHeading eyebrow="CLIENTS / THE CIRCLE" title={<span id="co-title">Restaurant groups to <em>EU agencies.</em></span>}
            lede="Different industries, different continents, one common need: people who can simply ask the organization a question and get a grounded answer." />
        </div>
        <div ref={ref} className="corbit__stage" data-gl={webgl ? '1' : '0'}>
          {webgl && <Suspense fallback={null}><Scene center={pick(FLAGSHIP)} inner={GROUP_BRANDS.map(pick)} outer={OTHERS.map(pick)} calm={calm} paused={!visible} /></Suspense>}
          <span className="orbit__hint mono" aria-hidden="true">Drag to turn</span>
        </div>
      </div>
    </section>
  )
}
