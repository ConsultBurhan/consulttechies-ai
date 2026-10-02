import { SectionHeading } from '../SectionHeading'
import { ArchitectureDiagram } from '../ArchitectureDiagram'
import { Button } from '../Button'
import { Reveal } from '../Reveal'

const TRUST = [
  ['Controlled access', 'People only retrieve what their role allows.'],
  ['Data boundaries', 'Your information stays within the boundaries you define.'],
  ['Permission-aware', 'The same question can return different answers to different people.'],
  ['Organization-controlled', 'You decide what the assistant can see, and where.'],
]

/** Architecture and security together: how it works, and why you can trust it. */
export function TechnologyTrust() {
  return (
    <section className="section" id="technology" aria-labelledby="tt-title">
      <div className="container">
        <SectionHeading eyebrow="04 / TECHNOLOGY AND TRUST" title={<span id="tt-title">Complex infrastructure underneath. <em>Security built into the architecture.</em></span>}
          lede="Trace how a question moves through intent, memory, retrieval and your data, and how access control is applied along the way." />
        <ArchitectureDiagram />
        <Reveal>
          <ul className="trust">{TRUST.map(([t, d]) => <li key={t}><h3>{t}</h3><p className="muted">{d}</p></li>)}</ul>
        </Reveal>
        <div className="section__foot trust__foot"><Button to="/technology" variant="ghost">Technical overview</Button><Button to="/product#security" variant="ghost">How security works</Button></div>
      </div>
    </section>
  )
}
