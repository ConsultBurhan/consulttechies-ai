import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      className="theme-toggle"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 }) }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle className="tt-core" cx="12" cy="12" r="5" fill="currentColor" />
        <g className="tt-rays" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          {Array.from({ length: 8 }).map((_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={12 + Math.cos(a) * 8} y1={12 + Math.sin(a) * 8} x2={12 + Math.cos(a) * 10.5} y2={12 + Math.sin(a) * 10.5} /> })}
        </g>
        <circle className="tt-bite" cx="17" cy="8" r="5.2" />
      </svg>
    </button>
  )
}
