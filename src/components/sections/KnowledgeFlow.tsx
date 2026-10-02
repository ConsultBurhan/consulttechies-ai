import { SectionHeading } from '../SectionHeading'
import { Reveal } from '../Reveal'

const FLOW = [
  ['Company knowledge', 'PDFs, documents, images, internal resources'],
  ['Retrieval', 'Find the passages that matter'],
  ['Context', 'Assemble what the model needs'],
  ['AI', 'Reason over trusted material'],
  ['Answer', 'Grounded, with sources'],
] as const

export function KnowledgeFlow({ id = 'knowledge' }: { id?: string }) {
  return (
    <section className="section section--tint" id={id} aria-labelledby="kf-title">
      <div className="container">
        <SectionHeading eyebrow="Connected knowledge" title={<span id="kf-title">Answers that stay <em>grounded</em> in your own material.</span>}
          lede="Before the assistant answers, it retrieves the relevant information from your trusted sources. You provide the documents. It does the reading." />
        <Reveal>
          <ol className="kf" aria-label="Retrieval-augmented generation flow">
            {FLOW.map(([t, d], i) => (
              <li key={t} style={{ '--i': i } as React.CSSProperties}>
                <span className="kf__dot" aria-hidden="true" />
                <b>{t}</b><span>{d}</span>
              </li>
            ))}
            <span className="kf__rail" aria-hidden="true"><i /></span>
          </ol>
        </Reveal>
        <div className="kf-grid">
          <Reveal className="kf-card">
            <span className="eyebrow">You bring</span>
            <ul className="ticks"><li>PDFs and documents</li><li>Images</li><li>Internal knowledge resources</li><li>Other supported business content</li></ul>
          </Reveal>
          <Reveal className="kf-card kf-card--answer" delay={1}>
            <span className="eyebrow">It answers</span>
            <p className="quote">“Contractors need manager approval before system access is granted. Requests go through the IT service desk.”</p>
            <div className="cites"><span className="cite"><i>1</i>Access policy.pdf · p. 4</span><span className="cite"><i>2</i>Onboarding checklist.docx</span></div>
            <small className="muted">Illustrative example of a sourced answer.</small>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
