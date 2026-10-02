import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function PageHeader({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div className="container">
        <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
        <Reveal delay={1}><h1 className="display">{title}</h1></Reveal>
        <Reveal delay={2}><p className="lede">{lede}</p></Reveal>
        {children && <Reveal delay={3}>{children}</Reveal>}
      </div>
    </header>
  )
}
