import { PageHeader } from '../components/PageHeader'
import { RoleCube } from '../components/sections/RoleCube'
import { LessMore } from '../components/sections/LessMore'
import { CTASection } from '../components/CTASection'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ProblemShift } from '../components/sections/ProblemShift'
import { useSeo } from '../hooks/useSeo'

const CASES = [
  ['Onboarding and internal knowledge', 'Explain our employee onboarding process.', 'New joiners get accurate answers about processes, people and norms without waiting on a colleague.'],
  ['Business performance questions', 'How did our sales perform across regions last quarter?', 'Managers ask directly and see charts and trends, instead of requesting a report and waiting.'],
  ['Data access without SQL', 'List open orders over 30 days by customer.', 'People query SQL, Oracle or MongoDB data in natural language, within their permissions.'],
  ['Process and policy lookup', 'What is the approval path for a vendor contract?', 'Answers are retrieved from your own policy documents, with the source attached.'],
  ['Reporting on demand', 'Generate a quarterly report.', 'A structured report with charts, delivered as an Excel spreadsheet or a PDF.'],
  ['Leadership decision support', 'Where are we most exposed this quarter?', 'From business question to data to insight to decision, in one conversation.'],
] as const

export default function Solutions() {
  useSeo({ title: 'Solutions & Use Cases', path: '/solutions', description: 'How employees, managers and leadership use an enterprise AI assistant: onboarding, business questions, data analysis, reporting and decision support.' })
  return (
    <div className="page">
      <PageHeader eyebrow="BCT / SOLUTIONS" title={<>One assistant. <em>Every level of the organization.</em></>}
        lede="Context is not a tool for executives alone. It gives new joiners, teams, managers and leadership the same thing: a direct way to ask the organization a question." />
      <ProblemShift />
      <RoleCube />
      <section className="section" aria-labelledby="uc-title">
        <div className="container">
          <SectionHeading eyebrow="Use cases" title={<span id="uc-title">What people <em>ask.</em></span>} lede="Examples of questions, and what changes when they can be answered in seconds." />
          <ul className="cases">
            {CASES.map(([t, q, o], i) => (
              <Reveal as="li" key={t} delay={i % 2} className="case">
                <span className="mono case__n">0{i + 1}</span>
                <div><h3>{t}</h3><p className="case__q">“{q}”</p><p className="muted">{o}</p></div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <LessMore />
      <CTASection variant="split" title={<>Tell us the question your team asks <em>every week.</em></>} body="We will show you what it looks like when the organization can answer it." />
    </div>
  )
}
