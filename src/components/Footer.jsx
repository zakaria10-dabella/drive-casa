import { Logo } from './Navbar'

export default function Footer() {
  return (
    <footer className="mt-24 bg-night-900 text-white">
      <div className="wrap flex flex-col gap-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo light />
          <p className="mt-3 max-w-sm text-sm text-white/55">Car rental in Casablanca since 2016. Airport, train stations and door-to-door delivery, 7 days a week.</p>
        </div>
        <p className="text-sm text-white/45">Concept project by Zakaria Dabella · © 2026</p>
      </div>
    </footer>
  )
}
