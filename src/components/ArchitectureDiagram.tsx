import { useState } from 'react'

type Id = 'users' | 'conv' | 'agents' | 'memory' | 'rag' | 'databases' | 'documents' | 'apis' | 'analysis' | 'answers' | 'charts' | 'reports'
type N = { id: Id; x: number; y: number; w: number; title: string; sub?: string; tone: 'warm' | 'cool' | 'ink'; chain: Id[]; caption: string; layer: string }

const SPINE: Id[] = ['users', 'conv', 'agents', 'rag']
const N_: N[] = [
  { id: 'users', x: 450, y: 34, w: 280, title: 'People', sub: 'Employees · managers · leadership', tone: 'warm', layer: 'Users', chain: ['users', 'conv', 'agents', 'memory'], caption: 'Anyone asks in plain language. No query syntax, no dashboard to find.' },
  { id: 'conv', x: 450, y: 118, w: 260, title: 'Conversational layer', sub: 'Natural-language interface', tone: 'warm', layer: 'Interface', chain: ['users', 'conv', 'agents', 'memory'], caption: 'One simple surface on top. The complexity stays underneath.' },
  { id: 'agents', x: 240, y: 214, w: 260, title: 'Intent & agents', sub: 'Understand · plan · choose tools', tone: 'ink', layer: 'Reasoning', chain: ['users', 'conv', 'agents', 'rag', 'databases', 'documents', 'apis'], caption: 'The assistant works out what you mean, plans the steps, and decides which tools and data sources to use.' },
  { id: 'memory', x: 660, y: 214, w: 260, title: 'Contextual memory', sub: 'Semantic · episodic', tone: 'ink', layer: 'Reasoning', chain: ['users', 'conv', 'memory', 'rag'], caption: 'Relevant context from you, your role and past conversations makes each answer more personal and more useful.' },
  { id: 'rag', x: 450, y: 312, w: 280, title: 'Knowledge & retrieval (RAG)', sub: 'Retrieve before answering', tone: 'cool', layer: 'Knowledge', chain: [...SPINE, 'databases', 'documents', 'apis', 'memory'], caption: 'Relevant material is retrieved from trusted organizational sources first, so answers stay grounded.' },
  { id: 'databases', x: 160, y: 418, w: 220, title: 'Databases', sub: 'SQL · Oracle · MongoDB', tone: 'cool', layer: 'Sources', chain: [...SPINE, 'databases', 'analysis', 'charts'], caption: 'Database → retrieval → AI → insight. Ask in words; the assistant queries the data for you.' },
  { id: 'documents', x: 450, y: 418, w: 220, title: 'Documents', sub: 'PDFs · images · knowledge', tone: 'cool', layer: 'Sources', chain: [...SPINE, 'documents', 'analysis', 'answers'], caption: 'Documents → RAG → context → answer. Your own files become part of what the assistant knows.' },
  { id: 'apis', x: 740, y: 418, w: 220, title: 'APIs & systems', sub: 'Enterprise tools', tone: 'cool', layer: 'Sources', chain: [...SPINE, 'apis', 'analysis', 'reports'], caption: 'Connected business systems can be queried and, where configured, acted on.' },
  { id: 'analysis', x: 450, y: 520, w: 280, title: 'Analysis & insight', sub: 'Compare · trend · explain', tone: 'ink', layer: 'Analysis', chain: ['databases', 'documents', 'apis', 'analysis', 'answers', 'charts', 'reports'], caption: 'Results are analyzed, trends are found, and the answer is shaped for the person asking.' },
  { id: 'answers', x: 160, y: 622, w: 190, title: 'Answers', tone: 'warm', layer: 'Outputs', chain: ['documents', 'rag', 'analysis', 'answers'], caption: 'Clear, grounded answers in your organization’s language.' },
  { id: 'charts', x: 450, y: 622, w: 190, title: 'Charts', tone: 'warm', layer: 'Outputs', chain: ['databases', 'rag', 'analysis', 'charts'], caption: 'Visualizations generated on demand from the data.' },
  { id: 'reports', x: 740, y: 622, w: 190, title: 'Reports', tone: 'warm', layer: 'Outputs', chain: ['apis', 'rag', 'analysis', 'reports'], caption: 'Structured reports and files such as Excel and PDF.' },
]
const EDGES: [Id, Id][] = [
  ['users', 'conv'], ['conv', 'agents'], ['conv', 'memory'], ['agents', 'rag'], ['memory', 'rag'],
  ['rag', 'databases'], ['rag', 'documents'], ['rag', 'apis'],
  ['databases', 'analysis'], ['documents', 'analysis'], ['apis', 'analysis'],
  ['analysis', 'answers'], ['analysis', 'charts'], ['analysis', 'reports'],
]
const byId = Object.fromEntries(N_.map((n) => [n.id, n])) as Record<Id, N>
const H = 52
const path = (a: Id, b: Id) => {
  const A = byId[a], B = byId[b]
  const x1 = A.x, y1 = A.y + H / 2, x2 = B.x, y2 = B.y - H / 2, m = (y1 + y2) / 2
  return `M${x1},${y1} C${x1},${m} ${x2},${m} ${x2},${y2}`
}

