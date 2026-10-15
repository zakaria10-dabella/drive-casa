import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path d="M8 8h8.5a8 8 0 0 1 0 16H8z" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="8" y="14.5" width="10" height="3" fill="#E0362E" />
      </svg>
      <span className="display-sm text-[15px] uppercase tracking-[0.04em]">DriveCasa</span>
    </span>
  )
}

const links = [
  ['Fleet', '/#fleet'],
  ['Locations', '/#locations'],
  ['Pricing', '/#pricing'],
  ['FAQ', '/#faq'],
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 60))
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid || open ? 'border-b border-bone/10 bg-coal-950/95 backdrop-blur-md' : 'border-b border-transparent'}`}>
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link to="/" aria-label="DriveCasa home" className="flex min-h-[44px] items-center text-bone"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm text-bone/80 md:flex">
          {links.map(([l, h]) => (
            <Link key={l} to={h} className="flex min-h-[44px] items-center transition-colors duration-150 hover:text-bone">{l}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="tel:+212522000000" className="hidden min-h-[44px] items-center text-sm text-bone/80 tnum hover:text-bone lg:flex">+212 522 00 00 00</a>
          <Link to="/#fleet" className="btn-red ml-4 hidden sm:inline-flex">Book a car</Link>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="grid h-11 w-11 place-items-center rounded-card text-bone md:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} aria-label="Mobile" className="wrap flex flex-col pb-6 md:hidden">
            {links.map(([l, h]) => (
              <Link key={l} to={h} onClick={() => setOpen(false)} className="display-sm flex min-h-[52px] items-center border-b border-bone/10 text-2xl uppercase">{l}</Link>
            ))}
            <Link to="/#fleet" onClick={() => setOpen(false)} className="btn-red mt-6">Book a car</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
