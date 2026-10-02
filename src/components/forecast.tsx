import { useState } from 'react'
import { FUTURE, QUARTERS, REVENUE, SCENARIOS, project, type ScenarioId } from '../lib/forecast'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'

const W = 760, H = 340, pad = { l: 40, r: 16, t: 26, b: 32 }
const money = (v: number) => `$${v.toFixed(2)}M`

/** History (solid), projected median (dashed accent) and likely range (band). Hover, drag or arrow-key to inspect. */
export function ForecastFigure({ scenario }: { scenario: ScenarioId }) {
  const { points } = project(scenario)
  const [idx, setIdx] = useState<number | null>(null)
  const n = REVENUE.length, total = n + points.length
  const lo = Math.min(...REVENUE) * 0.9, hi = Math.max(...points.map((p) => p.hi)) * 1.04
  const x = (i: number) => pad.l + (i / (total - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b)
  const hist = REVENUE.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const pts = [{ mid: REVENUE[n - 1], lo: REVENUE[n - 1], hi: REVENUE[n - 1] }, ...points]
  const mid = pts.map((p, i) => `${i ? 'L' : 'M'}${x(n - 1 + i).toFixed(1)},${y(p.mid).toFixed(1)}`).join(' ')
  const band = pts.map((p, i) => `${i ? 'L' : 'M'}${x(n - 1 + i).toFixed(1)},${y(p.hi).toFixed(1)}`).join(' ') + [...pts].reverse().map((p, i) => ` L${x(total - 1 - i).toFixed(1)},${y(p.lo).toFixed(1)}`).join('') + ' Z'
  const last = total - 1, cur = idx ?? last
  const isF = cur >= n, v = isF ? points[cur - n] : { mid: REVENUE[cur], lo: REVENUE[cur], hi: REVENUE[cur] }
  const set = (cx: number, el: SVGSVGElement) => { const r = el.getBoundingClientRect(); const px = ((cx - r.left) / r.width) * W; setIdx(Math.max(0, Math.min(last, Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (total - 1))))) }

  return (
    <figure className="fig">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" tabIndex={0} aria-label="Quarterly revenue history with a projected range. Use the arrow keys to inspect each quarter."
        onPointerMove={(e) => set(e.clientX, e.currentTarget)} onPointerLeave={() => setIdx(null)} onBlur={() => setIdx(null)}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') setIdx(Math.min(last, cur + 1)); if (e.key === 'ArrowLeft') setIdx(Math.max(0, cur - 1)); if (e.key === 'Escape') setIdx(null) }}>
        {[0, 0.5, 1].map((f) => <line key={f} className="fig__grid" x1={pad.l} x2={W - pad.r} y1={pad.t + f * (H - pad.t - pad.b)} y2={pad.t + f * (H - pad.t - pad.b)} />)}
        <rect className="fig__future" x={x(n - 1)} y={pad.t} width={x(last) - x(n - 1)} height={H - pad.t - pad.b} />
        <line className="fig__now" x1={x(n - 1)} x2={x(n - 1)} y1={pad.t - 6} y2={H - pad.b} />
        <text className="fig__lbl" x={x(n - 1) + 8} y={pad.t + 8}>NOW</text>
        <text className="fig__lbl" x={pad.l} y={pad.t - 10}>HISTORICAL</text>
        <text className="fig__lbl fig__lbl--a" x={x(last)} y={pad.t - 10} textAnchor="end">PROJECTED</text>
        <path className="fig__band" d={band} />
        <path className="fig__hist" d={hist} />
        <path className="fig__mid" d={mid} />
        {[...QUARTERS, ...FUTURE].map((q, i) => i % 3 === 0 && <text key={q} className="fig__x" x={x(i)} y={H - 9} textAnchor="middle">{q}</text>)}
        <line className="fig__cross" x1={x(cur)} x2={x(cur)} y1={pad.t} y2={H - pad.b} />
        <rect className={`fig__dot ${isF ? 'is-f' : ''}`} x={x(cur) - 4.5} y={y(v.mid) - 4.5} width="9" height="9" />
      </svg>
      <figcaption className="fig__tip" style={{ left: `${Math.min(80, Math.max(14, (x(cur) / W) * 100))}%` }}>
        <span className="mono">{isF ? FUTURE[cur - n] : QUARTERS[cur]} / {isF ? 'PROJECTED' : 'ACTUAL'}</span>
        <b>{money(v.mid)}</b>
        {isF && <small>likely range {money(v.lo)} to {money(v.hi)}</small>}
      </figcaption>
    </figure>
  )
}

const PIPE = ['Historical data', 'Pattern detection', 'Trend analysis', 'Forecast', 'Potential outcomes']

/** Scenario control + figure + readouts. Used in the capabilities tabs and the full prediction band. */
export function ForecastPanel() {
  const [sc, setSc] = useState<ScenarioId>('baseline')
  const { drift } = project(sc)
  const pct = (Math.exp(drift) - 1) * 100
  return (
    <div className="predict__grid">
      <div className="predict__side">
        <p className="mono predict__q">QUERY / “Based on our historical sales data, what could next quarter look like?”</p>
        <div className="seg" role="radiogroup" aria-label="Scenario">
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((k) => <button key={k} role="radio" aria-checked={sc === k} className={sc === k ? 'on' : ''} onClick={() => setSc(k)}>{SCENARIOS[k].label}</button>)}
        </div>
        <dl className="predict__read">
          <div><dt className="mono">ASSUMPTION</dt><dd>{SCENARIOS[sc].blurb}</dd></div>
          <div><dt className="mono">IMPLIED TREND</dt><dd>{pct >= 0 ? '+' : '−'}{Math.abs(pct).toFixed(1)}% per quarter, from the last eight quarters</dd></div>
        </dl>
        <p className="fine">Illustrative sample data. Forecasts are estimates drawn from historical patterns and the assumptions chosen. They are not guarantees, and what can be forecast depends on the data available.</p>
      </div>
      <div className="predict__fig"><ForecastFigure scenario={sc} /></div>
    </div>
  )
}

/** Full-width prediction band (Product page): an inverted surface for contrast. */
export function PredictionSection({ id = 'prediction', eyebrow = 'AI / FORECAST' }: { id?: string; eyebrow?: string }) {
  return (
    <section className="section predict invert" id={id} aria-labelledby="pr-title">
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={<span id="pr-title">Don’t just understand what happened. <em>See what could happen next.</em></span>}
          lede="Using an organization’s historical data, Context can identify patterns and trends and estimate potential future outcomes, so teams can plan sales, demand and resources ahead of time." />
        <Reveal>
          <ol className="pipe mono" aria-label="How a forecast is built">{PIPE.map((p, i) => <li key={p}><i>{String(i + 1).padStart(2, '0')}</i>{p}</li>)}</ol>
        </Reveal>
        <ForecastPanel />
      </div>
    </section>
  )
}
