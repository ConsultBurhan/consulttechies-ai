// Illustrative history + a transparent trend model. SAMPLE DATA: a demonstration of the idea,
// not a claim about how any production forecasting engine works.
export const QUARTERS = ['Q4 23', 'Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26']
export const FUTURE = ['Q4 26', 'Q1 27', 'Q2 27', 'Q3 27']
export const REVENUE = [4.1, 4.4, 4.3, 4.8, 5.1, 4.9, 5.4, 5.7, 5.9, 5.8, 6.1, 6.3]

export type ScenarioId = 'cautious' | 'baseline' | 'ambitious'
export const SCENARIOS: Record<ScenarioId, { label: string; blurb: string; k: number }> = {
  cautious: { label: 'Cautious', blurb: 'growth slows to a third of the recent trend', k: 0.35 },
  baseline: { label: 'Baseline', blurb: 'the recent trend continues', k: 1 },
  ambitious: { label: 'Ambitious', blurb: 'the trend accelerates by half', k: 1.5 },
}

/** compound the average log-growth of the last 8 quarters; widen the range with historical volatility */
export function project(scenario: ScenarioId) {
  const logs = REVENUE.map(Math.log)
  const rets = logs.slice(1).map((v, i) => v - logs[i]).slice(-8)
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const sd = Math.sqrt(rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length)
  const drift = mean * SCENARIOS[scenario].k
  const last = REVENUE[REVENUE.length - 1]
  return {
    drift,
    points: FUTURE.map((label, i) => {
      const t = i + 1, mid = last * Math.exp(drift * t), spread = (sd * 1.15 + 0.004) * Math.sqrt(t) * 1.28
      return { label, mid, lo: mid * Math.exp(-spread), hi: mid * Math.exp(spread) }
    }),
  }
}
