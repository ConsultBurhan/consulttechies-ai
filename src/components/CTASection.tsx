import { Link } from 'react-router-dom'
import { Button } from './Button'
import { Reveal } from './Reveal'
import { Logo } from './Logo'

type Variant = 'band' | 'link' | 'split' | 'card' | 'mark'
type Props = { title?: React.ReactNode; body?: string; variant?: Variant }

const NEXT = [['We read your note', 'and come prepared with questions about your data and workflows.'], ['We talk it through', 'a business conversation, not a sales script.'], ['We show you', 'a demo shaped around how your organization works.']] as const

/** Closing call to action. The layout changes per page so no two pages end the same way. */
export function CTASection({ title, body, variant = 'band' }: Props) {
  const h = title ?? <>Your business already has the data. <em>Give it an interface people can talk to.</em></>
  const p = body ?? 'Tell us how your organization works today. We will show you what it looks like when it can answer back.'
  const actions = <div className="cta__actions"><Button to="/contact" size="lg" arrow>Request a demo</Button><Button to="/product" variant="ghost" size="lg">Explore the product</Button></div>
  if (variant === 'link') return (
    <section className="section cta-link" id="start" aria-labelledby="cta-title">
      <div className="container">
        <span className="eyebrow">START / THE CONVERSATION</span>
        <Reveal><h2 id="cta-title" className="display">{h}</h2></Reveal>
        <Reveal delay={1}><Link className="cta-link__go" to="/contact"><span>Request a demo</span><svg width="44" height="44" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></Link></Reveal>
        <p className="muted cta-link__p">{p}</p>
      </div>
    </section>
  )
  if (variant === 'split') return (
    <section className="section cta-split" id="start" aria-labelledby="cta-title">
      <div className="container cta-split__grid">
        <div><span className="eyebrow">START / THE CONVERSATION</span><Reveal><h2 id="cta-title" className="display">{h}</h2></Reveal><p className="lede">{p}</p>{actions}</div>
        <Reveal delay={1}><ol className="glass-card cta-split__next" aria-label="What happens next">{NEXT.map(([a, b], i) => <li key={a}><span className="mono">0{i + 1}</span><div><b>{a}</b><span className="muted"> {b}</span></div></li>)}</ol></Reveal>
      </div>
    </section>
  )
  if (variant === 'card') return (
    <section className="section cta-card" id="start" aria-labelledby="cta-title">
      <div className="container"><Reveal className="glass-card cta-card__box"><span className="eyebrow">START / THE CONVERSATION</span><h2 id="cta-title" className="display">{h}</h2><p className="lede">{p}</p>{actions}</Reveal></div>
    </section>
  )
  if (variant === 'mark') return (
    <section className="section cta cta--mark" id="start" aria-labelledby="cta-title">
      <Logo className="cta__mark" mono />
      <div className="container cta__inner"><span className="eyebrow">START / THE CONVERSATION</span><Reveal><h2 id="cta-title" className="display">{h}</h2></Reveal><Reveal delay={1}><p className="lede">{p}</p></Reveal><Reveal delay={2}>{actions}</Reveal></div>
    </section>
  )
  return (
    <section className="section cta" id="start" aria-labelledby="cta-title">
      <div className="container cta__inner">
        <span className="eyebrow">START / THE CONVERSATION</span>
        <Reveal><h2 id="cta-title" className="display">{h}</h2></Reveal>
        <Reveal delay={1}><p className="lede">{p}</p></Reveal>
        <Reveal delay={2}>{actions}</Reveal>
      </div>
    </section>
  )
}
