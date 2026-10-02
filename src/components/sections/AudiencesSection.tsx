import { PinnedStory, type PinStep } from '../PinnedStory'

export const AUDIENCES = [
  { id: 'new', label: 'New employees', q: 'What process should I follow to request equipment?', line: 'Find their feet faster.', points: ['How does our organization work?', 'Who manages this department?', 'What are the business norms?'], flow: null },
  { id: 'emp', label: 'Employees', q: 'Pull last month’s ticket volume and draft a summary.', line: 'Get answers without the hunt.', points: ['Retrieve information instantly', 'Understand processes step by step', 'Analyze business information', 'Generate reports'], flow: null },
  { id: 'mgr', label: 'Managers', q: 'How is my team’s pipeline trending against last quarter?', line: 'See performance, not spreadsheets.', points: ['Ask business questions directly', 'Analyze performance and spot trends', 'Generate structured insights', 'Create visual reports'], flow: null },
  { id: 'lead', label: 'Leadership', q: 'Where are we most exposed this quarter?', line: 'From question to decision.', points: ['Ask the question', 'See the data behind it', 'Get the insight', 'Make the call'], flow: ['Business question', 'Data', 'Insight', 'Decision'] },
] as const

export function AudiencesSection() {
  const steps: PinStep[] = AUDIENCES.map((a) => ({
    id: `aud-${a.id}`, label: a.label, title: a.line,
    vis: (
      <div className="au-card glass-card">
        <div className="msg msg--user"><p>{a.q}</p></div>
        {a.flow ? <ol className="chain">{a.flow.map((f) => <li key={f}>{f}</li>)}</ol> : <ul className="ticks">{a.points.map((p) => <li key={p}>{p}</li>)}</ul>}
      </div>
    ),
  }))
  return <PinnedStory id="value-story" label="Value for everyone" eyebrow="03 / VALUE FOR EVERYONE" title={<span>Not just for executives. <em>For the whole organization.</em></span>} lede="Everyone has questions about the business. Context gives each person the answer that fits their role." steps={steps} dwell={0.7} center />
}
