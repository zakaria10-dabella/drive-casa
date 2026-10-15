import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Check, DoorOpen, Gauge, ShieldCheck, Star } from 'lucide-react'
import { cars, locations, mad } from '../data/fleet'
import { quote, useTrip } from '../context/TripContext'
import CarArt from '../components/CarArt'
import { Specs } from '../components/CarCard'

const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }

export default function CarDetail() {
  const { id } = useParams()
  const car = cars.find((c) => c.id === id)
  const { trip } = useTrip()
  if (!car) return <Navigate to="/" replace />
  const q = quote(car, trip)
  const loc = (lid) => locations.find((l) => l.id === lid).short

  return (
    <div className="wrap pt-24">
      <Link to="/#fleet" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-450 hover:text-night-900"><ArrowLeft size={16} /> Back to fleet</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-porcelain to-mist p-6 shadow-soft sm:p-10">
            <span className="pointer-events-none absolute -bottom-8 left-4 select-none font-display text-[6rem] font-extrabold uppercase leading-none text-night-900/[0.04] sm:text-[9rem]">{car.type}</span>
            <motion.div initial={{ x: -120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.2 }}>
              <CarArt body={car.body} color={car.color} className="relative w-full" />
            </motion.div>
          </div>
          <motion.ul initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [Gauge, 'Consumption', car.consumption],
              [DoorOpen, 'Doors', `${car.doors} doors`],
              [Calendar, 'Model year', car.year],
              [ShieldCheck, 'Insurance', 'Included'],
            ].map(([Icon, k, v]) => (
              <motion.li key={k} variants={rise} className="rounded-2xl bg-white p-4 shadow-soft">
                <Icon size={18} className="text-casa-500" />
                <p className="mt-3 text-xs text-slate-450">{k}</p>
                <p className="font-bold">{v}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}>
          <motion.p variants={rise} className="text-xs font-bold uppercase tracking-[0.18em] text-casa-500">{car.type} · {car.transmission}</motion.p>
          <motion.h1 variants={rise} className="mt-2 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{car.name}</motion.h1>
          <motion.p variants={rise} className="mt-2 flex items-center gap-2 text-sm text-slate-450"><Star size={14} className="fill-amber-400 text-amber-400" /> {car.rating} · {car.trips} trips</motion.p>
          <motion.div variants={rise}><Specs car={car} className="mt-4 text-sm" /></motion.div>
          <motion.ul variants={rise} className="mt-6 grid grid-cols-2 gap-2 text-sm">
            {car.features.map((f) => <li key={f} className="flex items-center gap-2"><Check size={15} className="text-casa-500" />{f}</li>)}
          </motion.ul>
          <motion.div variants={rise} className="mt-8 rounded-[1.75rem] bg-night-900 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Your trip</p>
            <p className="mt-1 text-sm text-white/80">{loc(trip.pickup)} → {loc(trip.dropoff)} · {q.days} day{q.days > 1 ? 's' : ''}</p>
            <div className="mt-4 space-y-1.5 text-sm text-white/70">
              <p className="flex justify-between"><span>{mad(car.price)} × {q.days} days</span><span className="tnum text-white">{mad(q.base)}</span></p>
              {q.discount > 0 && <p className="flex justify-between text-emerald-300"><span>Weekly discount</span><span className="tnum">−{mad(q.discount)}</span></p>}
              {q.oneWay > 0 && <p className="flex justify-between"><span>One-way fee</span><span className="tnum text-white">{mad(q.oneWay)}</span></p>}
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <span className="text-sm font-semibold">Total</span>
              <span className="tnum font-display text-3xl font-extrabold">{mad(q.total)}</span>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-5">
              <Link to={`/book/${car.id}`} className="btn-red w-full py-4">Book this car</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
