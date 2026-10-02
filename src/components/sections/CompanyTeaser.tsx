import { SectionHeading } from '../SectionHeading'
import { Button } from '../Button'
import { ServicesGrid } from './ServicesGrid'
import { SITE } from '../../content/site'

export function CompanyTeaser() {
  return (
    <section className="section" aria-labelledby="co-title">
      <div className="container">
        <SectionHeading eyebrow="BCT / COMPANY" title={<span id="co-title">Technology that should <em>simplify and empower.</em></span>}
          lede={`Founded in ${SITE.founded}, BCT is an IT solutions company building web, application, CRM and enterprise AI technology. We build things that are advanced, but also easy to use and ready to scale.`} />
        <ServicesGrid />
        <div className="section__foot"><Button to="/about" variant="ghost">Our story</Button></div>
      </div>
    </section>
  )
}
