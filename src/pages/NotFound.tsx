import { PageHeader } from '../components/PageHeader'
import { Tilt404 } from '../components/Tilt404'
import { Button } from '../components/Button'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  useSeo({ title: 'Page not found', path: '/404', description: 'This page could not be found.' })
  return (
    <div className="page">
      <PageHeader eyebrow="BCT / 404" title={<>That page isn’t <em>connected.</em></>} lede="It may have moved, or the link may be wrong.">
        <Tilt404 /><Button to="/" arrow>Back to home</Button>
      </PageHeader>
    </div>
  )
}
