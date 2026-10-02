import { useEffect, useState } from 'react'
import { SectionHeading } from '../SectionHeading'
import { useInView, usePrefersReducedMotion } from '../../hooks/useMotion'
import { BarList } from '../demo/charts'

const STEPS = [
  { k: 'Ask', t: 'Ask in plain language', d: 'No query syntax. No hunting for the right dashboard. Just the question, the way you would ask a colleague.' },
  { k: 'Understand', t: 'Understand what you mean', d: 'The assistant works out the intent, the metric, the time frame and which sources hold the answer.' },
  { k: 'Analyze', t: 'Retrieve and analyze', d: 'It queries connected databases and documents, compares results and finds the pattern that matters.' },
  { k: 'Visualize', t: 'Show it, don’t describe it', d: 'Charts and KPIs are generated for the specific question, not pulled from a fixed dashboard.' },
  { k: 'Report', t: 'Turn it into a deliverable', d: 'The analysis becomes a structured report, as a spreadsheet or PDF, ready to share.' },
] as const

function Visual({ i }: { i: number }) {
  if (i === 0) return <div className="wf-v"><div className="msg msg--user"><p>Compare sales performance across all regions for the last quarter.</p></div></div>
  if (i === 1) return (
    <div className="wf-v wf-v--tags">
      <span className="tag"><small>intent</small>compare</span><span className="tag"><small>metric</small>sales revenue</span>
      <span className="tag"><small>dimension</small>region</span><span className="tag"><small>period</small>last quarter</span>
      <span className="tag tag--cool"><small>sources</small>sales DB · finance ledger</span>
    </div>
  )
  if (i === 2) return (
    <div className="wf-v wf-v--rows">
      {['Sales database · 4 regions', 'Finance ledger · 2 quarters', 'Trend analysis · QoQ change'].map((r, n) => <p key={r} style={{ '--i': n } as React.CSSProperties}><span className="tick" />{r}</p>)}
    </div>
  )
  if (i === 3) return <div className="wf-v"><BarList label="Revenue by region" rows={[{ name: 'North', value: 2.4 }, { name: 'West', value: 1.8 }, { name: 'South', value: 1.2 }, { name: 'East', value: 0.9 }]} highlight={(r) => r.name === 'East'} /></div>
  return (
    <div className="wf-v wf-v--files">
      <div className="file"><span className="file__ico mono">PDF</span><span><b>Q3-regional-report.pdf</b><small>Summary, charts, recommendations</small></span></div>
      <div className="file"><span className="file__ico mono">XLS</span><span><b>Q3-regional-data.xlsx</b><small>Underlying data, ready to edit</small></span></div>
    </div>
  )
}

export function WorkflowSection() {
  const calm = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3, repeat: true })
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (!inView || hold || calm) return
    const t = window.setTimeout(() => setI((n) => (n + 1) % STEPS.length), 4200)
    return () => clearTimeout(t)
  }, [inView, hold, calm, i])

  return (
    <section className="section" id="workflow" aria-labelledby="wf-title">
      <div className="container">
        <SectionHeading eyebrow="How it works" title={<span id="wf-title">Ask a question. <em>Get a report.</em></span>} lede="From a sentence to a finished deliverable, in one conversation." />
        <div className="wf" ref={ref} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
          <ol className="wf__steps" role="tablist" aria-label="Workflow steps" aria-orientation="vertical">
            {STEPS.map((s, n) => (
              <li key={s.k} role="presentation">
                <button role="tab" id={`wf-tab-${n}`} aria-selected={i === n} aria-controls="wf-panel" tabIndex={i === n ? 0 : -1} className={i === n ? 'on' : ''}
                  onClick={() => setI(n)}
                  onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setI((n + 1) % STEPS.length) } if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setI((n + STEPS.length - 1) % STEPS.length) } }}>
                  <span className="wf__n mono">0{n + 1}</span><span className="wf__k">{s.k}</span>
                  {i === n && !calm && !hold && inView && <i className="wf__timer" key={`${n}-${i}`} />}
                </button>
              </li>
            ))}
          </ol>
          <div className="wf__panel" id="wf-panel" role="tabpanel" aria-labelledby={`wf-tab-${i}`}>
            <h3>{STEPS[i].t}</h3>
            <p className="muted">{STEPS[i].d}</p>
            <div className="wf__visual" key={i}><Visual i={i} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
