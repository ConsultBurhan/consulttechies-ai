import { Button } from './Button'
import { Reveal } from './Reveal'
import { Logo } from './Logo'

export function CTASection({ title, body }: { title?: React.ReactNode; body?: string }) {
  return (
    <section className="section cta" aria-labelledby="cta-title">
      <div className="container cta__inner">
        <Logo className="cta__mark" />
        <Reveal><h2 id="cta-title" className="display">{title ?? <>Your business already has the data.<br /><em>Give it an interface people can talk to.</em></>}</h2></Reveal>
        <Reveal delay={1}><p className="lede">{body ?? 'Tell us how your organization works today. We will show you what it looks like when it can answer back.'}</p></Reveal>
        <Reveal delay={2}><div className="cta__actions"><Button to="/contact" size="lg" arrow>Request a demo</Button><Button to="/product" variant="ghost" size="lg">Explore the product</Button></div></Reveal>
      </div>
    </section>
  )
}
