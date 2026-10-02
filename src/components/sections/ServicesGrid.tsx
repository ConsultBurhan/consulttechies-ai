import { Link } from 'react-router-dom'
import { SERVICES } from '../../content/site'
import { Reveal } from '../Reveal'

export function ServicesGrid() {
  return (
    <ul className="services" id="services">
      {SERVICES.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i} className={`service ${'tag' in s ? 'service--lead' : ''}`}>
          <span className="mono service__n">0{i + 1}</span>
          <h3>{s.title}</h3>
          <p className="muted">{s.body}</p>
          {'tag' in s && <Link to="/product" className="link">Explore the product</Link>}
        </Reveal>
      ))}
    </ul>
  )
}
