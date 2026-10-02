import { useState } from 'react'

const fmt = (n: number) => `$${n.toFixed(1)}M`

/** Horizontal bars. Thin marks, rounded data-end, direct value labels, recessive baseline. */
export function BarList({ rows, max, highlight, target, format = fmt, label }: {
  rows: { name: string; value: number; target?: number }[]
  max?: number
  highlight?: (r: { name: string; value: number; target?: number }) => boolean
  target?: boolean
  format?: (n: number) => string
  label: string
}) {
  const m = max ?? Math.max(...rows.map((r) => Math.max(r.value, r.target ?? 0))) * 1.05
  const [hover, setHover] = useState<string | null>(null)
  return (
    <ul className="bars" aria-label={label}>
      {rows.map((r, i) => (
        <li key={r.name} onPointerEnter={() => setHover(r.name)} onPointerLeave={() => setHover(null)} data-dim={hover && hover !== r.name ? '1' : '0'}>
          <span className="bars__name">{r.name}</span>
          <span className="bars__track">
            <i className={`bars__fill ${highlight?.(r) ? 'is-flag' : ''}`} style={{ '--w': `${(r.value / m) * 100}%`, '--i': i } as React.CSSProperties} />
            {target && r.target != null && <b className="bars__target" style={{ left: `${(r.target / m) * 100}%` }} title={`Target ${format(r.target)}`} />}
          </span>
          <span className="bars__val">{format(r.value)}</span>
        </li>
      ))}
    </ul>
  )
}

/** Diverging bars around a zero line. Two hues + neutral: cool = up, warm = down. */
export function DivergingBars({ rows, label }: { rows: { name: string; value: number }[]; label: string }) {
  const m = Math.max(...rows.map((r) => Math.abs(r.value))) * 1.1
  return (
    <ul className="div" aria-label={label}>
      {rows.map((r, i) => (
        <li key={r.name}>
          <span className="bars__name">{r.name}</span>
          <span className="div__track">
            <i className={r.value >= 0 ? 'up' : 'down'} style={{ '--w': `${(Math.abs(r.value) / m) * 50}%`, '--i': i } as React.CSSProperties} />
          </span>
          <span className={`bars__val ${r.value >= 0 ? 'cool' : 'neg'}`}>{r.value > 0 ? '+' : '−'}{Math.abs(r.value)}%<span className="visually-hidden">{r.value >= 0 ? ' increase' : ' decrease'}</span></span>
        </li>
      ))}
    </ul>
  )
}

/** 2px line with a crosshair + tooltip on hover (pointer or keyboard). */
export function TrendLine({ points, labels, label }: { points: number[]; labels: string[]; label: string }) {
  const [hi, setHi] = useState<number | null>(null)
  const W = 520, H = 170, pad = { l: 8, r: 8, t: 14, b: 22 }
  const min = Math.min(...points) * 0.9, max = Math.max(...points) * 1.05
  const x = (i: number) => pad.l + (i / (points.length - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b)
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(' ')
  const area = `${d} L${x(points.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`
  return (
    <figure className="trend">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') setHi((h) => Math.min(points.length - 1, (h ?? -1) + 1)); if (e.key === 'ArrowLeft') setHi((h) => Math.max(0, (h ?? 1) - 1)); if (e.key === 'Escape') setHi(null) }}
        onBlur={() => setHi(null)}
        onPointerLeave={() => setHi(null)}
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const f = ((e.clientX - r.left) / r.width) * W; setHi(Math.max(0, Math.min(points.length - 1, Math.round(((f - pad.l) / (W - pad.l - pad.r)) * (points.length - 1))))) }}>
        {[0.25, 0.5, 0.75].map((f) => <line key={f} className="grid" x1={pad.l} x2={W - pad.r} y1={pad.t + f * (H - pad.t - pad.b)} y2={pad.t + f * (H - pad.t - pad.b)} />)}
        <path className="trend__area" d={area} />
        <path className="trend__line" d={d} pathLength={1} />
        {hi != null && <g><line className="trend__cross" x1={x(hi)} x2={x(hi)} y1={pad.t} y2={H - pad.b} /><circle className="trend__dot" cx={x(hi)} cy={y(points[hi])} r="4.5" /></g>}
        {labels.map((l, i) => (i % 2 === 0 || labels.length < 6) && <text key={l} className="trend__x" x={x(i)} y={H - 5} textAnchor="middle">{l}</text>)}
      </svg>
      {hi != null && <figcaption className="tip" style={{ left: `${(x(hi) / W) * 100}%` }}><b>${points[hi].toFixed(2)}M</b> {labels[hi]}</figcaption>}
    </figure>
  )
}
