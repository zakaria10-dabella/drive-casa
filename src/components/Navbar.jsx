import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Phone } from 'lucide-react'
import Magnetic from './Magnetic'

export function Logo({ light }) {
  return (
    <span className={`flex items-center gap-2 font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-night-900'}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-casa-500">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true"><path d="M6 19l3-6c.5-1 1.4-1.6 2.5-1.6h9c1.1 0 2 .6 2.5 1.6l3 6v4H6z" fill="#fff" /><circle cx="11" cy="23" r="2.4" fill="#D7263D" stroke="#fff" strokeWidth="1.5" /><circle cx="21" cy="23" r="2.4" fill="#D7263D" stroke="#fff" strokeWidth="1.5" /></svg>
      </span>
      Drive<span className="text-casa-500">Casa</span>
    </span>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 40))
  const onDark = pathname === '/' && !solid

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${solid || pathname !== '/' ? 'bg-white/85 shadow-[0_1px_0_rgba(11,17,32,.06)] backdrop-blur-xl' : ''}`}>
      <div className="wrap flex h-16 items-center justify-between">
        <Link to="/" aria-label="DriveCasa home"><Logo light={onDark} /></Link>
        <nav className={`hidden items-center gap-8 text-sm font-semibold md:flex ${onDark ? 'text-white/80' : 'text-night-900/70'}`}>
          <Link to="/#fleet" className="hover:text-casa-500">Fleet</Link>
          <a href="/#how" className="hover:text-casa-500">How it works</a>
          <span className="flex items-center gap-1.5"><Phone size={14} /> 05 22 00 00 00</span>
        </nav>
        <Magnetic>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/#fleet" className="btn-red px-4 py-2.5">Book a car</Link>
          </motion.div>
        </Magnetic>
      </div>
    </header>
  )
}
