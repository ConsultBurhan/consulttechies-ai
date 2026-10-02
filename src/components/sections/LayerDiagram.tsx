import { SectionHeading } from '../SectionHeading'
import { Reveal } from '../Reveal'

const ORG = [['Company knowledge', 'Policies, handbooks, know-how'], ['Business data', 'SQL · Oracle · MongoDB'], ['Documents', 'PDFs, files, images'], ['Systems', 'APIs and enterprise tools'], ['Workflows', 'How work actually moves']] as const

export function LayerDiagram() {
  return (
    <section className="section" aria-labelledby="ly-title">
      <div className="container">
        <SectionHeading eyebrow="Not another chatbot" title={<span id="ly-title">An AI layer for the <em>organization.</em></span>}
          lede="A chatbot answers questions. Context understands how your organization works, connects what you already have, and turns it into answers, reports and actions." />
        <Reveal className="ly">
          <div className="ly__tier ly__tier--people">
            <span className="eyebrow">People</span>
            <div>{['Employees', 'Managers', 'Leadership'].map((p) => <span key={p} className="pill pill--warm">{p}</span>)}</div>
          </div>
          <div className="ly__wire" aria-hidden="true"><i /><i /><i /></div>
          <div className="ly__core">
            <b>BCT Context</b>
            <span>Understands intent · plans · retrieves · analyzes · remembers</span>
          </div>
          <div className="ly__wire" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <ul className="ly__org" aria-label="Connected organizational sources">
            {ORG.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
          </ul>
          <div className="ly__wire ly__wire--up" aria-hidden="true"><i /><i /><i /></div>
          <div className="ly__tier ly__tier--out">
            <span className="eyebrow">Becomes</span>
            <div>{['Insights', 'Reports', 'Actions'].map((p) => <span key={p} className="pill pill--cool">{p}</span>)}</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
