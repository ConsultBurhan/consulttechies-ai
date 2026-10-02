import { ReportResult } from '../demo/Results'
import { SectionHeading } from '../SectionHeading'
import { Reveal } from '../Reveal'

/** Chapter 07: the analysis becomes an artifact people can share. */
export function ReportSection() {
  return (
    <section className="section section--tint report-sec" aria-labelledby="rp-title">
      <div className="container">
        <SectionHeading align="center" eyebrow="BCT / REPORT" title={<span id="rp-title">Ask a question. <em>Get a report.</em></span>}
          lede="The analysis becomes a structured report with charts, delivered as a spreadsheet or a PDF, ready to share." />
        <Reveal className="report-sec__frame"><ReportResult /></Reveal>
      </div>
    </section>
  )
}
