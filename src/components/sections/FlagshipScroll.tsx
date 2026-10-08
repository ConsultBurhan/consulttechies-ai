import { FLAGSHIP } from '../../content/clients'
import { useScrollProgress } from '../../hooks/useMotion'

// figures are from public company profiles
const STATS = [['stores', 250, '+', 'Stores across Kuwait'], ['people', 4000, '+', 'People on the team'], ['nations', 40, '', 'Nationalities at work']] as const

/** Flagship client: a pinned, cinematic scroll scene. A huge wordmark drifts behind the logo card, the card rises and turns, and the numbers count up. */
export function FlagshipScroll() {
  const root = useScrollProgress<HTMLElement>('--p')
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    const s = e.currentTarget.style
    s.setProperty('--ry', `${(x - 0.5) * 18}deg`); s.setProperty('--rx', `${(0.5 - y) * 14}deg`)
    s.setProperty('--gx', `${x * 100}%`); s.setProperty('--gy', `${y * 100}%`)
  }
  const reset = (e: React.PointerEvent<HTMLDivElement>) => { const s = e.currentTarget.style; s.setProperty('--ry', '0deg'); s.setProperty('--rx', '0deg') }
  return (
    <section ref={root} className="kscroll" aria-labelledby="fl-title">
      <div className="kscroll__sticky">
        <div className="kword" aria-hidden="true"><span>KOUT FOOD GROUP — KUWAIT — KOUT FOOD GROUP — KUWAIT —</span></div>
        <div className="container kscene">
          <header className="kscene__head">
            <span className="eyebrow">{FLAGSHIP.place} · {FLAGSHIP.note}</span>
            <h2 id="fl-title" className="display">{FLAGSHIP.name}</h2>
          </header>
          <div className="kcard-wrap">
            <div className="kcard" onPointerMove={tilt} onPointerLeave={reset}>
              <span className="kcard__glow" aria-hidden="true" />
              <img src={FLAGSHIP.logo} alt={FLAGSHIP.name} />
            </div>
          </div>
          <p className="kscene__lede lede">{FLAGSHIP.blurb}</p>
          <ul className="kstats">
            {STATS.map(([k, n, suffix, label], i) => (
              <li key={k} style={{ '--n': n, '--s': (0.22 + i * 0.2).toFixed(2) } as React.CSSProperties}>
                <b className="kstat__n"><span className="kstat__v" aria-hidden="true" /><span>{suffix}</span><span className="visually-hidden">{n}{suffix}</span></b>
                <span className="muted">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <span className="kscroll__hint mono" aria-hidden="true">Scroll</span>
      </div>
    </section>
  )
}
