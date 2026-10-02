/** 404 numerals built from stacked layers; they lean toward the pointer. */
export function Tilt404() {
  const lean = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 50).toFixed(1)}deg`)
    e.currentTarget.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * 30).toFixed(1)}deg`)
  }
  return (
    <div className="t404" onPointerMove={lean} aria-hidden="true">
      <div className="t404__body">{Array.from({ length: 9 }, (_, i) => <span key={i} style={{ '--z': `${(i - 8) * 9}px`, '--o': i === 8 ? 1 : 0.12 + i * 0.03 } as React.CSSProperties} data-front={i === 8 ? '1' : '0'}>404</span>)}</div>
    </div>
  )
}
