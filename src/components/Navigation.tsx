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
  { to: '/product#knowledge', t: 'Company knowledge', d: 'Documents, retrieval, grounded answers' },
  { to: '/product#data', t: 'Database connectivity', d: 'SQL, Oracle, MongoDB and more' },
  { to: '/product#security', t: 'Security', d: 'Permission-aware by design' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
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
            <div className="nav__item has-menu" key={n.to}>
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
          <span className="nav__cta"><Button to="/contact" size="md">Request a demo</Button></span>
          <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <span /><span />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="sheet" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => <NavLink key={n.to} to={n.to} style={{ '--i': i } as React.CSSProperties}>{n.label}</NavLink>)}
        </nav>
        <Button to="/contact" size="lg" arrow>Request a demo</Button>
      </div>
    </header>
  )
}
