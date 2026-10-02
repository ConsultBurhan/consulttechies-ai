import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { ServicesGrid } from '../components/sections/ServicesGrid'
import { SectionHeading } from '../components/SectionHeading'
import { CTASection } from '../components/CTASection'
import { Logo } from '../components/Logo'
import { useSeo } from '../hooks/useSeo'
import { SITE } from '../content/site'

const AUDIENCE = [['Startups', 'who need a robust website'], ['Enterprises', 'who need a custom application'], ['Growing companies', 'who want to optimize their CRM processes']] as const

export default function About() {
  useSeo({ title: 'About Us', path: '/about', description: 'Babji Consult Techies is an IT solutions company founded in 2023, specializing in web development, application development, CRM management and enterprise AI.' })
  return (
    <div className="page">
      <PageHeader eyebrow="About us" title={<>Accelerating growth with <em>innovative IT solutions.</em></>}
        lede="Babji Consult Techies is a technology partner for businesses that want to elevate their digital presence and streamline how they operate." />

      <section className="section story" aria-label="Our story">
        <div className="container story__grid">
          <Reveal className="story__mark"><Logo className="story__logo" /><p className="mono">Est. {SITE.founded}</p></Reveal>
          <div className="story__body">
            <Reveal><span className="eyebrow">Origin</span><h2 className="display">Founded in {SITE.founded}. <em>Trusted quickly.</em></h2>
              <p className="muted">We started with a focus on web development, app development and CRM management, and a commitment to delivering excellence. Our team combines technical expertise with a close understanding of current industry trends, so clients get solutions that fit their needs.</p></Reveal>
            <Reveal><span className="eyebrow">Philosophy</span><blockquote className="display pull">Technology should simplify and empower businesses.</blockquote>
              <p className="muted">We aim for solutions that are technologically advanced, but also user-friendly and scalable. Capability people can actually use.</p></Reveal>
            <Reveal><span className="eyebrow">Approach</span><h2 className="display">Built around <em>your</em> business.</h2>
              <ul className="audience">{AUDIENCE.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul></Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="svc-title">
        <div className="container">
          <SectionHeading eyebrow="What we do" title={<span id="svc-title">Four things, <em>done properly.</em></span>} lede="From a first website to a company-wide intelligence layer." />
          <ServicesGrid />
        </div>
      </section>

      <section className="section" aria-labelledby="fut-title">
        <div className="container future">
          <Reveal><span className="eyebrow">Where we’re heading</span><h2 id="fut-title" className="display">From software that stores information to <em>software that understands it.</em></h2></Reveal>
          <Reveal delay={1}><p className="lede">Our enterprise AI assistant is the next step in that idea: connect an organization’s data, documents and systems, and let people simply ask. It is the same belief we started with. Technology should make business simpler.</p></Reveal>
        </div>
      </section>
      <CTASection title={<>Let’s build something <em>intelligent.</em></>} body="Tell us what you are trying to solve. We’ll start with the conversation." />
    </div>
  )
}
