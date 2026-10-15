import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { cars, locations, mad } from '../data/fleet'
import { quote, useTrip } from '../context/TripContext'

const ease = [0.23, 1, 0.32, 1]
const rise = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }
const stagger = (d = 0.2) => ({ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: d } } })

export default function CarDetail() {
  const { id } = useParams()
  const car = cars.find((c) => c.id === id)
  const { trip } = useTrip()
  if (!car) return <Navigate to="/" replace />
  const q = quote(car, trip)
  const loc = (lid) => locations.find((l) => l.id === lid).short
  const others = cars.filter((c) => c.id !== car.id && (c.type === car.type || Math.abs(c.price - car.price) <= 150)).slice(0, 3)

  const specs = [
    ['Seats', car.seats],
    ['Doors', car.doors],
    ['Luggage', `${car.bags} bags`],
    ['Gearbox', car.transmission],
    ['Fuel', car.fuel],
    ['Consumption', car.consumption],
    ['Model year', car.year],
    ['Mileage', 'Unlimited'],
  ]

  return (
    <article>
      <section className="wrap pt-20 lg:pt-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Link to="/#fleet" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-bone-dim hover:text-bone"><ArrowLeft size={16} /> All cars</Link>
        </motion.div>
        <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-card bg-coal-900 sm:aspect-[16/9] lg:aspect-[2/1]">
          <motion.img
            layoutId={`photo-${car.id}`}
            src={car.photo}
            alt={`${car.name}, ${car.year}`}
            width="1280"
            height="800"
            fetchpriority="high"
            decoding="async"
            style={{ objectPosition: car.pos }}
            transition={{ duration: 0.65, ease }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <motion.div initial="hidden" animate="show" variants={stagger(0.35)} className="mt-8 grid gap-4 border-b border-bone/10 pb-10 lg:grid-cols-[1fr_auto] lg:items-end lg:pb-14">
          <div>
            <motion.p variants={rise} className="label text-bone-mute">{car.type} · {car.year}</motion.p>
            <motion.h1 variants={rise} className="display mt-3 text-[2.6rem] sm:text-7xl lg:text-[6.2rem]">{car.name}</motion.h1>
          </div>
          <motion.p variants={rise} className="tnum text-lg text-bone-dim lg:pb-3 lg:text-right"><span className="display-sm text-3xl text-bone">{mad(car.price)}</span> / day<br className="hidden lg:block" /> insurance included</motion.p>
        </motion.div>
      </section>

      <div className="wrap grid gap-16 py-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20 lg:py-20">
        <div>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="display-sm max-w-[30ch] text-2xl leading-snug sm:text-3xl">
            {car.blurb}
          </motion.p>

          <h2 className="label mt-16 text-bone-mute">Specifications</h2>
          <motion.dl initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger(0)} className="mt-5 grid grid-cols-2 border-l border-t border-bone/10 sm:grid-cols-4">
            {specs.map(([k, v]) => (
              <motion.div key={k} variants={rise} className="border-b border-r border-bone/10 p-5">
                <dt className="text-xs text-bone-mute">{k}</dt>
                <dd className="tnum mt-2 text-lg font-semibold">{v}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <h2 className="label mt-14 text-bone-mute">On board</h2>
          <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
            {car.features.map((f) => (
              <li key={f} className="flex items-center gap-3 border-b border-bone/10 py-3.5"><Check size={16} className="shrink-0 text-signal-400" />{f}</li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-bone/10 bg-coal-900 p-6 shadow-[0_1px_0_rgba(241,236,228,.06)_inset] sm:p-8">
            <h2 className="label text-bone-mute">Your trip</h2>
            <p className="mt-2 text-bone">{loc(trip.pickup)} to {loc(trip.dropoff)}</p>
            <p className="tnum text-sm text-bone-dim">{trip.start} to {trip.end} · {q.days} day{q.days > 1 ? 's' : ''}</p>
            <div className="mt-6 space-y-2 border-t border-bone/10 pt-5 text-sm text-bone-dim">
              <p className="flex justify-between gap-4"><span>{mad(car.price)} × {q.days} days</span><span className="tnum text-bone">{mad(q.base)}</span></p>
              {q.discount > 0 && <p className="flex justify-between gap-4"><span>Weekly rate, −10%</span><span className="tnum text-bone">−{mad(q.discount)}</span></p>}
              {q.oneWay > 0 && <p className="flex justify-between gap-4"><span>One-way return</span><span className="tnum text-bone">{mad(q.oneWay)}</span></p>}
              <p className="flex justify-between gap-4"><span>Insurance and unlimited km</span><span className="text-bone">Included</span></p>
            </div>
            <div className="mt-5 flex items-end justify-between border-t border-bone/10 pt-5">
              <span className="text-sm">Total</span>
              <span className="tnum display-sm text-4xl">{mad(q.total)}</span>
            </div>
            <Link to={`/book/${car.id}`} className="btn-red mt-6 w-full min-h-[56px] text-[15px]">Book this car <ArrowRight size={17} /></Link>
            <p className="mt-4 text-xs text-bone-mute">Pay at pick-up. Free cancellation up to 48 hours before. Refundable deposit {mad(q.deposit)}.</p>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="wrap border-t border-bone/10 pb-24 pt-14">
          <h2 className="display-sm text-2xl">Also worth a look</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((c) => (
              <li key={c.id} className="group relative">
                <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-coal-850">
                  <motion.img layoutId={`photo-${c.id}`} src={c.photo} alt={`${c.name}, ${c.year}`} width="1280" height="800" loading="lazy" decoding="async" style={{ objectPosition: c.pos }} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.04]" />
                </div>
                <div className="mt-3 flex justify-between gap-4">
                  <Link to={`/cars/${c.id}`} className="font-semibold after:absolute after:inset-0">{c.name}</Link>
                  <span className="tnum text-sm text-bone-dim">{mad(c.price)} / day</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
