import { createContext, useContext, useMemo, useState } from 'react'
import { DEPOSIT, extras as EXTRAS, ONE_WAY_FEE } from '../data/fleet'

const Ctx = createContext(null)
export const useTrip = () => useContext(Ctx)

const iso = (d) => d.toISOString().slice(0, 10)
const plus = (n) => iso(new Date(Date.now() + n * 86400000))

export function daysBetween(a, b) {
  const d = Math.round((new Date(b) - new Date(a)) / 86400000)
  return Number.isFinite(d) ? Math.max(1, d) : 1
}

export function quote(car, trip, selected = []) {
  const days = daysBetween(trip.start, trip.end)
  const base = car.price * days
  const lines = EXTRAS.filter((e) => selected.includes(e.id)).map((e) => ({ ...e, total: e.per === 'day' ? e.price * days : e.price }))
  const oneWay = trip.pickup !== trip.dropoff ? ONE_WAY_FEE : 0
  // weekly discount: 10% off the base rate from 7 days
  const discount = days >= 7 ? Math.round(base * 0.1) : 0
  const total = base + lines.reduce((s, l) => s + l.total, 0) + oneWay - discount
  return { days, base, lines, oneWay, discount, total, deposit: DEPOSIT }
}

export function TripProvider({ children }) {
  const [trip, setTrip] = useState({ pickup: 'cmn', dropoff: 'cmn', start: plus(1), end: plus(5), time: '10:00' })
  const value = useMemo(() => ({ trip, setTrip, today: plus(0) }), [trip])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
