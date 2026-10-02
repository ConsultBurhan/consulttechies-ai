import { Hero } from '../components/hero/Hero'
import { ProductSection } from '../components/sections/ProductSection'
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection'
import { AudiencesSection } from '../components/sections/AudiencesSection'
import { TechnologyTrust } from '../components/sections/TechnologyTrust'
import { BrandBand } from '../components/sections/BrandBand'
import { ChapterRail } from '../components/ChapterRail'
import { CTASection } from '../components/CTASection'
import { useSeo } from '../hooks/useSeo'

/** Six beats: hero, product, capabilities, value, technology + trust, company + call to action.
 *  Each is a [data-chapter] wrapper: ChapterRail reads them today; scroll-driven scenes can hook in later. */
const Chapter = ({ n, label, id, children }: { n: string; label: string; id: string; children: React.ReactNode }) => (
  <div className="chapter" id={id} data-chapter={n} data-label={label}>{children}</div>
)

export default function Home() {
  useSeo({ title: 'Home', path: '/', description: 'Babji Consult Techies builds enterprise AI that connects to your databases, documents and systems, so anyone can ask a business question and get a grounded answer, chart, report or forecast.' })
  return (
    <div className="page">
      <ChapterRail />
      <Chapter n="00" label="Intro" id="intro"><Hero /></Chapter>
      <Chapter n="01" label="Product" id="product"><ProductSection /></Chapter>
      <Chapter n="02" label="Capabilities" id="caps"><CapabilitiesSection /></Chapter>
      <Chapter n="03" label="Value" id="value"><AudiencesSection /></Chapter>
      <Chapter n="04" label="Technology" id="tech"><TechnologyTrust /></Chapter>
      <Chapter n="05" label="BCT" id="bct"><BrandBand /></Chapter>
      <CTASection />
    </div>
  )
}
