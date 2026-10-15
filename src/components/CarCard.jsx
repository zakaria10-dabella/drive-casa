import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { mad } from '../data/fleet'

export function specLine(car) {
  return [`${car.seats} seats`, car.transmission, car.fuel, `${car.bags} bags`]
}

export default function CarCard({ car, days, index = 0 }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05, ease: [0.23, 1, 0.32, 1] }}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-coal-850">
        <motion.img
          layoutId={`photo-${car.id}`}
          src={car.photo}
          alt={`${car.name}, ${car.year}`}
          width="1280"
          height="800"
          loading="lazy"
          decoding="async"
          style={{ objectPosition: car.pos }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label text-bone-mute">{car.type}</p>
          <h3 className="display-sm mt-1.5 text-xl">
            <Link to={`/cars/${car.id}`} className="outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-signal-400">
              {car.name}
            </Link>
          </h3>
        </div>
        <ArrowUpRight size={20} aria-hidden="true" className="mt-5 shrink-0 text-bone-mute transition-[color,transform] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-400" />
      </div>
      <p className="mt-2 text-sm text-bone-dim">{specLine(car).join('  ·  ')}</p>
      <div className="mt-4 flex items-baseline justify-between border-t border-bone/10 pt-3">
        <p className="tnum"><span className="text-lg font-semibold">{mad(car.price)}</span><span className="text-sm text-bone-mute"> / day</span></p>
        <p className="tnum text-sm text-bone-dim">{mad(car.price * days)} for {days} day{days > 1 ? 's' : ''}</p>
      </div>
    </motion.li>
  )
}
