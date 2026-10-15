import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import Booking from './pages/Booking'

export default function App() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, clipPath: 'inset(8% 4% 0% 4% round 32px)' }}
          animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/book/:id" element={<Booking />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
