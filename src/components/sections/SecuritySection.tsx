import { useState } from 'react'
import { SectionHeading } from '../SectionHeading'

const ROLES = [
  { id: 'staff', label: 'Team member', ans: ['Your team’s own figures are available.', 'Payroll and compensation data is outside your access.'], state: 'limited' },
  { id: 'mgr', label: 'Department manager', ans: ['Headcount and payroll totals for your department.', 'Other departments are outside your access.'], state: 'scoped' },
  { id: 'hr', label: 'HR lead', ans: ['Payroll by team across the organization.', 'Full access, as granted to the role.'], state: 'full' },
] as const

const PRINCIPLES = [
  ['Controlled access', 'People only retrieve what their role allows.'],
  ['Data boundaries', 'Your information stays within the boundaries you define.'],
  ['Permission-aware intelligence', 'The same question can return different answers to different people.'],
  ['Organization-controlled information', 'You decide what the assistant can see, and where.'],
] as const

export function SecuritySection({ id = 'security' }: { id?: string }) {
  const [r, setR] = useState(0)
  const role = ROLES[r]
  return (
    <section className="section" id={id} aria-labelledby="sec-title">
      <div className="container">
        <SectionHeading eyebrow="Security" title={<span id="sec-title">Security is part of the architecture, <em>not an afterthought.</em></span>} lede="An assistant that knows your business has to respect your boundaries. Access control is built into how information is retrieved, not bolted on afterwards." />
        <div className="sec">
          <div className="sec__demo">
            <p className="side__h">Same question: “Show me payroll by team.”</p>
            <div className="seg" role="radiogroup" aria-label="Viewing as">
              {ROLES.map((x, n) => (
                <button key={x.id} role="radio" aria-checked={r === n} className={r === n ? 'on' : ''} onClick={() => setR(n)}>{x.label}</button>
              ))}
            </div>
            <div className={`sec__ans sec__ans--${role.state}`} key={role.id} aria-live="polite">
              <span className="lock" aria-hidden="true" />
              <div>{role.ans.map((l) => <p key={l}>{l}</p>)}</div>
            </div>
            <small className="muted">Illustrative. Actual permissions follow your organization’s own access rules.</small>
          </div>
          <ul className="sec__list">
            {PRINCIPLES.map(([t, d]) => <li key={t}><h3>{t}</h3><p className="muted">{d}</p></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
