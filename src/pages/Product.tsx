import { PageHeader } from '../components/PageHeader'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { ProductDemo } from '../components/demo/ProductDemo'
import { LayerStack3D } from '../components/sections/LayerStack3D'
import { CTASection } from '../components/CTASection'
import { Button } from '../components/Button'
import { MODES } from '../components/demo/scenarios'
import { PredictionSection } from '../components/forecast'
import { useSeo } from '../hooks/useSeo'

const CAPS = [
  ['Agentic by design', 'It does not just generate text. It understands intent, plans the task, and chooses which tools and data sources to use.'],
  ['Contextual memory', 'Semantic and episodic memory personalize each interaction using user, role and organizational context.'],
  ['Grounded in your knowledge', 'Retrieval-augmented generation draws on your trusted documents before answering.'],
  ['Connected to your data', 'Works with SQL, Oracle, MongoDB and other organizational databases, in natural language.'],
  ['Adapted to your company', 'Learns your terminology, business rules, workflows and communication style.'],
  ['Reports and forecasts', 'Analysis becomes charts, structured reports, Excel spreadsheets and PDFs. From historical data it can also estimate likely trends, as estimates to plan with, not guarantees.'],
] as const

export default function Product() {
  useSeo({ title: 'Enterprise AI Assistant', path: '/product', description: 'BCT Context is an enterprise AI assistant that connects to your databases, documents and systems. Ask in natural language and get grounded answers, charts and reports.' })
  return (
    <div className="page">
      <PageHeader eyebrow="BCT / PRODUCT" title={<>An AI assistant that understands <em>how your business works.</em></>}
        lede="Context connects to your existing databases, documents and systems, then lets people interact with that information in natural language. Questions in. Answers, analysis and reports out.">
        <div className="hero__ctas"><Button to="/contact" size="lg" arrow>Request a demo</Button><Button href="#demo" variant="ghost" size="lg">Try the simulation</Button></div>
      </PageHeader>

      <section className="section" id="demo" aria-labelledby="pd-title">
        <div className="container">
          <SectionHeading eyebrow="Interactive demo" title={<span id="pd-title">Try it. <em>Ask a question.</em></span>} lede="Marketing simulation with sample data. The real assistant answers from your own systems." />
          <ProductDemo />
        </div>
      </section>

      <LayerStack3D />
      <PredictionSection eyebrow="AI / FORECAST" />

      <section className="section" aria-labelledby="cap-title">
        <div className="container">
          <SectionHeading eyebrow="Capabilities" title={<span id="cap-title">What it actually <em>does.</em></span>} />
          <ul className="caps">
            {CAPS.map(([t, d], i) => <Reveal as="li" key={t} delay={i % 3}><span className="mono">0{i + 1}</span><h3>{t}</h3><p className="muted">{d}</p></Reveal>)}
          </ul>
        </div>
      </section>

      <section className="section section--tint" id="data" aria-labelledby="modes-title">
        <div className="container">
          <SectionHeading eyebrow="Task modes" title={<span id="modes-title">Simple questions stay simple. <em>Complex ones get depth.</em></span>} lede="The assistant adapts its approach to the task. A quick lookup does not need heavy analysis. A quarterly review does." />
          <ul className="modecards">
            {(Object.keys(MODES) as (keyof typeof MODES)[]).map((m, i) => (
              <Reveal as="li" key={m} delay={i}>
                <span className="mode__bars mode__bars--lg" aria-hidden="true">{[1, 2, 3].map((n) => <i key={n} className={n <= MODES[m].depth ? 'on' : ''} />)}</span>
                <h3>{MODES[m].label}</h3><p className="muted">{MODES[m].blurb}</p>
              </Reveal>
            ))}
          </ul>
          <p className="fine">Depth of reasoning, data analysis, document understanding and structured output scale with the task.</p>
        </div>
      </section>

      <CTASection variant="link" />
    </div>
  )
}
