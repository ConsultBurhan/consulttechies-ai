import { Reveal } from '../Reveal'

const PAIRS = [['searching', 'conversation'], ['dashboard navigation', 'automation'], ['repetitive reporting', 'insight'], ['Excel overhead', 'personalization'], ['complexity', 'productivity']] as const

export function LessMore() {
  return (
    <section className="section lessmore" aria-label="Less and more">
      <div className="container lessmore__grid">
        <ul className="lessmore__col lessmore__less">
          {PAIRS.map(([l], i) => <Reveal as="li" key={l} delay={i}><small>Less</small><span>{l}</span></Reveal>)}
        </ul>
        <ul className="lessmore__col lessmore__more">
          {PAIRS.map(([, m], i) => <Reveal as="li" key={m} delay={i}><small>More</small><span>{m}</span></Reveal>)}
        </ul>
        <Reveal className="lessmore__end"><p className="display">Better decisions.</p></Reveal>
      </div>
    </section>
  )
}
