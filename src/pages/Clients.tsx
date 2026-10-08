import { PageHeader } from '../components/PageHeader'
import { CTASection } from '../components/CTASection'
import { ClientsOrbit } from '../components/sections/ClientsOrbit'
import { FlagshipScroll } from '../components/sections/FlagshipScroll'
import { ClientEcosystem } from '../components/sections/ClientEcosystem'
import { useSeo } from '../hooks/useSeo'

export default function Clients() {
  useSeo({ title: 'Our Clients', path: '/clients', description: 'The organizations Babji Consult Techies builds enterprise AI systems with, from multi-brand restaurant groups to European agencies.' })
  return (
    <div className="page">
      <PageHeader eyebrow="BCT / CLIENTS" title={<>The organizations <em>we build with.</em></>}
        lede="From restaurant groups serving a whole country to agencies working across Europe, these are the teams we have worked alongside." />
      <ClientsOrbit />

      <FlagshipScroll />

      <ClientEcosystem />

      <CTASection variant="card" title={<>Your team could be <em>next.</em></>} body="Tell us how your organization works today. We will show you what it looks like when it can answer back." />
    </div>
  )
}
