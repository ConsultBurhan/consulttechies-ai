import { Logo } from './Logo'

const LAYERS = 7
/** Brand mark as a stack of layers in depth; leans toward the pointer. Decorative. */
export function LogoPrism({ className = '' }: { className?: string }) {
  const lean = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 60).toFixed(1)}deg`)
    e.currentTarget.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * 40).toFixed(1)}deg`)
  }
  const reset = (e: React.PointerEvent<HTMLDivElement>) => { e.currentTarget.style.setProperty('--ry', '-18deg'); e.currentTarget.style.setProperty('--rx', '8deg') }
  return (
    <div className={`prism ${className}`} onPointerMove={lean} onPointerLeave={reset} aria-hidden="true">
      <div className="prism__body">
        {Array.from({ length: LAYERS }, (_, i) => (
          <Logo key={i} className="prism__layer" mono={i < LAYERS - 1} />
        )).map((el, i) => <div key={i} className="prism__slice" style={{ '--z': `${(i - (LAYERS - 1)) * 16}px`, '--o': i === LAYERS - 1 ? 1 : 0.1 + i * 0.05 } as React.CSSProperties}>{el}</div>)}
      </div>
    </div>
  )
}
