// Illustrative scenarios for the marketing demo. All figures are SAMPLE DATA, not real results.
export type Mode = 'quick' | 'analyze' | 'deep'
export type SourceId = 'sql' | 'oracle' | 'mongo' | 'docs' | 'crm' | 'org'

export const SOURCES: { id: SourceId; label: string; kind: string }[] = [
  { id: 'sql', label: 'Sales database', kind: 'SQL' },
  { id: 'oracle', label: 'Finance ledger', kind: 'Oracle' },
  { id: 'mongo', label: 'Operations records', kind: 'MongoDB' },
  { id: 'crm', label: 'Customer CRM', kind: 'CRM' },
  { id: 'docs', label: 'Policies & handbooks', kind: 'Documents' },
  { id: 'org', label: 'Org directory', kind: 'Directory' },
]

export const MODES: Record<Mode, { label: string; blurb: string; depth: number }> = {
  quick: { label: 'Quick answer', blurb: 'A direct lookup. No heavy analysis needed.', depth: 1 },
  analyze: { label: 'Analyze', blurb: 'Pulls data, compares, finds the pattern.', depth: 2 },
  deep: { label: 'Deep report', blurb: 'Multi-source reasoning with structured output.', depth: 3 },
}

export type Region = { name: string; rev: number; qoq: number; target: number }
export const REGIONS: Region[] = [
  { name: 'North', rev: 2.4, qoq: 4, target: 2.3 },
  { name: 'West', rev: 1.8, qoq: 18, target: 1.6 },
  { name: 'South', rev: 1.2, qoq: 2, target: 1.5 },
  { name: 'East', rev: 0.9, qoq: -7, target: 1.4 },
]

export type Result =
  | { type: 'regions' }
  | { type: 'underperf' }
  | { type: 'month' }
  | { type: 'person' }
  | { type: 'process' }
  | { type: 'report' }
  | { type: 'change' }

export type Scenario = {
  id: string
  prompt: string
  short: string
  keywords: string[]
  mode: Mode
  sources: SourceId[]
  stages: string[]
  result: Result
  followUps: string[]
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'regions', prompt: 'Show me sales performance by region.', short: 'Sales by region',
    keywords: ['sales', 'region', 'revenue', 'compare', 'performance'], mode: 'analyze', sources: ['sql', 'oracle'],
    stages: ['Understanding the question', 'Retrieving sales and finance data', 'Analyzing regional performance', 'Identifying trends', 'Generating visualization'],
    result: { type: 'regions' }, followUps: ['Which regions are underperforming this quarter?', 'What changed compared to last quarter?'],
  },
  {
    id: 'underperf', prompt: 'Which regions are underperforming this quarter?', short: 'Underperforming regions',
    keywords: ['underperform', 'under', 'behind', 'target', 'weak', 'worst', 'missing'], mode: 'analyze', sources: ['sql', 'crm', 'oracle'],
    stages: ['Understanding the question', 'Retrieving revenue and targets', 'Comparing actuals to plan', 'Flagging gaps', 'Generating visualization'],
    result: { type: 'underperf' }, followUps: ['What changed compared to last quarter?', 'Generate a quarterly report.'],
  },
  {
    id: 'month', prompt: "Summarize this month's business performance.", short: 'Monthly summary',
    keywords: ['summarize', 'summary', 'month', 'monthly', 'overview', 'business'], mode: 'analyze', sources: ['sql', 'oracle', 'mongo', 'crm'],
    stages: ['Understanding the question', 'Retrieving data from four systems', 'Analyzing the month', 'Writing the summary'],
    result: { type: 'month' }, followUps: ['Show me sales performance by region.', 'Generate a quarterly report.'],
  },
  {
    id: 'person', prompt: 'Who manages the operations department?', short: 'Who manages operations',
    keywords: ['who', 'manages', 'manager', 'operations', 'department', 'head', 'reports to'], mode: 'quick', sources: ['org'],
    stages: ['Understanding the question', 'Checking the org directory'],
    result: { type: 'person' }, followUps: ['Explain our employee onboarding process.'],
  },
  {
    id: 'process', prompt: 'Explain our employee onboarding process.', short: 'Onboarding process',
    keywords: ['onboarding', 'onboard', 'process', 'new', 'joiner', 'employee', 'policy', 'norms'], mode: 'quick', sources: ['docs', 'org'],
    stages: ['Understanding the question', 'Searching company documents', 'Grounding the answer in sources'],
    result: { type: 'process' }, followUps: ['Who manages the operations department?'],
  },
  {
    id: 'report', prompt: 'Generate a quarterly report.', short: 'Quarterly report',
    keywords: ['report', 'quarterly', 'generate', 'pdf', 'excel', 'export', 'download'], mode: 'deep', sources: ['sql', 'oracle', 'mongo', 'crm', 'docs'],
    stages: ['Understanding the request', 'Retrieving data from five sources', 'Analyzing the quarter', 'Identifying trends and risks', 'Structuring the report', 'Generating charts and files'],
    result: { type: 'report' }, followUps: ['What changed compared to last quarter?'],
  },
  {
    id: 'change', prompt: 'What changed compared to last quarter?', short: 'Change vs last quarter',
    keywords: ['changed', 'change', 'last', 'previous', 'versus', 'vs', 'quarter', 'difference'], mode: 'analyze', sources: ['sql', 'oracle'],
    stages: ['Understanding the question', 'Retrieving two quarters of data', 'Comparing periods', 'Generating visualization'],
    result: { type: 'change' }, followUps: ['Which regions are underperforming this quarter?', 'Generate a quarterly report.'],
  },
]

export function matchScenario(text: string): Scenario | null {
  const t = text.toLowerCase()
  let best: Scenario | null = null, score = 0
  for (const s of SCENARIOS) {
    const sc = s.keywords.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0)
    if (sc > score) { score = sc; best = s }
  }
  return best
}
