import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-3 text-white shadow-2xl backdrop-blur-2xl sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto] lg:p-2"
      noValidate
    >
      <Field icon={MapPin} label="Pick-up">
        <select value={draft.pickup} onChange={set('pickup')} className="w-full bg-transparent text-sm font-semibold outline-none [&>option]:text-night-900">
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </Field>
      <Field icon={MapPin} label="Return">
        <select value={draft.dropoff} onChange={set('dropoff')} className="w-full bg-transparent text-sm font-semibold outline-none [&>option]:text-night-900">
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </Field>
      <Field icon={CalendarDays} label="From">
        <input type="date" min={today} value={draft.start} onChange={set('start')} className="w-full bg-transparent text-sm font-semibold outline-none [color-scheme:dark]" />
      </Field>
      <Field icon={CalendarDays} label="Until">
        <input type="date" min={draft.start} value={draft.end} onChange={set('end')} className="w-full bg-transparent text-sm font-semibold outline-none [color-scheme:dark]" />
      </Field>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="btn-red h-full min-h-[56px] rounded-2xl px-6 sm:col-span-2 lg:col-span-1">
        Search <span className="rounded-lg bg-white/20 px-2 py-0.5 text-xs tnum">{days} day{days > 1 ? 's' : ''}</span> <ArrowRight size={16} />
      </motion.button>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="absolute -bottom-8 left-4 text-xs font-semibold text-casa-400">{error}</motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-2.5 transition-colors focus-within:bg-white/[0.12] hover:bg-white/[0.1]">
      <Icon size={18} className="shrink-0 text-casa-400" />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">{label}</span>
        {children}
      </span>
    </label>
  )
}
