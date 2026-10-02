import { useScrollProgress } from '../../hooks/useMotion'

const TOOLS = [
  ['Excel', 12, 18], ['Dashboard', 70, 12], ['SQL console', 40, 30], ['PDF report', 84, 38], ['CRM', 20, 52],
  ['Wiki', 62, 58], ['Email thread', 8, 76], ['Shared drive', 44, 80], ['Internal portal', 78, 74],
] as const

/** Scroll-driven: nine tools collapse into one question. Progress is written to --p without re-rendering. */
export function ProblemShift() {
  const ref = useScrollProgress<HTMLElement>('--p')
  return (
    <section className="shift" ref={ref} aria-labelledby="shift-title">
      <div className="shift__pin">
        <div className="shift__copy">
          <span className="eyebrow">The problem · the shift</span>
          <div className="shift__swap">
            <h2 id="shift-title" className="display shift__a">To answer one question, your people open <em>nine tabs.</em></h2>
            <p className="display shift__b" aria-hidden="false">Now they <em>just ask.</em></p>
          </div>
          <p className="lede shift__lede">Databases, dashboards, spreadsheets, reports, documents, internal systems. The answer exists. Finding it is the job.</p>
        </div>
        <div className="shift__stage" aria-hidden="true">
          {TOOLS.map(([t, x, y], i) => (
            <span key={t} className="shift__chip" style={{ '--lx': x, '--ly': y, '--d': `${i * 0.35}s` } as React.CSSProperties}>{t}</span>
          ))}
          <div className="shift__ask"><span className="shift__caret" />Which regions are underperforming?</div>
        </div>
      </div>
    </section>
  )
}
