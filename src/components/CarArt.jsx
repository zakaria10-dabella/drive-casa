import { profiles, toPath } from '../data/profiles'

/** Side-view car drawn from the shared profiles, recoloured per vehicle. */
export default function CarArt({ body = 'hatch', color = '#D7263D', className = '', shadow = true }) {
  const p = profiles[body]
  const light = isLight(color)
  return (
    <svg viewBox="20 30 370 140" className={className} aria-hidden="true">
      {shadow && <ellipse cx="203" cy="156" rx="170" ry="8" fill="#0B1120" opacity=".18" />}
      <path d={toPath(p.body) + ' Z'} fill={color} stroke={light ? 'rgba(11,17,32,.18)' : 'none'} strokeWidth="1.5" />
      <path d={toPath(p.body) + ' Z'} fill="url(#sheen)" />
      <path d={toPath(p.windows)} fill="#1A2236" />
      <path d={toPath(p.windows)} fill="url(#glass)" opacity=".7" />
      <rect x={p.pillar} y="50" width="7" height="44" fill={color} />
      <path d={`M${p.pillar + 3} 94 L${p.pillar + 1} 124`} stroke="#0B1120" strokeOpacity=".25" strokeWidth="1.5" />
      <path d="M128 96 L124 124" stroke="#0B1120" strokeOpacity=".2" strokeWidth="1.5" />
      <rect x={p.pillar - 30} y="101" width="14" height="4" rx="2" fill="#0B1120" opacity=".3" />
      <rect x={p.pillar + 18} y="101" width="14" height="4" rx="2" fill="#0B1120" opacity=".3" />
      <path d="M44 108 L330 104" stroke="#fff" strokeOpacity={light ? 0.6 : 0.18} strokeWidth="2" />
      <rect x="352" y="98" width="14" height="7" rx="3" fill="#FFF6D6" />
      <rect x="38" y="100" width="9" height="8" rx="2" fill="#D7263D" stroke="#7a0f1d" strokeWidth="1" />
      {[100, 300].map((x) => (
        <g key={x}>
          <circle cx={x} cy="126" r="27" fill="#11151F" />
          <circle cx={x} cy="126" r="16" fill="#C9CED8" />
          <circle cx={x} cy="126" r="16" fill="none" stroke="#8C93A3" strokeWidth="3" strokeDasharray="4 4" />
          <circle cx={x} cy="126" r="5" fill="#5A6070" />
        </g>
      ))}
      <defs>
        <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FB3FF" stopOpacity=".5" />
          <stop offset=".5" stopColor="#8FB3FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function isLight(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return (r * 299 + g * 587 + b * 114) / 1000 > 200
}
