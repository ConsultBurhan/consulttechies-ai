import { PageHeader } from '../components/PageHeader'
import { TechnologySection } from '../components/sections/TechnologySection'
import { KnowledgeFlow } from '../components/sections/KnowledgeFlow'
import { SecuritySection } from '../components/sections/SecuritySection'
import { CTASection } from '../components/CTASection'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { useSeo } from '../hooks/useSeo'

const STACK = [
  ['Intent & orchestration', 'Understands the request, plans the task, and selects tools and data sources. Integrates with databases, APIs and enterprise tools.'],
  ['Retrieval-augmented generation', 'Retrieves relevant material from trusted organizational sources before generating a response.'],
  ['Contextual memory', 'Semantic and episodic memory, so interactions reflect user, preference and organizational context.'],
  ['Database connectivity', 'SQL databases, Oracle, MongoDB and other organizational databases, queried through natural language.'],
  ['Domain adaptation', 'Alignment to company terminology, business rules, workflows and tone.'],
  ['Output generation', 'Charts, structured reports, Excel spreadsheets and PDF documents.'],
] as const

export default function Technology() {
  useSeo({ title: 'Technology & Architecture', path: '/technology', description: 'Architecture of the BCT enterprise AI assistant: agentic orchestration, retrieval-augmented generation, contextual memory and enterprise database connectivity.' })
  return (
    <div className="page">
      <PageHeader eyebrow="Technology" title={<>Serious architecture, <em>simple interaction.</em></>}
        lede="Agentic orchestration, retrieval-augmented generation, contextual memory and database connectivity, assembled so the person using it only sees a conversation." />
      <TechnologySection withLink={false} />
      <section className="section" aria-labelledby="stack-title">
        <div className="container">
          <SectionHeading eyebrow="Components" title={<span id="stack-title">The parts, <em>explained plainly.</em></span>} />
          <ul className="caps">
            {STACK.map(([t, d], i) => <Reveal as="li" key={t} delay={i % 3}><span className="mono">0{i + 1}</span><h3>{t}</h3><p className="muted">{d}</p></Reveal>)}
          </ul>
          <p className="fine">Integrations and deployment are scoped with each organization. We do not claim support beyond what has been built and agreed.</p>
        </div>
      </section>
      <KnowledgeFlow />
      <SecuritySection />
      <CTASection title={<>Want to see how it would connect <em>to your systems?</em></>} />
    </div>
  )
}
