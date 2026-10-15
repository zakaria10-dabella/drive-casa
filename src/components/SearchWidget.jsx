import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { locations } from '../data/fleet'
import { daysBetween, useTrip } from '../context/TripContext'

export default function SearchWidget({ onSearch }) {
  const { trip, setTrip, today } = useTrip()
  const [draft, setDraft] = useState(trip)
  const [error, setError] = useState('')
  const days = daysBetween(draft.start, draft.end)
  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value, ...(k === 'pickup' && d.dropoff === d.pickup ? { dropoff: e.target.value } : {}) }))

  const submit = (e) => {
    e.preventDefault()
    if (draft.start < today) return setError('Pick-up date cannot be in the past.')
    if (draft.end <= draft.start) return setError('Return must be after pick-up.')
    setError('')
    setTrip(draft)
    onSearch?.()
  }

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      aria-label="Find a car"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="relative grid overflow-hidden rounded-card border border-bone/10 bg-coal-900 shadow-[0_1px_0_rgba(241,236,228,.06)_inset,0_30px_60px_-20px_rgba(0,0,0,.7)] sm:grid-cols-2 lg:grid-cols-[1.25fr_1.25fr_1fr_1fr_auto]"
    >
      <Field label="Pick-up">
        <select value={draft.pickup} onChange={set('pickup')} className="w-full truncate bg-transparent text-[15px] font-medium outline-none [&>option]:bg-coal-900">
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </Field>
      <Field label="Return">
        <select value={draft.dropoff} onChange={set('dropoff')} className="w-full truncate bg-transparent text-[15px] font-medium outline-none [&>option]:bg-coal-900">
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </Field>
      <Field label="From">
        <input type="date" min={today} value={draft.start} onChange={set('start')} className="w-full bg-transparent text-[15px] font-medium tnum outline-none [color-scheme:dark]" />
      </Field>
      <Field label="Until">
        <input type="date" min={draft.start} value={draft.end} onChange={set('end')} className="w-full bg-transparent text-[15px] font-medium tnum outline-none [color-scheme:dark]" />
      </Field>
      <div className="p-2 sm:col-span-2 lg:col-span-1">
        <button type="submit" className="btn-red h-full min-h-[60px] w-full px-7 text-[15px]">
          Show cars <span className="tnum font-normal text-white/80">{days} day{days > 1 ? 's' : ''}</span> <ArrowRight size={17} />
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alert" className="px-5 pb-3 text-sm font-medium text-signal-300 sm:col-span-2 lg:col-span-5">{error}</motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

function Field({ label, children }) {
  return (
    <label className="block border-b border-bone/10 px-5 py-3.5 transition-colors duration-150 focus-within:bg-coal-800 hover:bg-coal-850 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r">
      <span className="label block text-bone-mute">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  )
}
