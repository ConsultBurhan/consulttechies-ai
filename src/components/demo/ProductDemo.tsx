import { useEffect, useRef, useState } from 'react'
import { MODES, SCENARIOS, SOURCES, matchScenario, type Mode, type Scenario } from './scenarios'
import { ResultView } from './Results'
import { usePrefersReducedMotion } from '../../hooks/useMotion'

type Turn = { s: Scenario; stage: number; done: boolean }

export function ProductDemo({ compact = false }: { compact?: boolean }) {
  const calm = usePrefersReducedMotion()
  const [turn, setTurn] = useState<Turn | null>(null)
  const [text, setText] = useState('')
  const [miss, setMiss] = useState(false)
  const [seen, setSeen] = useState<Scenario[]>([])
  const timer = useRef<number | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const run = (s: Scenario) => {
    if (timer.current) clearTimeout(timer.current)
    setMiss(false); setText(''); setTurn({ s, stage: 0, done: false })
    setSeen((p) => (p.includes(s) ? p : [...p, s]))
    const per = calm ? 200 : s.mode === 'quick' ? 520 : s.mode === 'deep' ? 820 : 720
    let i = 0
    const tick = () => {
      i++
      if (i >= s.stages.length) { setTurn({ s, stage: s.stages.length, done: true }); return }
      setTurn({ s, stage: i, done: false }); timer.current = window.setTimeout(tick, per)
    }
    timer.current = window.setTimeout(tick, per)
  }
  useEffect(() => { if (turn?.done) scroller.current?.scrollTo({ top: 0 }) }, [turn?.done])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const m = matchScenario(text)
    if (m) run(m); else if (text.trim()) setMiss(true)
  }

  const mode: Mode | null = turn?.s.mode ?? null
  const usedSources = turn && !turn.done ? turn.s.sources.slice(0, Math.max(0, turn.stage)) : turn?.s.sources ?? []

  return (
    <div className={`app ${compact ? 'app--compact' : ''}`} role="region" aria-label="Interactive product demonstration">
      <div className="app__bar">
        <div className="app__title"><span className="app__dot" /> BCT Context</div>
        <div className="modes" role="group" aria-label="Task mode, chosen automatically">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <span key={m} className="mode" aria-current={mode === m ? 'true' : undefined} title={MODES[m].blurb}>
              <span className="mode__bars" aria-hidden="true">{[1, 2, 3].map((n) => <i key={n} className={n <= MODES[m].depth ? 'on' : ''} />)}</span>{MODES[m].label}
            </span>
          ))}
        </div>
        <span className="app__sim">Simulation · sample data</span>
      </div>

      <div className="app__body">
        <aside className="app__side" aria-label="Connected sources and memory">
          <p className="side__h">Connected sources</p>
          <ul>
            {SOURCES.map((s) => <li key={s.id} className={usedSources.includes(s.id) ? 'live' : ''}><i /> <span>{s.label}</span><em>{s.kind}</em></li>)}
          </ul>
          <p className="side__h">Remembers about you</p>
          <ul className="memory">
            <li>Role: regional manager</li>
            <li>Prefers quarterly views</li>
            {seen.slice(-2).map((s) => <li key={s.id} className="memory--new">Asked: {s.short.toLowerCase()}</li>)}
          </ul>
        </aside>

        <div className="app__main">
          <div className="thread" ref={scroller} aria-live="polite">
            {!turn && (
              <div className="thread__empty">
                <p className="display">What would you like to know?</p>
                <p className="muted">Pick a question below, or type one. This is a simulation — it answers six sample questions with illustrative data.</p>
              </div>
            )}
            {turn && (
              <>
                <div className="msg msg--user"><p>{turn.s.prompt}</p></div>
                <div className="msg msg--ai">
                  {turn.done ? (
                    <p className="stages-done"><span className="stages__mark stages__mark--done" aria-hidden="true" />
                      Analyzed {turn.s.sources.length} {turn.s.sources.length === 1 ? 'source' : 'sources'} in {turn.s.stages.length} steps · {MODES[turn.s.mode].label.toLowerCase()} mode</p>
                  ) : (
                  <ol className="stages" aria-label="Progress">
                    {turn.s.stages.map((st, i) => {
                      const state = i < turn.stage ? 'done' : i === turn.stage ? 'now' : 'todo'
                      return <li key={st} data-state={state}><span className="stages__mark" aria-hidden="true" />{st}{state === 'now' ? '…' : ''}</li>
                    })}
                  </ol>
                  )}
                  {turn.done && (
                    <div className="result" key={turn.s.id}>
                      <ResultView result={turn.s.result} />
                      <div className="followups">
                        <span className="insight__label">Suggested follow-ups</span>
                        {turn.s.followUps.map((f) => { const t = SCENARIOS.find((x) => x.prompt === f); return t && <button key={f} className="chip" onClick={() => run(t)}>{f}</button> })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="composer">
            <div className="chips" role="group" aria-label="Sample questions">
              {SCENARIOS.map((s) => <button key={s.id} className="chip" aria-pressed={turn?.s.id === s.id} onClick={() => run(s)}>{s.prompt.replace(/\.$/, '')}</button>)}
            </div>
            <form className="ask ask--app" onSubmit={submit}>
              <label className="visually-hidden" htmlFor={`demo-in-${compact}`}>Ask a question</label>
              <input id={`demo-in-${compact}`} value={text} onChange={(e) => { setText(e.target.value); setMiss(false) }} placeholder="Ask about sales, people, processes, reports…" autoComplete="off" />
              <button className="ask__go" type="submit" aria-label="Ask"><svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </form>
            {miss && <p className="srcline" role="status">This simulation only knows the sample questions above. The real assistant answers from your own data.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
