import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from 'framer-motion'
import { CarFront, KeyRound, MapPinned, Move3d, SearchX } from 'lucide-react'
import { cars, mad, types } from '../data/fleet'
import { daysBetween, useTrip } from '../context/TripContext'
import SearchWidget from '../components/SearchWidget'
import CarCard from '../components/CarCard'
import CarArt from '../components/CarArt'
import { hasWebGL } from '../three/webgl'

const Car3D = lazy(() => import('../three/Car3D'))
const bodies = [
  { id: 'hatch', label: 'Hatch' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
]
const paints = ['#D7263D', '#F5F6F8', '#2E5BFF', '#0B1120']

function Hero({ onSearch }) {
  const ref = useRef(null)
  const [webgl] = useState(hasWebGL)
  const [body, setBody] = useState('hatch')
  const [paint, setPaint] = useState(paints[0])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  return (
    <section ref={ref} className="relative overflow-hidden bg-night-900 pb-16 pt-24 text-white sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_45%,rgba(215,38,61,.35),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="wrap relative">
        <div className="grid items-center gap-4 lg:grid-cols-[1fr_1.15fr]">
          <motion.div style={{ y: titleY, opacity: titleOpacity }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-casa-400" /> 38 cars available today in Casablanca
            </motion.p>
            <h1 className="mt-5 font-display text-[3.3rem] font-extrabold leading-[0.9] tracking-tight sm:text-7xl lg:text-[6.2rem]">
              {['Drive', 'Casa,'].map((w, i) => (
                <span key={w} className="block overflow-hidden">
                  <motion.span className="block" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>
                </span>
              ))}
              <span className="block overflow-hidden">
                <motion.span className="block text-casa-500" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>your way.</motion.span>
              </span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-5 max-w-md text-white/65">
              From the airport to the Corniche in a few taps. Transparent prices in MAD, free cancellation up to 48 h, delivery to your door.
            </motion.p>
          </motion.div>

          <div className="relative">
            <motion.div style={{ scale: stageScale }} className="relative h-[280px] sm:h-[380px] lg:h-[460px]">
              {webgl ? (
                <Suspense fallback={<div className="grid h-full place-items-center"><CarArt body={body} color={paint} className="w-4/5" /></div>}>
                  <div className="h-full cursor-grab active:cursor-grabbing">
                    <Car3D body={body} color={paint} progress={scrollYProgress} />
                  </div>
                </Suspense>
              ) : (
                <div className="grid h-full place-items-center"><CarArt body={body} color={paint} className="w-4/5" /></div>
              )}
            </motion.div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex rounded-full bg-white/[0.07] p-1 backdrop-blur" role="radiogroup" aria-label="Body style">
                {bodies.map((b) => (
                  <button key={b.id} role="radio" aria-checked={body === b.id} onClick={() => setBody(b.id)} className={`relative rounded-full px-4 py-1.5 text-xs font-bold ${body === b.id ? 'text-night-900' : 'text-white/70'}`}>
                    {body === b.id && <motion.span layoutId="body-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 450, damping: 32 }} />}
                    <span className="relative">{b.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2" role="radiogroup" aria-label="Paint">
                {paints.map((c) => (
                  <motion.button key={c} role="radio" aria-checked={paint === c} aria-label={`Paint ${c}`} whileTap={{ scale: 0.85 }} onClick={() => setPaint(c)} className="relative grid h-8 w-8 place-items-center">
                    {paint === c && <motion.span layoutId="paint-ring" className="absolute inset-0 rounded-full border-2 border-white" />}
                    <span className="h-5 w-5 rounded-full border border-white/30" style={{ background: c }} />
                  </motion.button>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/45"><Move3d size={14} /> Drag to spin</span>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <SearchWidget onSearch={onSearch} />
        </div>
      </div>
    </section>
  )
}

const steps = [
  { icon: MapPinned, title: 'Choose where', text: 'Airport CMN, Casa Voyageurs, Casa Port, Maarif or delivered to your door.' },
  { icon: CarFront, title: 'Pick your car', text: 'City cars to premium SUVs, all under 2 years old with unlimited kilometres.' },
  { icon: KeyRound, title: 'Grab the keys', text: 'Show your licence and passport, sign on a tablet, and drive off in 10 minutes.' },
]

function How() {
  return (
    <section id="how" className="wrap scroll-mt-20 pt-24">
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        Three steps. <span className="text-slate-450">No paperwork marathon.</span>
      </motion.h2>
      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -6 }} className="relative overflow-hidden rounded-[1.75rem] bg-white p-6 shadow-soft">
            <span className="absolute -right-2 -top-6 font-display text-[7rem] font-extrabold leading-none text-night-900/[0.04]">{i + 1}</span>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-casa-500/10 text-casa-500"><s.icon size={22} /></span>
            <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-450">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

function Fleet() {
  const { trip } = useTrip()
  const days = daysBetween(trip.start, trip.end)
  const [type, setType] = useState('All')
  const [gear, setGear] = useState('Any')
  const [max, setMax] = useState(1400)
  const [sort, setSort] = useState('price')

  const list = useMemo(() => {
    const l = cars.filter((c) => (type === 'All' || c.type === type) && (gear === 'Any' || c.transmission === gear) && c.price <= max)
    return l.sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'rating' ? b.rating - a.rating : b.price - a.price))
  }, [type, gear, max, sort])

  const pct = ((max - 250) / (1400 - 250)) * 100

  return (
    <section id="fleet" className="wrap scroll-mt-20 pt-24">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-4xl font-extrabold sm:text-5xl">The fleet</motion.h2>
        <p className="text-sm text-slate-450">Prices for <strong className="text-night-900">{days} day{days > 1 ? 's' : ''}</strong> · unlimited km · insurance included</p>
      </div>

      <div className="mt-8 grid gap-4 rounded-[1.75rem] bg-white p-4 shadow-soft lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
        <LayoutGroup id="types">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none]" role="tablist" aria-label="Car type">
            {types.map((t) => (
              <button key={t} role="tab" aria-selected={type === t} onClick={() => setType(t)} className={`relative whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold ${type === t ? 'text-white' : 'text-slate-450 hover:text-night-900'}`}>
                {type === t && <motion.span layoutId="type-pill" className="absolute inset-0 rounded-xl bg-night-900" transition={{ type: 'spring', stiffness: 450, damping: 34 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div className="flex rounded-xl bg-porcelain p-1" role="radiogroup" aria-label="Transmission">
          {['Any', 'Manual', 'Automatic'].map((g) => (
            <button key={g} role="radio" aria-checked={gear === g} onClick={() => setGear(g)} className="relative flex-1 rounded-lg px-3 py-1.5 text-xs font-bold">
              {gear === g && <motion.span layoutId="gear-pill" className="absolute inset-0 rounded-lg bg-white shadow" transition={{ type: 'spring', stiffness: 450, damping: 34 }} />}
              <span className="relative">{g}</span>
            </button>
          ))}
        </div>
        <label className="block min-w-[220px]">
          <span className="flex justify-between text-xs font-bold text-slate-450"><span>Max per day</span><motion.span key={max} initial={{ y: -4, opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} className="tnum text-night-900">{mad(max)}</motion.span></span>
          <div className="relative mt-2 h-6">
            <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-mist" />
            <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-casa-500" style={{ width: `${pct}%` }} />
            <input type="range" min={250} max={1400} step={50} value={max} onChange={(e) => setMax(+e.target.value)} aria-label="Maximum price per day" className="absolute inset-0 w-full" />
          </div>
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="field py-2.5 lg:w-40">
          <option value="price">Lowest price</option>
          <option value="priceDesc">Highest price</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <motion.ul layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c) => <CarCard key={c.id} car={c} days={days} />)}
        </AnimatePresence>
      </motion.ul>
      <AnimatePresence>
        {list.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 flex flex-col items-center rounded-[1.75rem] border-2 border-dashed border-night-900/10 py-16 text-center">
            <motion.span animate={{ x: [-6, 6, -6] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}><SearchX size={36} className="text-casa-500" /></motion.span>
            <p className="mt-4 font-display text-xl font-bold">No car matches these filters</p>
            <button onClick={() => { setType('All'); setGear('Any'); setMax(1400) }} className="mt-2 text-sm font-bold text-casa-500 hover:underline">Reset filters</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function Home() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 350)
  }, [hash])
  const toFleet = () => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <>
      <Hero onSearch={toFleet} />
      <How />
      <Fleet />
    </>
  )
}
