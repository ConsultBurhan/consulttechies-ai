// Illustrative answers for the hero's miniature product moment. Sample data — not real figures.
export type HeroAnswer =
  | { kind: 'bars'; title: string; unit: string; rows: { label: string; value: number }[]; insight: string }
  | { kind: 'person'; title: string; name: string; role: string; line: string }
  | { kind: 'steps'; title: string; steps: string[] }

export const HERO_PROMPTS = [
  { id: 'sales', chip: 'Q3 sales performance', text: 'Show me our sales performance for Q3.', sources: 'sales' },
  { id: 'ops', chip: 'Who runs operations?', text: 'Who manages the operations department?', sources: 'people' },
  { id: 'onboard', chip: 'Onboarding process', text: 'Explain our onboarding process.', sources: 'people' },
] as const

export const HERO_ANSWERS: Record<string, HeroAnswer> = {
  sales: {
    kind: 'bars', title: 'Q3 revenue by region', unit: 'M',
    rows: [{ label: 'North', value: 2.4 }, { label: 'West', value: 1.8 }, { label: 'South', value: 1.2 }, { label: 'East', value: 0.9 }],
    insight: 'West is up 18% on Q2. East is down 7%.',
  },
  ops: { kind: 'person', title: 'Operations', name: 'Department lead', role: 'Operations', line: 'Pulled from your org chart and HR records, within what you are allowed to see.' },
  onboard: { kind: 'steps', title: 'Onboarding, as your company does it', steps: ['Accounts and access', 'Meet your department', 'Policies and norms', 'First-30-days plan'] },
}

export function pickPrompt(text: string): string {
  const t = text.toLowerCase()
  if (/(who|manage|head|lead|team|department)/.test(t)) return 'ops'
  if (/(onboard|process|join|new hire|policy|how do)/.test(t)) return 'onboard'
  return 'sales'
}
