import { SectionHeading } from '../SectionHeading'
import { ArchitectureDiagram } from '../ArchitectureDiagram'
import { Button } from '../Button'

export function TechnologySection({ withLink = true }: { withLink?: boolean }) {
  return (
    <section className="section section--tint" id="architecture" aria-labelledby="tech-title">
      <div className="container">
        <SectionHeading eyebrow="Technology" title={<span id="tech-title">Complex infrastructure underneath. <em>One conversation on top.</em></span>} lede="Trace how a single question moves through intent, memory, retrieval, your data and back out as an answer, a chart or a report." />
        <ArchitectureDiagram />
        {withLink && <div className="section__foot"><Button to="/technology" variant="ghost">Read the technical overview</Button></div>}
      </div>
    </section>
  )
}
