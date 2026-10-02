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
          <p className="muted">An IT solutions company founded in {SITE.founded}, building web, application, CRM and enterprise AI technology for businesses that want to work differently.</p>
        </div>
        <nav aria-label="Footer: explore"><h2 className="footer__h">Explore</h2>
          <ul>{NAV.map((n) => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}</ul></nav>
        <div><h2 className="footer__h">Services</h2>
          <ul>{SERVICES.map((s) => <li key={s.title}><Link to={s.title === 'Enterprise AI' ? '/product' : '/about#services'}>{s.title}</Link></li>)}</ul></div>
        <div><h2 className="footer__h">Contact</h2>
          <ul>
            <li><Link to="/contact">Request a demo</Link></li>
            {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
            {phone && <li><a href={`tel:${phone}`}>{phone}</a></li>}
            {linkedin && <li><a href={linkedin} rel="noopener noreferrer">LinkedIn</a></li>}
          </ul></div>
      </div>
      <div className="container footer__base">
        <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
        <span className="footer__legal"><a href="/privacy" onClick={(e) => e.preventDefault()} aria-disabled="true">Privacy policy — to be provided</a></span>
        <span className="footer__theme">Theme <ThemeToggle /></span>
      </div>
    </footer>
  )
}
