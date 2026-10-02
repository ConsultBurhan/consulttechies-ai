import { SectionHeading } from '../SectionHeading'
import { Reveal } from '../Reveal'

export function AdaptSection() {
  return (
    <section className="section" aria-labelledby="ad-title">
      <div className="container">
        <SectionHeading eyebrow="Built around your organization" title={<span id="ad-title">Generic AI knows the world.<br /><em>Yours should know your organization.</em></span>}
          lede="Your terminology, your business rules, your workflows and the way your people talk to each other. Context adapts to all of it, and remembers who it is talking to." />
        <div className="ad">
          <Reveal className="ad__col">
            <span className="eyebrow">Generic assistant</span>
            <div className="msg msg--user"><p>What’s the sign-off for a P2 exception?</p></div>
            <div className="msg msg--ai msg--flat"><p className="muted">“P2 could refer to many things. Could you tell me more about what you mean by exception and your approval process?”</p></div>
          </Reveal>
          <Reveal className="ad__col ad__col--ours" delay={1}>
            <span className="eyebrow warm">Adapted to your organization</span>
            <div className="msg msg--user"><p>What’s the sign-off for a P2 exception?</p></div>
            <div className="msg msg--ai msg--flat"><p>“Under your exceptions policy, P2 deviations need approval from the department head, logged in the exceptions register within one working day.”</p></div>
            <small className="muted">Illustrative. Real answers come from your documents and rules.</small>
          </Reveal>
        </div>

        <div className="ad-pillars">
          {[['Terminology', 'Learns the words your people actually use.'], ['Business rules', 'Applies your policies, not generic defaults.'], ['Workflows', 'Understands how work moves through your teams.'], ['Tone', 'Answers in a voice that fits your culture.']].map(([t, d], i) => (
            <Reveal key={t} delay={i}><h3>{t}</h3><p className="muted">{d}</p></Reveal>
          ))}
        </div>

        <Reveal className="memory-thread">
          <div className="memory-thread__head"><span className="eyebrow">Contextual memory</span><p className="muted">Semantic and episodic memory keep conversations continuous and personal. The assistant remembers context, so you don’t repeat yourself.</p></div>
          <ol>
            <li><span className="mono">Monday</span><p>“Why is East behind target?”</p></li>
            <li className="gap"><span className="mono">Thursday</span><p className="ai">“Last week you asked about East. Here is how it moved since, with the same quarterly view you prefer.”</p></li>
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