export function ArchitectureDiagram() {
  const [sel, setSel] = useState<Id | null>(null)
  const [pin, setPin] = useState<Id | null>(null)
  const cur = sel ?? pin
  const set = new Set<Id>(cur ? byId[cur].chain : [])
  const node = cur ? byId[cur] : null
  const on = (id: Id | null) => ({ onPointerEnter: () => setSel(id), onPointerLeave: () => setSel(null), onFocus: () => setSel(id), onBlur: () => setSel(null) })

  return (
    <div className="arch">
      <div className="arch__svgwrap">
        <svg viewBox="0 0 900 680" role="group" aria-label="System architecture. Select any element to trace its path." className="arch__svg" data-active={cur ? '1' : '0'}>
          {EDGES.map(([a, b]) => {
            const hot = cur && set.has(a) && set.has(b)
            return <path key={a + b} d={path(a, b)} className={`arch__edge ${hot ? 'hot' : ''}`} />
          })}
          {N_.map((n) => (
            <g key={n.id} className={`arch__node arch__node--${n.tone} ${cur ? (set.has(n.id) ? 'hot' : 'dim') : ''} ${cur === n.id ? 'self' : ''}`}
              transform={`translate(${n.x - n.w / 2} ${n.y - H / 2})`} tabIndex={0} role="button" aria-pressed={pin === n.id}
              aria-label={`${n.title}. ${n.caption}`}
              onClick={() => setPin(pin === n.id ? null : n.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPin(pin === n.id ? null : n.id) } }}
              {...on(n.id)}>
              <rect width={n.w} height={H} rx="6" />
              <text x={n.w / 2} y={n.sub ? 22 : 31} textAnchor="middle" className="arch__t">{n.title}</text>
              {n.sub && <text x={n.w / 2} y={40} textAnchor="middle" className="arch__s">{n.sub}</text>}
            </g>
          ))}
        </svg>
      </div>

      {/* small screens: same system as a readable stack */}
      <ol className="arch__stack">
        {['Users', 'Interface', 'Reasoning', 'Knowledge', 'Sources', 'Analysis', 'Outputs'].map((layer) => (
          <li key={layer}>
            <span className="eyebrow">{layer}</span>
            <div>{N_.filter((n) => n.layer === layer).map((n) => (
              <button key={n.id} className={`chip chip--${n.tone}`} aria-pressed={pin === n.id} onClick={() => setPin(pin === n.id ? null : n.id)}>{n.title}</button>
            ))}</div>
          </li>
        ))}
      </ol>

      <div className="arch__caption" role="status" aria-live="polite">
        {node ? (<><b>{node.title}</b><p>{node.caption}</p></>) : (<p className="muted">Hover, focus or tap any element to trace how a question travels through the system.</p>)}
      </div>
    </div>
  )
}
