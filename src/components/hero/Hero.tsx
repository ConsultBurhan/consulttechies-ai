import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Button'
import { usePrefersReducedMotion } from '../../hooks/useMotion'
import { NET_NODES, SOURCES_FOR } from './network'
import { HeroFallback } from './HeroFallback'
import { HERO_ANSWERS, HERO_PROMPTS, pickPrompt, type HeroAnswer } from './heroQA'
import type { ScenePhase } from './HeroScene'

const HeroScene = lazy(() => import('./HeroScene'))

function canUseWebGL() {
  try {
    const c = document.createElement('canvas')
    const ok = !!(c.getContext('webgl2') || c.getContext('webgl'))
    const nav = navigator as Navigator & { deviceMemory?: number }
    const weak = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
    return ok && !weak
  } catch { return false }
}

const STAGES = ['Understanding the question', 'Retrieving company data', 'Analyzing results', 'Writing the answer'] as const

function MiniAnswer({ a }: { a: HeroAnswer }) {
  if (a.kind === 'bars') {
    const max = Math.max(...a.rows.map((r) => r.value))
    return (
      <>
        <p className="mini__title">{a.title}</p>
        <ul className="mini__bars" aria-label={a.title}>
          {a.rows.map((r, i) => (
            <li key={r.label} style={{ '--w': `${(r.value / max) * 100}%`, '--i': i } as React.CSSProperties}>
              <span>{r.label}</span><i /><b>${r.value.toFixed(1)}{a.unit}</b>
            </li>
          ))}
        </ul>
        <p className="mini__insight">{a.insight}</p>
      </>
    )
  }
  if (a.kind === 'person') {
    return (<><p className="mini__title">{a.title}</p><div className="mini__person"><span className="avatar" aria-hidden="true" /><div><b>{a.name}</b><span>{a.role}</span></div></div><p className="mini__insight">{a.line}</p></>)
  }
  return (<><p className="mini__title">{a.title}</p><ol className="mini__steps">{a.steps.map((s, i) => <li key={s} style={{ '--i': i } as React.CSSProperties}>{s}</li>)}</ol></>)
}

export function Hero() {
  const calm = usePrefersReducedMotion()
  const [webgl] = useState(canUseWebGL)
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState<ScenePhase>('idle')
  const [stage, setStage] = useState(0)
  const [promptId, setPromptId] = useState('sales')
  const [text, setText] = useState('')
  const [sceneReady, setSceneReady] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const labels = useRef<Record<string, HTMLElement | null>>({})
  const timers = useRef<number[]>([])
  const miniRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const ask = (id: string, shown?: string) => {
    timers.current.forEach(clearTimeout); timers.current = []
    setPromptId(id); setText(shown ?? HERO_PROMPTS.find((p) => p.id === id)?.text ?? ''); setPhase('working'); setStage(0)
    // on small screens the answer card sits below the fold of the form: bring it into view
    if (window.innerWidth <= 900) window.setTimeout(() => miniRef.current?.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' }), 60)
    const step = calm ? 350 : 850
    STAGES.forEach((_, i) => i && timers.current.push(window.setTimeout(() => setStage(i), step * i)))
    timers.current.push(window.setTimeout(() => setPhase('done'), step * STAGES.length))
  }
  const submit = (e: React.FormEvent) => { e.preventDefault(); const v = text.trim(); if (v) ask(pickPrompt(v), v) }

  const srcKey = HERO_PROMPTS.find((p) => p.id === promptId)?.sources ?? 'default'
  const active = SOURCES_FOR[srcKey] ?? SOURCES_FOR.default
  const answer = HERO_ANSWERS[promptId]

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__stage" ref={stageRef} data-ready={sceneReady ? '1' : '0'}>
        {webgl ? (
          <Suspense fallback={null}>
            <div className="hero__canvas" onAnimationStart={() => setSceneReady(true)}><HeroScene phase={phase} active={active} labelRefs={labels} calm={calm} paused={!visible} /></div>
          </Suspense>
        ) : <HeroFallback active={active} working={phase === 'working'} />}
        {webgl && (
          <div className="hero__labels" aria-hidden="true">
            {NET_NODES.map((n) => <span key={n.id} className={`nlabel nlabel--${n.kind}`} ref={(el) => { labels.current[n.id] = el }}><i />{n.label}</span>)}
          </div>
        )}
        <div className="hero__grid" aria-hidden="true" />
      </div>

      <div className="container hero__content">
        <div className="hero__copy">
          <span className="eyebrow hero__eyebrow">Enterprise AI · {`BCT Context`}</span>
          <h1 id="hero-title" className="display">Ask your business <em>anything.</em></h1>
          <p className="lede">Context is the AI layer for your organization. It connects to your databases, documents and systems, so anyone can ask a question and get an answer grounded in your own data.</p>

          <form className="ask" onSubmit={submit} aria-label="Try a sample question">
            <label htmlFor="ask-input" className="visually-hidden">Ask a sample question</label>
            <input id="ask-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Show me our sales performance for Q3." autoComplete="off" />
            <button type="submit" className="ask__go" aria-label="Ask">
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </form>
          <div className="chips" role="group" aria-label="Sample questions">
            {HERO_PROMPTS.map((p) => <button key={p.id} className="chip" onClick={() => ask(p.id)}>{p.text.replace(/\.$/, '')}</button>)}
          </div>
          <p className="hero__note">Simulation with sample data. See the <Link to="/product#demo" className="link">full interactive demo</Link>.</p>

          <div className="hero__ctas">
            <Button to="/contact" size="lg" arrow>Request a demo</Button>
            <Button to="/product" variant="ghost" size="lg">Explore the product</Button>
          </div>
        </div>

        <div ref={miniRef} className={`mini ${phase !== 'idle' ? 'mini--on' : ''}`} aria-live="polite">
          {phase === 'working' && (
            <div className="mini__stages">
              <span className="pulse" aria-hidden="true" />
              <span>{STAGES[stage]}…</span>
              <ol aria-hidden="true">{STAGES.map((_, i) => <li key={i} className={i <= stage ? 'on' : ''} />)}</ol>
            </div>
          )}
          {phase === 'done' && <div className="mini__answer" key={promptId}><MiniAnswer a={answer} /><span className="mini__tag">Sample data</span></div>}
        </div>
      </div>
    </section>
  )
}
