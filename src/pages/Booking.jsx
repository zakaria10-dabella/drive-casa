import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react'
import { cars, extras, locations, mad } from '../data/fleet'
import { quote, useTrip } from '../context/TripContext'

const steps = ['Trip', 'Extras', 'Driver', 'Review']
const variants = {
  enter: (d) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -40 }),
}

function validateDriver(d) {
  const e = {}
  if (d.name.trim().split(/\s+/).length < 2) e.name = 'First and last name, as on your licence.'
  if (!/^(\+212|0)[5-7]\d{8}$/.test(d.phone.replace(/[\s.-]/g, ''))) e.phone = 'Moroccan number, e.g. 06 61 23 45 67.'
  if (!(+d.age >= 21 && +d.age <= 85)) e.age = 'Drivers must be at least 21.'
  if (!(+d.licence >= 2)) e.licence = 'At least 2 years of driving licence required.'
  return e
}

export default function Booking() {
  const { id } = useParams()
  const car = cars.find((c) => c.id === id)
  const { trip, setTrip, today } = useTrip()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [selected, setSelected] = useState(['insurance'])
  const [driver, setDriver] = useState({ name: '', phone: '', age: '', licence: '' })
  const [tried, setTried] = useState(false)
  const [confirmed, setConfirmed] = useState(null)

  if (!car) return <Navigate to="/" replace />
  const q = quote(car, trip, selected)
  const errors = validateDriver(driver)
  const tripError = trip.start < today ? 'Pick-up date cannot be in the past.' : trip.end <= trip.start ? 'Return must be after pick-up.' : ''

  const go = (to) => {
    if (to > step) {
      if (step === 0 && tripError) return setTried(true)
      if (step === 2 && Object.keys(errors).length) return setTried(true)
    }
    setTried(false)
    setDir(to > step ? 1 : -1)
    setStep(to)
  }
  const toggle = (eid) => setSelected((s) => (s.includes(eid) ? s.filter((x) => x !== eid) : [...s, eid]))

  if (confirmed) return <Confirmation car={car} q={q} driver={driver} trip={trip} code={confirmed} />

  return (
    <div className="wrap pb-24 pt-24 lg:pt-28">
      <Link to={`/cars/${car.id}`} className="inline-flex min-h-[44px] items-center gap-2 text-sm text-bone-dim hover:text-bone"><ArrowLeft size={16} /> {car.name}</Link>
      <h1 className="display mt-4 text-4xl sm:text-6xl">Book the {car.name.split(' ').slice(1).join(' ') || car.name}</h1>

      <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-4" role="list" aria-label="Booking steps">
        {steps.map((s, i) => (
          <button key={s} role="listitem" onClick={() => i < step && go(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined} className="min-h-[44px] text-left disabled:cursor-default">
            <div className="h-0.5 overflow-hidden bg-bone/15">
              <motion.div className="h-full bg-signal-500" initial={false} animate={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} />
            </div>
            <span className={`mt-3 flex items-center gap-1.5 text-xs font-medium sm:text-sm ${i <= step ? 'text-bone' : 'text-bone-mute'}`}>
              {i < step ? <Check size={13} className="text-signal-400" /> : <span className="tnum">{i + 1}.</span>} {s}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="min-h-[380px] overflow-hidden">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              {step === 0 && (
                <div className="grid gap-4 rounded-card border border-bone/10 bg-coal-900 p-5 sm:grid-cols-2 sm:p-7">
                  <Field label="Pick-up location">
                    <select className="field" value={trip.pickup} onChange={(e) => setTrip({ ...trip, pickup: e.target.value })}>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
                  </Field>
                  <Field label="Return location">
                    <select className="field" value={trip.dropoff} onChange={(e) => setTrip({ ...trip, dropoff: e.target.value })}>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
                  </Field>
                  <Field label="Pick-up date"><input type="date" min={today} className="field" value={trip.start} onChange={(e) => setTrip({ ...trip, start: e.target.value })} /></Field>
                  <Field label="Return date"><input type="date" min={trip.start} className="field" value={trip.end} onChange={(e) => setTrip({ ...trip, end: e.target.value })} /></Field>
                  <Field label="Pick-up time">
                    <select className="field" value={trip.time} onChange={(e) => setTrip({ ...trip, time: e.target.value })}>{['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((t) => <option key={t}>{t}</option>)}</select>
                  </Field>
                  <AnimatePresence>
                    {trip.pickup !== trip.dropoff && (
                      <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 self-end rounded-card border border-signal-400/40 p-3 text-sm text-bone">
                        <Info size={15} className="mt-0.5 shrink-0 text-signal-400" /> One-way rental: a {mad(300)} fee applies.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {tried && tripError && <p role="alert" className="text-sm font-medium text-signal-300 sm:col-span-2">{tripError}</p>}
                </div>
              )}
              {step === 1 && (
                <ul className="grid gap-3">
                  {extras.map((e) => {
                    const on = selected.includes(e.id)
                    return (
                      <li key={e.id}>
                        <motion.button whileTap={{ scale: 0.98 }} onClick={() => toggle(e.id)} aria-pressed={on} className={`flex min-h-[72px] w-full items-center gap-4 rounded-card border bg-coal-900 p-4 text-left transition-colors duration-150 ${on ? 'border-signal-500' : 'border-bone/10 hover:border-bone/30'}`}>
                          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-[4px] border ${on ? 'border-signal-500 bg-signal-500' : 'border-bone/30'}`}>
                            <AnimatePresence>{on && <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Check size={14} className="text-white" strokeWidth={3} /></motion.span>}</AnimatePresence>
                          </span>
                          <span className="flex-1">
                            <span className="block font-semibold">{e.name}</span>
                            <span className="text-sm text-bone-dim">{e.note}</span>
                          </span>
                          <span className="tnum text-right text-sm font-semibold">{mad(e.price)}<span className="block text-xs font-normal text-bone-mute">/ {e.per}</span></span>
                        </motion.button>
                      </li>
                    )
                  })}
                </ul>
              )}
              {step === 2 && (
                <div className="grid gap-4 rounded-card border border-bone/10 bg-coal-900 p-5 sm:grid-cols-2 sm:p-7">
                  <Field label="Full name" error={tried && errors.name}><input className="field" value={driver.name} onChange={(e) => setDriver({ ...driver, name: e.target.value })} placeholder="Mehdi Benjelloun" autoComplete="name" /></Field>
                  <Field label="Phone" error={tried && errors.phone}><input className="field" value={driver.phone} onChange={(e) => setDriver({ ...driver, phone: e.target.value })} placeholder="06 61 23 45 67" inputMode="tel" autoComplete="tel" /></Field>
                  <Field label="Driver age" error={tried && errors.age}><input className="field" type="number" min="18" value={driver.age} onChange={(e) => setDriver({ ...driver, age: e.target.value })} placeholder="29" /></Field>
                  <Field label="Years with licence" error={tried && errors.licence}><input className="field" type="number" min="0" value={driver.licence} onChange={(e) => setDriver({ ...driver, licence: e.target.value })} placeholder="5" /></Field>
                  <p className="text-sm text-bone-dim sm:col-span-2">Bring your licence and passport or CIN at pick-up. A refundable deposit of {mad(q.deposit)} is blocked on a card.</p>
                </div>
              )}
              {step === 3 && (
                <div className="rounded-card border border-bone/10 bg-coal-900 p-5 sm:p-7">
                  <dl className="divide-y divide-bone/10 text-sm">
                    {[
                      ['Car', `${car.name} · ${car.transmission}`],
                      ['Pick-up', `${locations.find((l) => l.id === trip.pickup).name}, ${trip.start} at ${trip.time}`],
                      ['Return', `${locations.find((l) => l.id === trip.dropoff).name}, ${trip.end}`],
                      ['Driver', `${driver.name} · ${driver.phone}`],
                      ['Extras', q.lines.length ? q.lines.map((l) => l.name).join(', ') : 'None'],
                    ].map(([k, v], i) => (
                      <motion.div key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6">
                        <dt className="text-bone-mute">{k}</dt>
                        <dd className="font-medium sm:text-right">{v}</dd>
                      </motion.div>
                    ))}
                  </dl>
                  <p className="mt-4 text-xs text-bone-mute">Demo booking: no payment is taken. Free cancellation up to 48 h before pick-up.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            {step > 0 ? <button onClick={() => go(step - 1)} className="btn-ghost"><ArrowLeft size={16} /> Back</button> : <span />}
            {step < steps.length - 1 ? (
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => go(step + 1)} className="btn-bone">Continue <ArrowRight size={16} /></motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setConfirmed(`DC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="btn-red">Confirm booking · {mad(q.total)}</motion.button>
            )}
          </div>
        </div>

        <aside className="h-fit overflow-hidden rounded-card border border-bone/10 bg-coal-900 lg:sticky lg:top-24">
          <div className="relative aspect-[16/10] bg-coal-850"><img src={car.photo} alt={`${car.name}, ${car.year}`} width="1280" height="800" decoding="async" style={{ objectPosition: car.pos }} className="absolute inset-0 h-full w-full object-cover" /></div>
          <div className="p-6 sm:p-7">
          <p className="display-sm text-xl">{car.name}</p>
          <p className="tnum mt-1 text-sm text-bone-dim">{q.days} day{q.days > 1 ? 's' : ''} · {trip.start} → {trip.end}</p>
          <div className="mt-5 space-y-2 text-sm text-bone-dim">
            <Row label={`${mad(car.price)} × ${q.days} days`} value={mad(q.base)} />
            <AnimatePresence initial={false}>
              {q.lines.map((l) => (
                <motion.div key={l.id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <Row label={l.per === 'day' ? `${l.name} × ${q.days}` : l.name} value={mad(l.total)} />
                </motion.div>
              ))}
              {q.oneWay > 0 && (
                <motion.div key="oneway" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><Row label="One-way fee" value={mad(q.oneWay)} /></motion.div>
              )}
              {q.discount > 0 && (
                <motion.div key="disc" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><Row label="Weekly rate, −10%" value={`−${mad(q.discount)}`} /></motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex items-end justify-between border-t border-bone/10 pt-4">
            <span>Total</span>
            <motion.span key={q.total} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="tnum display-sm text-3xl">{mad(q.total)}</motion.span>
          </div>
          <p className="mt-2 text-xs text-bone-mute">Refundable deposit {mad(q.deposit)} · Unlimited km · Insurance included</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return <p className="flex justify-between gap-4 py-0.5"><span>{label}</span><span className="tnum shrink-0 text-bone">{value}</span></p>
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="lbl">{label}</span>
      {children}
      <AnimatePresence>
        {error && <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} role="alert" className="block overflow-hidden pt-1.5 text-xs font-medium text-signal-300">{error}</motion.span>}
      </AnimatePresence>
    </label>
  )
}

function Confirmation({ car, q, driver, trip, code }) {
  const ease = [0.23, 1, 0.32, 1]
  return (
    <div className="wrap grid min-h-[86vh] items-center gap-12 pb-20 pt-28 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="label flex items-center gap-2 text-signal-400"><Check size={14} /> Booking confirmed</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease }} className="display mt-5 text-5xl sm:text-7xl">See you soon, {driver.name.split(' ')[0]}.</motion.h1>
        <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-10 grid max-w-md grid-cols-2 gap-y-5 border-t border-bone/10 pt-6 text-sm">
          <dt className="text-bone-mute">Reference</dt><dd className="tnum font-semibold">{code}</dd>
          <dt className="text-bone-mute">Car</dt><dd>{car.name}</dd>
          <dt className="text-bone-mute">Pick-up</dt><dd>{new Date(trip.start + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, {trip.time}</dd>
          <dt className="text-bone-mute">Total</dt><dd className="tnum font-semibold">{mad(q.total)}, {q.days} day{q.days > 1 ? 's' : ''}</dd>
        </motion.dl>
        <p className="mt-6 max-w-md text-sm text-bone-dim">We will text {driver.phone} with the exact pick-up point the day before.</p>
        <Link to="/" className="btn-ghost mt-8">Back to home</Link>
      </div>
      <motion.div initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }} transition={{ delay: 0.3, duration: 1, ease }} className="relative aspect-[16/10] overflow-hidden rounded-card">
        <img src={car.photo} alt={`${car.name}, ${car.year}`} width="1280" height="800" decoding="async" style={{ objectPosition: car.pos }} className="absolute inset-0 h-full w-full object-cover" />
      </motion.div>
    </div>
  )
}
