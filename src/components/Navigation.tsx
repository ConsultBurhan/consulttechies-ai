import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV, SITE } from '../content/site'
import { Logo } from './Logo'
import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'

export function BrandLockup() {
  const { pathname } = useLocation()
  // already on the homepage: the link alone would do nothing, so scroll back to the top
  const home = () => { if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return (
    <Link to="/" className="brand" aria-label={`${SITE.name} — home`} onClick={home}>
      <Logo className="brand__mark" />
      <span className="brand__word">Babji <b>Consult</b> Techies</span>
    </Link>
  )
}

const PRODUCT_MENU = [
  { to: '/product#demo', t: 'Live demo', d: 'Ask a question, watch it work' },
  { to: '/product#layer', t: 'Intelligence layer', d: 'How it connects your data and documents' },
  { to: '/product#prediction', t: 'Forecasting', d: 'See what could happen next' },
  { to: '/product#capabilities', t: 'Capabilities', d: 'What the assistant actually does' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [menuHidden, setMenuHidden] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    const hide = () => setMenuHidden(true)
    on(); window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('scroll', hide, { passive: true })
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('scroll', hide) }
  }, [])
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--compact' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__bar">
        <BrandLockup />
        <nav className="nav__links" aria-label="Primary">
          {NAV.map((n) => n.to === '/product' ? (
            <div className={`nav__item has-menu ${menuHidden ? 'menu-hidden' : ''}`} key={n.to} onMouseMove={() => menuHidden && setMenuHidden(false)} onFocus={() => setMenuHidden(false)}>
              <NavLink to={n.to}>{n.label}</NavLink>
              <div className="menu" role="group" aria-label="Product">
                {PRODUCT_MENU.map((m) => <Link key={m.to} to={m.to}><strong>{m.t}</strong><span>{m.d}</span></Link>)}
              </div>
            </div>
          ) : <div className="nav__item" key={n.to}><NavLink to={n.to}>{n.label}</NavLink></div>)}
        </nav>
        <div className="nav__actions">
          <ThemeToggle />
          <Link to="/product#demo" className="nav__ask"><i aria-hidden="true" />Ask Context</Link>
          <Link to="/product#demo" className="nav__ico nav__ico--ask" aria-label="Ask Context">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4h0A2.5 2.5 0 0 1 4 13.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8.5 8.5h7M8.5 11.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <span className="nav__tip" aria-hidden="true"><b>Ask Context</b><small>Try the live demo</small></span>
          </Link>
          <span className="nav__cta"><Button to="/contact#request" size="md">Request a demo</Button></span>
          <Link to="/contact#request" className="nav__ico nav__ico--demo" aria-label="Request a demo">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <span className="nav__tip" aria-hidden="true"><b>Request a demo</b><small>Talk to our team</small></span>
          </Link>
          <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <span /><span />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="sheet" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => <NavLink key={n.to} to={n.to} style={{ '--i': i } as React.CSSProperties}>{n.label}</NavLink>)}
        </nav>
        <Button to="/contact#request" size="lg" arrow>Request a demo</Button>
      </div>
    </header>
  )
}
