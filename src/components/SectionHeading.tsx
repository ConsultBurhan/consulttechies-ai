import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function SectionHeading({ eyebrow, title, lede, align = 'left', as: H = 'h2' }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; align?: 'left' | 'center'; as?: 'h1' | 'h2' }) {
  return (
    <div className={`sh sh--${align}`}>
      {eyebrow && <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>}
      <Reveal delay={1}><H className="display">{title}</H></Reveal>
      {lede && <Reveal delay={2}><p className="lede">{lede}</p></Reveal>}
    </div>
  )
}
