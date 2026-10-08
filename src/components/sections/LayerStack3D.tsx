import { useState } from 'react'
import { SectionHeading } from '../SectionHeading'

const LAYERS = [
  { t: 'People', tag: 'Employees · Managers · Leadership', d: 'Anyone asks in plain language, with no query language or dashboard to learn. Answers respect each person’s role and permissions.' },
  { t: 'BCT Context', tag: 'Understands · plans · retrieves · remembers', d: 'The intelligence layer. It interprets intent, plans the task, retrieves from trusted sources, analyzes and keeps contextual memory.' },
  { t: 'Your organization', tag: 'Knowledge · data · documents · systems', d: 'Company knowledge, SQL, Oracle and MongoDB data, documents, APIs and workflows. Context connects to them rather than replacing them.' },
  { t: 'Outcomes', tag: 'Insights · reports · actions', d: 'Answers with sources, charts, forecasts framed as estimates, and structured reports as Excel or PDF.' },
] as const

/** Product page: an exploded 3D stack of the intelligence layer. Move the pointer to turn it; select a layer to lift it. */
export function LayerStack3D() {
  const [on, setOn] = useState(1)
  const lean = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' && e.type === 'pointermove' && !e.buttons) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--rz', `${(-34 + ((e.clientX - r.left) / r.width - 0.5) * 70).toFixed(1)}deg`)
    e.currentTarget.style.setProperty('--rx', `${(58 - ((e.clientY - r.top) / r.height - 0.5) * 16).toFixed(1)}deg`)
  }
  return (
    <section className="section ls3" id="layer" aria-labelledby="ly-title">
      <div className="container">
        <SectionHeading eyebrow="BCT / THE INTELLIGENCE LAYER" title={<span id="ly-title">An AI layer for the <em>organization.</em></span>}
          lede="A chatbot answers questions. Context understands how your organization works, connects what you already have, and turns it into answers, reports and actions." />
        <div className="ls3__grid">
          <div className="ls3__view" onPointerMove={lean}>
            <div className="ls3__scene" aria-hidden="true">
              {LAYERS.map((l, i) => (
                <button tabIndex={-1} key={l.t} className="ls3__slab" data-on={on === i ? '1' : '0'} style={{ '--i': LAYERS.length - 1 - i } as React.CSSProperties} onClick={() => setOn(i)}>
                  <b>{l.t}</b><span className="mono">{l.tag}</span>
                </button>
              ))}
              <i className="ls3__beam" />
            </div>
          </div>
          <div className="ls3__side">
            <ul role="tablist" aria-label="Layers" aria-orientation="vertical">
              {LAYERS.map((l, i) => <li key={l.t}><button role="tab" aria-selected={on === i} onClick={() => setOn(i)}><span className="mono">0{i + 1}</span>{l.t}</button></li>)}
            </ul>
            <div role="tabpanel" aria-live="polite" className="ls3__detail"><h3>{LAYERS[on].t}</h3><p className="muted">{LAYERS[on].d}</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
