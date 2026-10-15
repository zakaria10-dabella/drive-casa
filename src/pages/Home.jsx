import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { cars, DEPOSIT, extras, locations, mad, ONE_WAY_FEE, types } from '../data/fleet'
import { daysBetween, useTrip } from '../context/TripContext'
import SearchWidget from '../components/SearchWidget'
import CarCard from '../components/CarCard'

const ease = [0.23, 1, 0.32, 1]
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

/* ---------------------------------------------------------------- Hero */
function Hero({ onSearch }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.06, 1.22])
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '12%'])
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -90])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  return (
    <>
      <section ref={ref} className="relative h-[92svh] min-h-[600px] overflow-hidden bg-coal-950 sm:min-h-[680px]">
        <motion.img
          src="/photos/hero-mosque-sunset.jpg"
          alt="The Hassan II Mosque minaret silhouetted against the sun setting over the Atlantic, Casablanca"
          width="1280"
          height="851"
          fetchpriority="high"
          decoding="async"
          style={{ scale, y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 h-full w-full origin-[45%_60%] object-cover object-[40%_50%] [filter:contrast(1.12)_saturate(1.15)_brightness(.9)]"
        />
        {/* scrims are siblings of the copy: top band for the nav, lead corner for the headline */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-coal-950/75 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-coal-950/95 via-coal-950/70 to-transparent md:hidden" />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-[radial-gradient(130%_80%_at_0%_100%,rgba(12,12,14,.94)_0%,rgba(12,12,14,.8)_40%,rgba(12,12,14,.3)_64%,transparent_80%)] md:block" />
        <div className="grain absolute inset-0" aria-hidden="true" />

        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="wrap relative flex h-full flex-col justify-end pb-32 sm:pb-40 lg:pb-44">
          <h1 className="display text-[2.65rem] text-bone sm:text-6xl lg:text-[5.4rem] xl:text-[5.9rem]">
            {['From CMN', 'to the Corniche.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.09, duration: 0.9, ease }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-6 max-w-[42ch] text-base text-bone/85 sm:text-lg">
            Nine cars, five pick-up points across Casablanca, prices in dirhams with insurance included. Keys in ten minutes.
          </motion.p>
        </motion.div>
      </section>
      <div className="wrap relative z-10 -mt-20 sm:-mt-[4.5rem]">
        <SearchWidget onSearch={onSearch} />
      </div>
    </>
  )
}

/* --------------------------------------------------------------- Fleet */
function Fleet() {
  const { trip } = useTrip()
  const days = daysBetween(trip.start, trip.end)
  const [type, setType] = useState('All')
  const [gear, setGear] = useState('Any')
  const [max, setMax] = useState(1400)
  const [sort, setSort] = useState('price')

  const list = useMemo(() => {
    const l = cars.filter((c) => (type === 'All' || c.type === type) && (gear === 'Any' || c.transmission === gear) && c.price <= max)
    return l.sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'priceDesc' ? b.price - a.price : b.rating - a.rating))
  }, [type, gear, max, sort])
  const pct = ((max - 250) / (1400 - 250)) * 100

  return (
    <section id="fleet" className="wrap scroll-mt-20 pb-28 pt-24 sm:pt-32 lg:pb-40">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <motion.h2 variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="display text-5xl sm:text-7xl lg:text-8xl">
          The fleet
        </motion.h2>
        <p className="max-w-sm text-bone-dim lg:pb-2 lg:text-right">
          Every car under two years old, unlimited kilometres. Prices below are for your <strong className="font-semibold text-bone tnum">{days} day{days > 1 ? 's' : ''}</strong>.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-5 border-y border-bone/10 py-4 lg:flex-row lg:items-center lg:justify-between">
        <LayoutGroup id="types">
          <div className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0" role="radiogroup" aria-label="Car type">
            {types.map((t) => (
              <button key={t} role="radio" aria-checked={type === t} onClick={() => setType(t)} className={`relative min-h-[44px] whitespace-nowrap rounded-card px-4 text-sm font-medium transition-colors duration-150 ${type === t ? 'text-coal-950' : 'text-bone-dim hover:text-bone'}`}>
                {type === t && <motion.span layoutId="type-pill" className="absolute inset-0 rounded-card bg-bone" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center lg:flex lg:gap-8">
          <LayoutGroup id="gear">
            <div className="flex rounded-card border border-bone/15 p-1" role="radiogroup" aria-label="Transmission">
              {['Any', 'Manual', 'Automatic'].map((g) => (
                <button key={g} role="radio" aria-checked={gear === g} onClick={() => setGear(g)} className={`relative min-h-[36px] flex-1 rounded-[4px] px-3 text-xs font-medium transition-colors duration-150 ${gear === g ? 'text-bone' : 'text-bone-mute hover:text-bone'}`}>
                  {gear === g && <motion.span layoutId="gear-pill" className="absolute inset-0 rounded-[4px] bg-coal-700" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                  <span className="relative">{g}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <label className="block min-w-[200px]">
            <span className="flex justify-between text-xs text-bone-mute"><span>Up to</span><span className="tnum text-bone">{mad(max)} / day</span></span>
            <span className="relative mt-2 block h-6">
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-bone/15" />
              <span className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-signal-500" style={{ width: `${pct}%` }} />
              <input type="range" min={250} max={1400} step={50} value={max} onChange={(e) => setMax(+e.target.value)} aria-label="Maximum price per day" className="absolute inset-0 w-full cursor-pointer" />
            </span>
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort cars" className="field min-h-[44px] lg:w-44">
            <option value="price">Lowest price</option>
            <option value="priceDesc">Highest price</option>
            <option value="rating">Best reviewed</option>
          </select>
        </div>
      </div>

      <motion.ul layout className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c, i) => <CarCard key={c.id} car={c} days={days} index={i} />)}
        </AnimatePresence>
      </motion.ul>
      <AnimatePresence>
        {list.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 border-t border-bone/10 py-16">
            <p className="display-sm text-2xl">Nothing in the fleet matches that.</p>
            <p className="mt-2 text-bone-dim">Try a higher budget or another gearbox.</p>
            <button onClick={() => { setType('All'); setGear('Any'); setMax(1400) }} className="btn-ghost mt-6">Reset filters</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ------------------------------------------------------- Locations band */
function Locations() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])

  return (
    <section id="locations" ref={ref} className="relative scroll-mt-16 overflow-hidden bg-coal-950">
      <motion.img
        src="/photos/corniche-sunset.jpg"
        alt="Sunset over the marabout of Sidi Abderrahmane and the beach at Aïn Diab"
        width="1280"
        height="854"
        loading="lazy"
        decoding="async"
        style={{ y }}
        className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover object-[70%_50%]"
      />
      {/* column scrim on the copy side, the sunset on the right stays untouched */}
      <div aria-hidden="true" className="absolute inset-0 bg-coal-950/55 lg:bg-[linear-gradient(90deg,rgba(12,12,14,.94)_0%,rgba(12,12,14,.88)_40%,rgba(12,12,14,.2)_68%,transparent_85%)] lg:bg-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-coal-950 via-transparent to-coal-950 opacity-90" />

      <div className="wrap relative py-28 lg:py-40">
        <div className="max-w-xl">
          <motion.h2 variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="display text-4xl sm:text-6xl">
            Five places to collect your keys
          </motion.h2>
          <p className="mt-6 max-w-[46ch] text-bone/85">
            Show your licence and passport or CIN, walk round the car with us, sign on a tablet. Ten minutes, then you are on the road. Prefer your hotel or riad? We deliver anywhere in the city for {mad(150)}.
          </p>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="mt-12 border-t border-bone/20"
          >
            {locations.map((l) => (
              <motion.li key={l.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-bone/20 py-5">
                <h3 className="text-lg font-semibold">{l.name}</h3>
                <p className="tnum text-sm text-bone/85 sm:text-right">{l.hours}</p>
                <p className="col-span-2 text-sm text-bone-dim">{l.note}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------ Drive the city gallery */
const routes = [
  { img: '/photos/casa-street.jpg', w: 1280, h: 960, pos: '50% 50%', alt: 'Art-deco facades and tram rails on Boulevard Mohammed V', place: 'Boulevard Mohammed V', route: 'From Casa Port, 5 min', text: 'The 1930s art-deco spine of the city. Drive it early on a Sunday, before the tram and the cafés wake up.' },
  { img: '/photos/hero-mosque-sunset.jpg', w: 1280, h: 851, pos: '45% 50%', alt: 'Hassan II Mosque minaret over the ocean at dusk', place: 'Hassan II Mosque', route: 'From Casa Port, 10 min', text: 'Park on the esplanade side and walk out to the sea wall. Guided visits run outside prayer times.' },
  { img: '/photos/corniche-day.jpg', w: 1280, h: 850, pos: '50% 60%', alt: 'Palm trees and walkers on the Aïn Diab corniche promenade', place: 'La Corniche, Aïn Diab', route: 'From Maarif, 15 min', text: 'Five kilometres of promenade, beach clubs and grilled sardines. Our Aïn Diab desk is right here.' },
  { img: '/photos/corniche-sunset.jpg', w: 1280, h: 854, pos: '62% 50%', alt: 'The marabout of Sidi Abderrahmane on its rock at sunset', place: 'Sidi Abderrahmane', route: 'From Aïn Diab, 4 min', text: 'A shrine on a rock you can only reach at low tide. Come for the last twenty minutes of light.' },
]

function Frame({ r }) {
  return (
    <figure className="w-[78vw] shrink-0 snap-start sm:w-[56vw] md:w-[min(40vw,calc(62vh*0.8))]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-coal-850">
        <img src={r.img} alt={r.alt} width={r.w} height={r.h} loading="lazy" decoding="async" style={{ objectPosition: r.pos }} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <figcaption className="mt-5">
        <p className="label text-signal-400">{r.route}</p>
        <h3 className="display-sm mt-2 text-2xl">{r.place}</h3>
        <p className="mt-2 max-w-[40ch] text-sm text-bone-dim">{r.text}</p>
      </figcaption>
    </figure>
  )
}

function DriveTheCity() {
  const ref = useRef(null)
  const track = useRef(null)
  const reduce = useReducedMotion()
  const [dist, setDist] = useState(0)
  const [pinned, setPinned] = useState(true)

  useLayoutEffect(() => {
    const measure = () => {
      const wide = window.innerWidth >= 768 && !reduce
      setPinned(wide)
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [reduce])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist])

  const intro = (
    <div className="flex w-[78vw] shrink-0 flex-col justify-center sm:w-[44vw] lg:w-[30vw]">
      <h2 className="display text-5xl sm:text-6xl lg:text-7xl">Drive the city</h2>
      <p className="mt-6 max-w-[34ch] text-bone-dim">Four short drives we send every customer on. None of them is more than fifteen minutes from a DriveCasa desk.</p>
    </div>
  )

  if (!pinned) {
    return (
      <section aria-label="Drive the city" className="border-t border-bone/10 py-24">
        <div className="wrap">{intro}</div>
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-6">
          {routes.map((r) => <Frame key={r.place} r={r} />)}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} aria-label="Drive the city" className="relative border-t border-bone/10" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex items-center gap-8 pl-6 pr-[8vw] lg:gap-12 lg:pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
          {intro}
          {routes.map((r) => <Frame key={r.place} r={r} />)}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Pricing */
function Pricing() {
  const rows = [...cars].sort((a, b) => a.price - b.price)
  return (
    <section id="pricing" className="scroll-mt-16 bg-bone-paper text-coal-950">
      <div className="wrap py-24 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <motion.h2 variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="display text-4xl sm:text-6xl lg:text-7xl">
            The price is the price
          </motion.h2>
          <p className="max-w-[48ch] text-[#4A453E] lg:justify-self-end">
            Daily rates include third-party and collision cover, unlimited kilometres and roadside help around the clock. From seven days, 10% comes off the base rate automatically. Nothing is added at the counter.
          </p>
        </div>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
            <caption className="sr-only">Rental prices in Moroccan dirhams</caption>
            <thead>
              <tr className="border-b-2 border-coal-950 text-[#4A453E]">
                <th scope="col" className="label py-3 pr-4 font-medium">Car</th>
                <th scope="col" className="label py-3 pr-4 font-medium">Class</th>
                <th scope="col" className="label py-3 pr-4 text-right font-medium">Per day</th>
                <th scope="col" className="label py-3 pr-4 text-right font-medium">3 days</th>
                <th scope="col" className="label py-3 text-right font-medium">7 days, −10%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="group border-b border-bone-line transition-colors duration-150 hover:bg-[#E6DFD3]">
                  <th scope="row" className="py-4 pr-4 font-semibold">
                    <Link to={`/cars/${c.id}`} className="hover:underline">{c.name}</Link>
                  </th>
                  <td className="py-4 pr-4 text-[#4A453E]">{c.type} · {c.transmission}</td>
                  <td className="tnum py-4 pr-4 text-right font-semibold">{mad(c.price)}</td>
                  <td className="tnum py-4 pr-4 text-right">{mad(c.price * 3)}</td>
                  <td className="tnum py-4 text-right">{mad(c.price * 7 * 0.9)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="display-sm text-2xl">What you might add</h3>
            <p className="mt-3 max-w-[38ch] text-[#4A453E]">Only if you ask for it. Every extra is listed here at the same price you will see at checkout.</p>
          </div>
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {[...extras.map((e) => [e.name, `${mad(e.price)} / ${e.per}`]), ['One-way return', mad(ONE_WAY_FEE)], ['Refundable deposit', `${mad(DEPOSIT)}, card hold`]].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-bone-line py-3.5">
                <dt>{k}</dt>
                <dd className="tnum shrink-0 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- FAQ */
const faqs = [
  ['What do I need to pick up a car?', 'A driving licence held for at least two years, your passport or Moroccan CIN, and a card in the driver’s name for the deposit. International licences are accepted alongside a national one.'],
  ['How old do I have to be?', 'At least 21. There is no young-driver surcharge, but premium cars (C-Class, Evoque) need a driver aged 25 or over.'],
  ['Can I drive outside Casablanca?', 'Yes, anywhere in Morocco with unlimited kilometres. Tell us if you plan to take the Duster off tarmac so we can brief you on the 4x4 mode.'],
  ['What happens if my flight to CMN is late?', 'We track arriving flights and hold the car for you, at no charge, until the last arrival of the day.'],
  ['How does the deposit work?', `We place a hold of ${mad(DEPOSIT)} on your card at pick-up. It is released the day the car comes back, usually within three to seven working days depending on your bank.`],
  ['Can I cancel?', 'Free cancellation up to 48 hours before pick-up. Inside 48 hours we keep one day of rental, nothing more.'],
]

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="wrap scroll-mt-20 py-24 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="display text-4xl sm:text-6xl">Before you ask</h2>
          <p className="mt-6 max-w-[34ch] text-bone-dim">
            Anything else, call the Maarif office on <a href="tel:+212522000000" className="tnum text-bone underline">+212 522 00 00 00</a>. We answer in Darija, French, English and Spanish.
          </p>
        </div>
        <ul className="border-t border-bone/15">
          {faqs.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <li key={q} className="border-b border-bone/15">
                <h3>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} aria-controls={`faq-${i}`} className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left text-lg font-medium transition-colors duration-150 hover:text-white">
                    {q}
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-card border transition-colors duration-150 ${isOpen ? 'border-signal-500 bg-signal-500 text-white' : 'border-bone/20 text-bone-dim'}`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                      <p className="max-w-[60ch] pb-6 pr-12 text-bone-dim">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- Close */
function Close() {
  const featured = cars.find((c) => c.id === 'clio-5')
  return (
    <section className="relative overflow-hidden border-t border-bone/10">
      <div className="wrap grid items-center gap-10 py-24 lg:grid-cols-[1.1fr_1fr] lg:py-32">
        <div>
          <h2 className="display text-[2.4rem] sm:text-6xl lg:text-[4.1rem]">Land at 22:40.<br /><span className="text-signal-400">Drive at 22:50.</span></h2>
          <p className="mt-6 max-w-[44ch] text-bone-dim">The Airport CMN desk is open for every arrival. Book now, pay at pick-up, cancel free up to 48 hours before.</p>
          <Link to="/#fleet" className="btn-red mt-8 px-7">Book a car</Link>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-card">
          <img src={featured.photo} alt={`${featured.name} in orange`} width="1280" height="800" loading="lazy" decoding="async" style={{ objectPosition: featured.pos }} className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [hash])
  const toFleet = () => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <>
      <Hero onSearch={toFleet} />
      <Fleet />
      <Locations />
      <DriveTheCity />
      <Pricing />
      <Faq />
      <Close />
    </>
  )
}
