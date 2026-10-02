import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  useSeo({ title: 'Page not found', path: '/404', description: 'This page could not be found.' })
  return (
    <div className="page">
      <PageHeader eyebrow="404" title={<>That page isn’t <em>connected.</em></>} lede="It may have moved, or the link may be wrong.">
        <Button to="/" arrow>Back to home</Button>
      </PageHeader>
    </div>
  )
}
