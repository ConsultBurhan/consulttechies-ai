import { NET_NODES } from './network'

/** Static-ish SVG network for no-WebGL, low-power or failed-load cases. Same story, no GPU. */
export function HeroFallback({ active, working }: { active: string[]; working: boolean }) {
  const pts = NET_NODES.map((n) => ({ ...n, x: 50 + n.pos[0] * 11 + n.pos[2] * 2, y: 50 - n.pos[1] * 12 }))
  return (
    <svg className="hero-fallback" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {pts.map((p) => (
        <line key={p.id} x1="50" y1="50" x2={p.x} y2={p.y} className={`hf-line ${working && active.includes(p.id) ? 'on' : ''}`} />
      ))}
      {pts.map((p, i) => (
        <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
          <rect x="-1.3" y="-1.3" width="2.6" height="2.6" className={p.kind === 'people' ? 'hf-warm' : 'hf-cool'} transform="rotate(45)" />
          <text y="-3.6" textAnchor="middle" className="hf-label" style={{ animationDelay: `${i * 0.2}s` }}>{p.label}</text>
        </g>
      ))}
      <rect x="46" y="46" width="8" height="8" className="hf-core" />
      <rect x="48.4" y="48.4" width="3.2" height="3.2" className="hf-core-in" />
    </svg>
  )
}
