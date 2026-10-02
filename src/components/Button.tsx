import { useRef, type ReactNode, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  to?: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'quiet'
  size?: 'md' | 'lg'
  arrow?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  children: ReactNode
}

const Arrow = () => (
  <svg className="btn__arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

export function Button({ to, href, onClick, variant = 'primary', size = 'md', arrow, type = 'button', disabled, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  // subtle magnetic pull on fine pointers only
  const move = (e: PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse' || variant !== 'primary') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1)}px`)
    el.style.setProperty('--my', `${((e.clientY - r.top - r.height / 2) * 0.2).toFixed(1)}px`)
  }
  const leave = () => { ref.current?.style.setProperty('--mx', '0px'); ref.current?.style.setProperty('--my', '0px') }
  const cls = `btn btn--${variant} btn--${size}`
  const inner = <><span className="btn__label">{children}</span>{arrow && <Arrow />}</>
  const common = { className: cls, onPointerMove: move, onPointerLeave: leave }
  if (to) return <Link ref={ref as React.Ref<HTMLAnchorElement>} to={to} {...common}>{inner}</Link>
  if (href) return <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...common}>{inner}</a>
  return <button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} {...common}>{inner}</button>
}
