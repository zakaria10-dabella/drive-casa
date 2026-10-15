import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Fuel, Settings2, Star, Users } from 'lucide-react'
import CarArt from './CarArt'
import { mad } from '../data/fleet'

export function Specs({ car, className = '' }) {
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-450 ${className}`}>
      <li className="flex items-center gap-1"><Users size={13} /> {car.seats}</li>
      <li className="flex items-center gap-1"><Briefcase size={13} /> {car.bags}</li>
      <li className="flex items-center gap-1"><Settings2 size={13} /> {car.transmission}</li>
      <li className="flex items-center gap-1"><Fuel size={13} /> {car.fuel}</li>
    </ul>
  )
}

export default function CarCard({ car, days }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      whileHover="hover"
      className="group flex flex-col rounded-[1.75rem] bg-white p-5 shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-casa-500">{car.type}</p>
          <h3 className="mt-1 font-display text-xl font-bold">{car.name}</h3>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-porcelain px-2 py-1 text-xs font-bold"><Star size={12} className="fill-amber-400 text-amber-400" /> {car.rating}</span>
      </div>
      <div className="relative my-3 overflow-hidden rounded-2xl bg-gradient-to-b from-porcelain to-mist px-4 py-6">
        <motion.div variants={{ hover: { x: 10 } }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
          <CarArt body={car.body} color={car.color} className="w-full" />
        </motion.div>
        <motion.span variants={{ hover: { x: 0, opacity: 1 } }} initial={{ x: -20, opacity: 0 }} className="absolute bottom-3 left-4 h-0.5 w-16 rounded-full bg-casa-500" />
      </div>
      <Specs car={car} />
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-night-900/5 pt-4">
        <div>
          <p className="tnum font-display text-2xl font-bold">{mad(car.price)}<span className="font-sans text-xs font-semibold text-slate-450"> /day</span></p>
          <p className="tnum text-xs text-slate-450">{mad(car.price * days)} for {days} day{days > 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/cars/${car.id}`} className="btn-light px-3.5 py-2.5">Details</Link>
          <Link to={`/book/${car.id}`} className="btn-dark px-3.5 py-2.5">Book</Link>
        </div>
      </div>
    </motion.li>
  )
}
