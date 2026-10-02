import { SectionHeading } from '../SectionHeading'
import { Reveal } from '../Reveal'
import { ProductDemo } from '../demo/ProductDemo'

const FLOW = ['Business question', 'Data', 'Intelligence', 'Insight', 'Decision']

/** One section for "what is this?": the idea, the flow, and the product itself. */
export function ProductSection() {
  return (
    <section className="section product" id="demo" aria-labelledby="pd-title">
      <div className="container">
        <SectionHeading eyebrow="01 / THE PRODUCT" title={<span id="pd-title">Not another chatbot. <em>An AI layer for your organization.</em></span>}
          lede="Your answers are scattered across databases, documents and dashboards. Context connects them and puts one conversation in front, so people can ask and get answers grounded in your own data." />
        <Reveal>
          <ol className="flow mono" aria-label="From question to decision">
            {FLOW.map((f, i) => <li key={f}><i>{String(i + 1).padStart(2, '0')}</i>{f}</li>)}
          </ol>
        </Reveal>
        <ProductDemo />
      </div>
    </section>
  )
}
