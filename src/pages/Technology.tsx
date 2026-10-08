import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { TechnologySection } from '../components/sections/TechnologySection'
import { KnowledgeFlow } from '../components/sections/KnowledgeFlow'
import { SecuritySection } from '../components/sections/SecuritySection'
import { ConnectorOrbit } from '../components/sections/ConnectorOrbit'
import { CTASection } from '../components/CTASection'
import { SectionHeading } from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'

const STACK = [
  ['Intent & orchestration', 'Understands the request, plans the task, and selects tools and data sources. Integrates with databases, APIs and enterprise tools.'],
  ['Retrieval-augmented generation', 'Retrieves relevant material from trusted organizational sources before generating a response.'],
  ['Contextual memory', 'Semantic and episodic memory, so interactions reflect user, preference and organizational context.'],
  ['Database connectivity', 'SQL databases, Oracle, MongoDB and other organizational databases, queried through natural language.'],
  ['Domain adaptation', 'Alignment to company terminology, business rules, workflows and tone.'],
  ['Analysis and forecasting', 'Compares periods, finds trends and, from historical data, estimates likely outcomes. Scope depends on the data available.'],
  ['Output generation', 'Charts, structured reports, Excel spreadsheets and PDF documents.'],
] as const

export default function Technology() {
  const [openIdx, setOpenIdx] = useState(0)
  useSeo({ title: 'Technology & Architecture', path: '/technology', description: 'Architecture of the BCT enterprise AI assistant: agentic orchestration, retrieval-augmented generation, contextual memory and enterprise database connectivity.' })
  return (
    <div className="page">
      <PageHeader eyebrow="BCT / TECHNOLOGY" title={<>Serious architecture, <em>simple interaction.</em></>}
        lede="Agentic orchestration, retrieval-augmented generation, contextual memory and database connectivity, assembled so the person using it only sees a conversation." />
      <TechnologySection withLink={false} />
      <section className="section" aria-labelledby="stack-title">
        <div className="container">
          <SectionHeading eyebrow="Components" title={<span id="stack-title">The parts, <em>explained plainly.</em></span>} />
          <div className="acc">
            {STACK.map(([t, d], i) => (
              <details key={t} open={openIdx === i} onMouseEnter={() => setOpenIdx(i)} onFocus={() => setOpenIdx(i)}>
                <summary onClick={(e) => { e.preventDefault(); setOpenIdx(i) }}><span className="mono">0{i + 1}</span><h3>{t}</h3><i aria-hidden="true" /></summary>
                <p className="muted">{d}</p>
              </details>
            ))}
          </div>
          <p className="fine">Integrations and deployment are scoped with each organization. We do not claim support beyond what has been built and agreed.</p>
        </div>
      </section>
      <ConnectorOrbit />
      <KnowledgeFlow />
      <SecuritySection />
      <CTASection variant="card" title={<>Want to see how it would connect <em>to your systems?</em></>} />
    </div>
  )
}
