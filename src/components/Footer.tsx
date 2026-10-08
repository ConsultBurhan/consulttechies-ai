import { Link } from 'react-router-dom'
import { NAV, SERVICES, SITE } from '../content/site'
import { BrandLockup } from './Navigation'
import { ThemeToggle } from './ThemeToggle'

export function Footer() {
  const { email, phone, linkedin } = SITE.contact
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__about">
          <BrandLockup />
          <p className="muted">An AI company founded in {SITE.founded}, building AI systems for businesses that want to work differently.</p>
        </div>
        <nav aria-label="Footer: explore"><h2 className="footer__h">Explore</h2>
          <ul>{NAV.map((n) => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}</ul></nav>
        <div><h2 className="footer__h">Capabilities</h2>
          <ul>{SERVICES.map((s) => <li key={s.title}><Link to="/product">{s.title}</Link></li>)}</ul></div>
        <div className="footer__contact"><h2 className="footer__h">Contact</h2>
          <ul>
            <li><Link to="/contact">Request a demo</Link></li>
            {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
            {phone && <li><a href={`tel:${phone}`}>{phone.replace(/^(\+91)(\d{5})(\d{5})$/, '$1 $2 $3')}</a></li>}
            {linkedin && <li><a href={linkedin} rel="noopener noreferrer">LinkedIn</a></li>}
          </ul></div>
      </div>
      <div className="container footer__offices">
        {SITE.offices.map((o) => (
          <address key={o.name} className="office glass-card">
            <span className="eyebrow">{o.name} · {o.country}</span>
            <p>{o.lines.map((l, i) => <span key={i}>{l}</span>)}</p>
          </address>
        ))}
      </div>
      <div className="container footer__base">
        <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
        <span className="footer__legal"><a href="/privacy" onClick={(e) => e.preventDefault()} aria-disabled="true">Privacy policy — to be provided</a></span>
        <span className="footer__theme">Theme <ThemeToggle /></span>
      </div>
    </footer>
  )
}
