import { useState } from 'react'
import { BarList, DivergingBars, TrendLine } from './charts'
import { REGIONS, type Result } from './scenarios'

const Kpi = ({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: 'up' | 'down' }) => (
  <div className="kpi"><span>{label}</span><b>{value}</b>{delta && <em className={tone === 'down' ? 'warm' : 'cool'}>{delta}</em>}</div>
)
const Insight = ({ children, label = 'Insight' }: { children: React.ReactNode; label?: string }) => (
  <div className="insight"><span className="insight__label">{label}</span><p>{children}</p></div>
)
const Src = ({ children }: { children: React.ReactNode }) => <p className="srcline"><span aria-hidden="true">↳</span> {children}</p>

function ReportResult() {
  const [note, setNote] = useState('')
  return (
    <div className="report">
      <div className="report__page" aria-label="Report preview">
        <header><span className="mono">Quarterly business report</span><span className="mono">Sample</span></header>
        <h4>Q3 performance review</h4>
        <div className="report__kpis"><Kpi label="Revenue" value="$6.3M" /><Kpi label="Best region" value="West" delta="+18%" /><Kpi label="Needs attention" value="East" delta="−7%" tone="down" /></div>
        <BarList label="Revenue by region" rows={REGIONS.map((r) => ({ name: r.name, value: r.rev }))} />
        <p className="report__lines"><i /><i /><i style={{ width: '70%' }} /></p>
      </div>
      <div className="report__side">
        <p className="insight__label">Generated artifacts</p>
        {[['Q3-regional-report.pdf', 'PDF · 6 pages'], ['Q3-regional-data.xlsx', 'Excel · 4 sheets']].map(([n, m]) => (
          <button key={n} className="file" onClick={() => setNote('In the live product this downloads the generated file. This is a simulation.')}>
            <span className="file__ico mono" aria-hidden="true">{n.endsWith('pdf') ? 'PDF' : 'XLS'}</span><span><b>{n}</b><small>{m}</small></span>
          </button>
        ))}
        <p className="srcline" role="status">{note || 'Sample files — nothing is downloaded from this demo.'}</p>
      </div>
    </div>
  )
}

export function ResultView({ result }: { result: Result }) {
  switch (result.type) {
    case 'regions':
      return (<>
        <div className="kpis"><Kpi label="Total revenue" value="$6.3M" delta="+5% vs Q2" /><Kpi label="Strongest" value="West" delta="+18% QoQ" /><Kpi label="Weakest" value="East" delta="−7% QoQ" tone="down" /></div>
        <p className="chart-title">Quarterly revenue by region</p>
        <BarList label="Quarterly revenue by region" rows={REGIONS.map((r) => ({ name: r.name, value: r.rev }))} highlight={(r) => r.name === 'East'} />
        <Insight>West revenue increased 18% quarter-over-quarter, while East declined 7%. East is the only region trending down.</Insight>
        <Src>Sales database · Finance ledger — sample data</Src>
      </>)
    case 'underperf':
      return (<>
        <p className="chart-title">Revenue vs target <span className="legend"><i className="lg-bar" />Actual <i className="lg-tick" />Target</span></p>
        <BarList label="Revenue against target by region" target rows={REGIONS.map((r) => ({ name: r.name, value: r.rev, target: r.target }))} highlight={(r) => (r.target ?? 0) > r.value} />
        <div className="flags">
          <div><b className="warm">East</b><span>$0.5M below target (−36%)</span></div>
          <div><b className="warm">South</b><span>$0.3M below target (−20%)</span></div>
        </div>
        <Insight label="Identified issue">East and South are behind plan. North and West are ahead, so the gap is regional, not company-wide.</Insight>
        <Src>Sales database · Customer CRM · Finance ledger — sample data</Src>
      </>)
    case 'month':
      return (<>
        <div className="kpis"><Kpi label="Revenue" value="$2.1M" delta="+6%" /><Kpi label="New customers" value="148" delta="+11%" /><Kpi label="Open orders" value="312" delta="−3%" tone="down" /></div>
        <p className="chart-title">Weekly revenue, this month</p>
        <TrendLine label="Weekly revenue this month" points={[0.44, 0.49, 0.52, 0.61, 0.58]} labels={['W1', 'W2', 'W3', 'W4', 'W5']} />
        <Insight label="Summary">A steady month. Revenue climbed through week four and eased slightly in week five. Open orders are down, which suggests fulfillment is catching up.</Insight>
        <Src>Sales · Finance · Operations · CRM — sample data</Src>
      </>)
    case 'person':
      return (<>
        <div className="person"><span className="avatar avatar--lg" aria-hidden="true" /><div><b>Head of Operations</b><span>Operations department</span><span className="mono">Reports to: Chief Operating Officer</span></div></div>
        <Insight label="Answer">The operations department is managed by its department head, who reports to the COO. Three team leads report in to them.</Insight>
        <Src>Org directory — sample record. Shown because your role is allowed to view the directory.</Src>
      </>)
    case 'process':
      return (<>
        <ol className="process">
          {[['Week 0', 'Accounts, equipment and access are prepared before day one.'], ['Day 1', 'Welcome, team introductions and a walkthrough of how the department works.'], ['Week 1', 'Company policies, norms and the tools you will use.'], ['Day 30', 'First review with your manager against a written plan.']].map(([t, b]) => <li key={t}><span className="mono">{t}</span><p>{b}</p></li>)}
        </ol>
        <Src>Employee handbook · Onboarding checklist — sample documents</Src>
      </>)
    case 'report':
      return <ReportResult />
    case 'change':
      return (<>
        <p className="chart-title">Revenue change vs last quarter</p>
        <DivergingBars label="Revenue change by region versus last quarter" rows={REGIONS.map((r) => ({ name: r.name, value: r.qoq }))} />
        <Insight>Growth is concentrated in West (+18%). North and South are roughly flat. East is the only decline (−7%) and the one to look at first.</Insight>
        <Src>Sales database · Finance ledger, two quarters — sample data</Src>
      </>)
  }
}
