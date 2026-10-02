import { BarList } from '../demo/charts'
import { Insight, Src } from '../demo/Results'
import { REGIONS } from '../demo/scenarios'
import { SectionHeading } from '../SectionHeading'
import { Reveal } from '../Reveal'

export function AnalyzeViz() {
  return (
    <div className="analyze__viz">
      <div className="viz__bar mono"><span>QUERY / “Which regions are underperforming this quarter?”</span><span className="viz__done">ANALYSIS COMPLETE</span></div>
      <p className="chart-title">Revenue vs target <span className="legend"><i className="lg-bar" />Actual <i className="lg-tick" />Target</span></p>
      <BarList label="Revenue against target by region" target rows={REGIONS.map((r) => ({ name: r.name, value: r.rev, target: r.target }))} highlight={(r) => (r.target ?? 0) > r.value} />
      <Insight label="Identified issue">East and South are behind plan while North and West are ahead, so the gap is regional, not company-wide.</Insight>
      <Src>Sales database · Customer CRM · Finance ledger. Sample data.</Src>
    </div>
  )
}

/** Standalone analysis chapter (used on the Product page). */
export function AnalyzeSection() {
  return (
    <section className="section analyze" aria-labelledby="an-title">
      <div className="container analyze__grid">
        <div className="analyze__text">
          <SectionHeading eyebrow="BCT / ANALYZE" title={<span id="an-title">Turn business data into <em>insight.</em></span>}
            lede="Ask for a comparison, a trend or an explanation. Context queries the data, finds the pattern and shows it in the form that fits the question." />
          <Reveal as="ul" className="analyze__verbs mono"><li>COMPARE</li><li>TREND</li><li>EXPLAIN</li></Reveal>
        </div>
        <Reveal className="analyze__viz" delay={1}>
          <div className="viz__bar mono"><span>QUERY / “Which regions are underperforming this quarter?”</span><span className="viz__done">ANALYSIS COMPLETE</span></div>
          <p className="chart-title">Revenue vs target <span className="legend"><i className="lg-bar" />Actual <i className="lg-tick" />Target</span></p>
          <BarList label="Revenue against target by region" target rows={REGIONS.map((r) => ({ name: r.name, value: r.rev, target: r.target }))} highlight={(r) => (r.target ?? 0) > r.value} />
          <Insight label="Identified issue">East and South are behind plan while North and West are ahead, so the gap is regional, not company-wide.</Insight>
          <Src>Sales database · Customer CRM · Finance ledger. Sample data.</Src>
        </Reveal>
      </div>
    </section>
  )
}
