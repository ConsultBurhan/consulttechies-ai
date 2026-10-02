import { Hero } from '../components/hero/Hero'
import { ProblemShift } from '../components/sections/ProblemShift'
import { LayerDiagram } from '../components/sections/LayerDiagram'
import { WorkflowSection } from '../components/sections/WorkflowSection'
import { KnowledgeFlow } from '../components/sections/KnowledgeFlow'
import { AdaptSection } from '../components/sections/AdaptSection'
import { AudiencesSection } from '../components/sections/AudiencesSection'
import { SecuritySection } from '../components/sections/SecuritySection'
import { TechnologySection } from '../components/sections/TechnologySection'
import { LessMore } from '../components/sections/LessMore'
import { CompanyTeaser } from '../components/sections/CompanyTeaser'
import { CTASection } from '../components/CTASection'
import { SectionHeading } from '../components/SectionHeading'
import { ProductDemo } from '../components/demo/ProductDemo'
import { useSeo } from '../hooks/useSeo'

export default function Home() {
  useSeo({ title: 'Home', path: '/', description: 'Babji Consult Techies builds enterprise AI that connects to your databases, documents and systems, so anyone can ask a business question and get a grounded answer, chart or report.' })
  return (
    <div className="page">
      <Hero />
      <ProblemShift />
      <LayerDiagram />
      <section className="section section--tint" id="demo" aria-labelledby="demo-title">
        <div className="container">
          <SectionHeading eyebrow="See it work" title={<span id="demo-title">Ask. Understand. Analyze. <em>Visualize.</em></span>} lede="A simulation of the assistant at work, using sample data. Choose a question and watch it go from sentence to insight." />
          <ProductDemo />
        </div>
      </section>
      <WorkflowSection />
      <KnowledgeFlow />
      <AdaptSection />
      <AudiencesSection />
      <SecuritySection />
      <TechnologySection />
      <LessMore />
      <CompanyTeaser />
      <CTASection />
    </div>
  )
}
