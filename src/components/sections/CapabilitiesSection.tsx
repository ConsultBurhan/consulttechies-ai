import { PinnedStory, type PinStep } from '../PinnedStory'
import { AnalyzeViz } from './AnalyzeSection'
import { ForecastPanel } from '../forecast'
import { ReportResult } from '../demo/Results'

const FLOW = ['Company knowledge', 'Retrieval', 'Context', 'AI', 'Answer']

function Understand() {
  return (
    <div className="cap-vis glass-card">
      <ol className="kfs mono" aria-label="Retrieval flow">{FLOW.map((f) => <li key={f}>{f}</li>)}</ol>
      <p className="quote">“Contractors need manager approval before system access is granted. Requests go through the IT service desk.”</p>
      <div className="cites"><span className="cite"><i>1</i>Access policy.pdf · p. 4</span><span className="cite"><i>2</i>Onboarding checklist.docx</span></div>
      <small className="muted">Illustrative sourced answer. Documents, images and other business content become part of the knowledge base.</small>
    </div>
  )
}
function Adapt() {
  return (
    <div className="cap-vis cap-vis--two">
      <div className="glass-card"><span className="eyebrow">Generic assistant</span><p className="muted">“P2 could refer to many things. Could you tell me more about your approval process?”</p></div>
      <div className="glass-card adapted"><span className="eyebrow">Adapted to your organization</span><p>“Under your exceptions policy, P2 deviations need department-head approval, logged within one working day.”</p></div>
      <small className="muted">Illustrative. It learns your terminology, rules, workflows and tone, and remembers context across conversations.</small>
    </div>
  )
}

const STEPS: PinStep[] = [
  { id: 'understand', label: 'Understand', title: 'Answers grounded in your own material.', body: 'Ask in plain language. Context retrieves from your trusted documents and databases first, then answers with its sources.', vis: <Understand /> },
  { id: 'analyze', label: 'Analyze', title: 'Business data, turned into insight.', body: 'Comparisons, trends and explanations across SQL, Oracle, MongoDB and other organizational data, without writing a query.', vis: <div className="glass-card"><AnalyzeViz /></div> },
  { id: 'predict', label: 'Predict', title: 'See what could happen next.', body: 'From historical data it identifies patterns and estimates potential outcomes, so teams can plan ahead. Estimates, not guarantees.', vis: <div className="glass-card"><ForecastPanel /></div> },
  { id: 'report', label: 'Report', title: 'From question to deliverable.', body: 'Analysis becomes a structured report with charts, as an Excel spreadsheet or a PDF.', vis: <ReportResult /> },
  { id: 'adapt', label: 'Adapt', title: 'Built around how you work.', body: 'Your terminology, business rules and workflows. Semantic and episodic memory keep every interaction relevant.', vis: <Adapt /> },
]

/** Key capabilities: scroll walks through them while the viewport stays pinned. */
export function CapabilitiesSection() {
  return <PinnedStory id="capabilities" label="Capabilities" eyebrow="02 / CAPABILITIES" title={<span>One layer. <em>Five things it does well.</em></span>} steps={STEPS} variant="deck" dwell={0.75} />
}
