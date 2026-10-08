import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { JourneyStory, JourneyOneLine } from '../components/sections/JourneyStory'
import { CTASection } from '../components/CTASection'
import { LogoPrism } from '../components/LogoPrism'
import { useSeo } from '../hooks/useSeo'
import { SITE } from '../content/site'

const AUDIENCE = [['Enterprises', 'whose data lives in many systems'], ['Leadership teams', 'who want answers, not dashboards to dig through'], ['Growing companies', 'who want AI built around how they already work']] as const

export default function About() {
  useSeo({ title: 'About Us', path: '/about', description: 'Babji Consult Techies is an AI company founded in 2023, building enterprise AI systems that turn an organization’s data, documents and systems into answers.' })
  return (
    <div className="page">
      <PageHeader eyebrow="BCT / COMPANY" title={<>We build <em>AI systems</em> for business.</>}
        lede="Babji Consult Techies builds AI systems that help organizations understand their own data and act on it." />

      <section className="section story" aria-label="Our story">
        <div className="container story__grid">
          <Reveal className="story__mark"><LogoPrism className="story__logo" /><p className="mono">Est. {SITE.founded}</p></Reveal>
          <div className="story__body">
            <Reveal><span className="eyebrow">Origin</span><h2 className="display">Founded in {SITE.founded}. <em>Trusted quickly.</em></h2>
              <p className="muted">We build AI systems for organizations: assistants, data integration, knowledge systems and business intelligence that work from a company’s own information. Our team combines engineering depth with a close understanding of how businesses actually run.</p></Reveal>
            <Reveal><span className="eyebrow">Philosophy</span><blockquote className="display pull">Technology should simplify and empower businesses.</blockquote>
              <p className="muted">We aim for solutions that are technologically advanced, but also user-friendly and scalable. Capability people can actually use.</p></Reveal>
            <Reveal><span className="eyebrow">Approach</span><h2 className="display">Built around <em>your</em> business.</h2>
              <ul className="audience">{AUDIENCE.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul></Reveal>
          </div>
        </div>
      </section>

      <JourneyStory />
      <JourneyOneLine />

      <section className="section" aria-labelledby="fut-title">
        <div className="container future">
          <Reveal><span className="eyebrow">Where we’re heading</span><h2 id="fut-title" className="display">From software that stores information to <em>software that understands it.</em></h2></Reveal>
          <Reveal delay={1}><p className="lede">Our enterprise AI assistant is where that idea leads: connect an organization’s data, documents and systems, and let people simply ask. It is the same belief we started with. Technology should make business simpler.</p></Reveal>
        </div>
      </section>
      <CTASection variant="mark" title={<>Let’s build something <em>intelligent.</em></>} body="Tell us what you are trying to solve. We’ll start with the conversation." />
    </div>
  )
}
