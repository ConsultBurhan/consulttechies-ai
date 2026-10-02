import { SectionHeading } from '../SectionHeading'
import { Button } from '../Button'
import { ServicesGrid } from './ServicesGrid'
import { SITE } from '../../content/site'

/** Who is behind it: short, with the four things BCT does. */
export function BrandBand() {
  return (
    <section className="section brandband" aria-labelledby="co-title">
      <div className="container">
        <SectionHeading eyebrow="05 / BABJI CONSULT TECHIES" title={<span id="co-title">Technology that should <em>simplify and empower.</em></span>}
          lede={`Founded in ${SITE.founded}, BCT is an IT solutions company building web, application, CRM and enterprise AI technology that is advanced, easy to use and ready to scale.`} />
        <ServicesGrid />
        <div className="section__foot"><Button to="/about" variant="ghost">Our story</Button></div>
      </div>
    </section>
  )
}
