import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LayoutGroup } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import Booking from './pages/Booking'

export default function App() {
  const location = useLocation()
  useLayoutEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <LayoutGroup>
      <a href="#main" className="btn-bone fixed left-4 top-3 z-[60] -translate-y-20 focus:translate-y-0">Skip to content</a>
      <Navbar />
      <main id="main">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </LayoutGroup>
  )
}
