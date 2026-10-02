import { useState } from 'react'
import { SectionHeading } from '../SectionHeading'

export const AUDIENCES = [
  { id: 'new', label: 'New employees', q: 'What process should I follow to request equipment?', line: 'Find their feet faster.', points: ['How does our organization work?', 'Who manages this department?', 'What are the business norms?'], flow: null },
  { id: 'emp', label: 'Employees', q: 'Pull last month’s ticket volume and draft a summary.', line: 'Get answers without the hunt.', points: ['Retrieve information instantly', 'Understand processes step by step', 'Analyze business information', 'Generate reports'], flow: null },
  { id: 'mgr', label: 'Managers', q: 'How is my team’s pipeline trending against last quarter?', line: 'See performance, not spreadsheets.', points: ['Ask business questions directly', 'Analyze performance and spot trends', 'Generate structured insights', 'Create visual reports'], flow: null },
  { id: 'lead', label: 'Leadership', q: 'Where are we most exposed this quarter?', line: 'From question to decision.', points: ['Ask the question', 'See the data behind it', 'Get the insight', 'Make the call'], flow: ['Business question', 'Data', 'Insight', 'Decision'] },
] as const

export function AudiencesSection() {
  const [i, setI] = useState(0)
  const a = AUDIENCES[i]
  return (
    <section className="section section--tint" aria-labelledby="au-title">
      <div className="container">
        <SectionHeading eyebrow="For everyone" title={<span id="au-title">Not just for executives. <em>For the whole organization.</em></span>} lede="Everyone has questions about the business. Context gives each person the answer that fits their role." />
        <div className="au">
          <div className="au__tabs" role="tablist" aria-label="Audience">
            {AUDIENCES.map((x, n) => (
              <button key={x.id} role="tab" aria-selected={i === n} aria-controls="au-panel" id={`au-${x.id}`} tabIndex={i === n ? 0 : -1} className={i === n ? 'on' : ''} onClick={() => setI(n)}
                onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setI((n + 1) % 4) } if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setI((n + 3) % 4) } }}>
                <span className="mono">0{n + 1}</span>{x.label}
              </button>
            ))}
          </div>
          <div className="au__panel" id="au-panel" role="tabpanel" aria-labelledby={`au-${a.id}`} key={a.id}>
            <h3 className="display">{a.line}</h3>
            <div className="msg msg--user"><p>{a.q}</p></div>
            {a.flow ? (
              <ol className="chain">{a.flow.map((f) => <li key={f}>{f}</li>)}</ol>
            ) : (
              <ul className="ticks">{a.points.map((p) => <li key={p}>{p}</li>)}</ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
