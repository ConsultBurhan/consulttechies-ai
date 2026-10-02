import { useRef, useState } from 'react'
import { SectionHeading } from '../SectionHeading'
import { AUDIENCES } from './AudiencesSection'

/** Solutions page: a four-sided cube, one role per face. Drag it, or use the tabs. */
export function RoleCube() {
  const n = AUDIENCES.length
  const [angle, setAngle] = useState(0)
  const [drag, setDrag] = useState(false)
  const st = useRef({ x: 0, a: 0, moved: 0 })
  const idx = ((Math.round(-angle / 90) % n) + n) % n
  const snap = (i: number) => {
    const cur = Math.round(-angle / 90); let d = i - (((cur % n) + n) % n)
    if (d > n / 2) d -= n; if (d < -n / 2) d += n
    setAngle(-(cur + d) * 90)
  }
  return (
    <section className="section cube" aria-labelledby="cube-title">
      <div className="container">
        <SectionHeading eyebrow="Every role" title={<span id="cube-title">Turn it around. <em>Everyone gets an answer.</em></span>} lede="Everyone has questions about the business. Context gives each person the answer that fits their role." />
        <div className="cube__grid">
          <ul className="cube__tabs" role="tablist" aria-label="Roles">
            {AUDIENCES.map((a, i) => (
              <li key={a.id}><button role="tab" aria-selected={idx === i} onClick={() => snap(i)} onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); snap((i + 1) % n) } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); snap((i + n - 1) % n) } }}><span className="mono">0{i + 1}</span>{a.label}</button></li>
            ))}
          </ul>
          <div className="cube__view" data-drag={drag ? '1' : '0'}
            onPointerDown={(e) => { st.current = { x: e.clientX, a: angle, moved: 0 }; setDrag(true); e.currentTarget.setPointerCapture(e.pointerId) }}
            onPointerMove={(e) => { if (!drag) return; st.current.moved = Math.abs(e.clientX - st.current.x); setAngle(st.current.a + (e.clientX - st.current.x) * 0.4) }}
            onPointerUp={() => { setDrag(false); setAngle((a) => Math.round(a / 90) * 90) }} onPointerCancel={() => { setDrag(false); setAngle((a) => Math.round(a / 90) * 90) }}>
            <div className="cube__body" style={{ transform: `translateZ(calc(var(--cw) / -2)) rotateY(${angle}deg)` }}>
              {AUDIENCES.map((a, i) => (
                <article key={a.id} className="cube__face glass-card" style={{ transform: `rotateY(${i * 90}deg) translateZ(calc(var(--cw) / 2))` }} role="tabpanel" aria-label={a.label} aria-hidden={idx !== i} inert={idx !== i}>
                  <span className="eyebrow">{a.label}</span>
                  <h3 className="display">{a.line}</h3>
                  <div className="msg msg--user"><p>{a.q}</p></div>
                  {a.flow ? <ol className="chain">{a.flow.map((f) => <li key={f}>{f}</li>)}</ol> : <ul className="ticks">{a.points.map((p) => <li key={p}>{p}</li>)}</ul>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
