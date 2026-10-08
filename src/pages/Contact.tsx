import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { OfficeGlobe } from '../components/sections/OfficeGlobe'
import { useSeo } from '../hooks/useSeo'
import { SITE } from '../content/site'

const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) || '/api/contact'
type Status = 'idle' | 'sending' | 'sent' | 'unconfigured' | 'error'

export default function Contact() {
  useSeo({ title: 'Contact — Request a Demo', path: '/contact', description: 'Talk to Babji Consult Techies about enterprise AI systems. Request a demo of the BCT enterprise AI assistant.' })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = Object.fromEntries(f.entries()) as Record<string, string>
    const er: Record<string, string> = {}
    if (!v.name?.trim()) er.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(v.email ?? '')) er.email = 'Please enter a valid email address.'
    if (!v.message?.trim()) er.message = 'Tell us a little about what you want to solve.'
    setErrors(er)
    if (Object.keys(er).length) { (e.currentTarget.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus(); return }
    setStatus('sending')
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(v) })
      setStatus(r.ok ? 'sent' : r.status === 503 ? 'unconfigured' : 'error')
    } catch { setStatus('error') }
  }

  const { email, phone, linkedin } = SITE.contact
  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, optional = false) => (
    <div className={`field ${errors[name] ? 'field--err' : ''}`}>
      <label htmlFor={name}>{label}{optional && <small> optional</small>}</label>
      <input id={name} name={name} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-e` : undefined} {...props} />
      {errors[name] && <p id={`${name}-e`} className="field__e">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="page">
      <PageHeader eyebrow="BCT / CONTACT" title={<>Let’s build something <em>intelligent.</em></>}
        lede="Tell us what your team spends time looking for. We’ll show you what it looks like when the organization can answer back." />
      <OfficeGlobe />
      <section className="section contact" id="request">
        <div className="container contact__grid">
          <Reveal className="contact__aside">
            <h2>What happens next</h2>
            <ol className="next">
              <li><b>We read your note.</b> <span className="muted">And come prepared with questions about your data and workflows.</span></li>
              <li><b>We talk it through.</b> <span className="muted">A business conversation, not a sales script.</span></li>
              <li><b>We show you.</b> <span className="muted">A demo shaped around how your organization works.</span></li>
            </ol>
            {(email || phone || linkedin) && (
              <ul className="direct">
                {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
                {phone && <li><a href={`tel:${phone}`}>{phone}</a></li>}
                {linkedin && <li><a href={linkedin} rel="noopener noreferrer">LinkedIn</a></li>}
              </ul>
            )}
          </Reveal>

          <Reveal className="contact__form" delay={1}>
            {status === 'sent' ? (
              <div className="notice notice--ok" role="status"><h2 className="display">Thank you.</h2><p>Your message is with us. We’ll be in touch.</p></div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="row">{field('name', 'Name', { autoComplete: 'name', required: true })}{field('company', 'Company', { autoComplete: 'organization' }, true)}</div>
                <div className="row">{field('email', 'Email', { type: 'email', autoComplete: 'email', required: true })}{field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' }, true)}</div>
                <div className={`field ${errors.message ? 'field--err' : ''}`}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-e' : undefined} />
                  {errors.message && <p id="message-e" className="field__e">{errors.message}</p>}
                </div>
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
                <Button type="submit" size="lg" arrow disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Start the conversation'}</Button>
                <div role="status" aria-live="polite">
                  {status === 'error' && <p className="notice notice--err">Something went wrong sending that. Please try again.</p>}
                  {status === 'unconfigured' && <p className="notice notice--warn">This form isn’t connected to a mailbox yet, so nothing was sent. Please email us directly instead.</p>}
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
