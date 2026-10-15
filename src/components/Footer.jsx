import { Link } from 'react-router-dom'
import { Logo } from './Navbar'
import credits from '../../public/photos/credits.json'

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-coal-950">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm text-bone-dim">Car rental in Casablanca. Airport, both train stations, Maarif, Aïn Diab, or delivered to your door. Seven days a week.</p>
          <dl className="mt-8 grid max-w-sm grid-cols-2 gap-6 text-sm">
            <div><dt className="label text-bone-mute">Phone</dt><dd className="mt-1.5 tnum"><a href="tel:+212522000000" className="hover:underline">+212 522 00 00 00</a></dd></div>
            <div><dt className="label text-bone-mute">Office</dt><dd className="mt-1.5">Bd Zerktouni, Maarif</dd></div>
          </dl>
          <p className="mt-10 text-xs text-bone-mute">Concept project by Zakaria Dabella, 2026. Bookings are a demo, no payment is taken. <Link to="/#fleet" className="underline hover:text-bone">See the fleet</Link></p>
        </div>
        <div id="credits">
          <h2 className="label text-bone-mute">Photo credits</h2>
          <p className="mt-2 text-xs text-bone-mute">All photographs via Wikimedia Commons. Licences as listed, images resized and cropped.</p>
          <ul className="mt-5 grid gap-x-8 gap-y-2 text-xs text-bone-dim sm:grid-cols-2">
            {credits.map((c) => (
              <li key={c.file} className="truncate">
                <a href={c.source} target="_blank" rel="noreferrer" className="hover:text-bone hover:underline" title={c.title}>
                  {c.file.replace('photos/', '').replace('.jpg', '')}
                </a>{' '}
                <span className="text-bone-mute">{c.author}, {c.license}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
