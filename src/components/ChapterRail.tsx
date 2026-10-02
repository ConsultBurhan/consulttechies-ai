import { useEffect, useState } from 'react'

type Ch = { id: string; n: string; label: string }

/** Marks where the visitor is in the story. Reads [data-chapter] elements, so any page can opt in. */
export function ChapterRail() {
  const [chs, setChs] = useState<Ch[]>([])
  const [cur, setCur] = useState('')
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('[data-chapter]')]
    setChs(els.map((e) => ({ id: e.id, n: e.dataset.chapter!, label: e.dataset.label! })))
    const on = () => {
      let c = els[0]?.id ?? ''
      for (const e of els) if (e.getBoundingClientRect().top < window.innerHeight * 0.45) c = e.id
      setCur(c)
    }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  if (!chs.length) return null
  return (
    <nav className="rail" aria-label="Story chapters">
      <ol>
        {chs.map((c) => (
          <li key={c.id}><a href={`#${c.id}`} aria-current={cur === c.id ? 'step' : undefined} onClick={(e) => { e.preventDefault(); document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' }) }}><span className="mono rail__l">{c.label}</span><span className="mono rail__n">{c.n}</span></a></li>
        ))}
      </ol>
    </nav>
  )
}
