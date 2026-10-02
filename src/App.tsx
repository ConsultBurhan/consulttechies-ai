import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import Home from './pages/Home'

const Product = lazy(() => import('./pages/Product'))
const Solutions = lazy(() => import('./pages/Solutions'))
const Technology = lazy(() => import('./pages/Technology'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) { requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView()) }
    else window.scrollTo(0, 0)
    const main = document.getElementById('main')
    if (!hash && main) { main.focus({ preventScroll: true }) }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navigation />
      <ScrollManager />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div style={{ minHeight: '70vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
