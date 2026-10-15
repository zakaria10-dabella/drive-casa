# Drive Casa — Car Rental

> A premium car-rental experience for Casablanca: spin a real-time 3D car on a turntable, filter the fleet with animated controls, and book in four smooth steps with transparent prices in MAD.

![Drive Casa desktop screenshot](docs/screenshot.png)

<p align="center"><img src="docs/mobile.png" alt="Drive Casa on mobile" width="300" /></p>

## Features

- **3D turntable hero**: a car body extruded from hand-drawn side profiles (hatch, sedan, SUV) with clearcoat paint, glass, emissive lights and spinning wheels, built entirely from procedural geometry in React Three Fiber. Switch body styles and paint colours live, drag to spin, and watch it rotate as you scroll. It is lazy-loaded, capped at DPR 2, and falls back gracefully without WebGL.
- **Glass search widget**: pick-up and return locations (airport, train stations, Maarif, Aïn Diab), with date validation and a live day counter.
- **Fleet explorer** with nine realistic cars: animated type tabs (`layoutId`), a transmission segmented control, a price-range slider, sorting, a layout-animated grid and an empty state.
- **Car detail page** with specs, features, rating and a price card with the live quote.
- **Four-step booking flow** (Trip, Extras, Driver, Review): direction-aware slide transitions, extras toggles, driver validation (age, licence, Moroccan phone), and a live summary with a 10% weekly discount, one-way fee and deposit.
- **Confirmation screen** with an animated check and a booking code.
- Clip-path page transitions between routes, magnetic buttons, staggered headline and parallax hero.
- Responsive down to 375px. Respects `prefers-reduced-motion`.

## Tech stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r170-000000?logo=threedotjs&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-8-000000?logo=react&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

`vercel.json` rewrites all routes to `index.html`, so deep links like `/cars/clio-5` work when deployed on Vercel.

## Project structure

```
src/
├── components/
│   ├── Navbar.jsx        # logo, links, CTA
│   ├── SearchWidget.jsx  # locations + dates with validation
│   ├── CarCard.jsx       # fleet card + shared specs row
│   ├── CarArt.jsx        # SVG car illustration from shared profiles
│   ├── Magnetic.jsx      # magnetic hover wrapper
│   └── Footer.jsx
├── context/TripContext.jsx  # trip state + quote() pricing logic
├── data/
│   ├── fleet.js          # cars, locations, extras, MAD formatter
│   └── profiles.js       # hatch / sedan / suv side profiles
├── pages/
│   ├── Home.jsx          # hero, 3D turntable, how it works, fleet
│   ├── CarDetail.jsx
│   └── Booking.jsx       # 4-step flow + confirmation
├── three/
│   ├── Car3D.jsx         # extruded car, turntable, lighting, camera rig
│   └── webgl.js
├── App.jsx               # routes + page transitions
└── main.jsx
```

## Design notes

**Palette**: deep night blue (`#0B1120`) gives the hero a showroom feel at night, and Casablanca red (`#D7263D`) is used for the brand, CTAs and the turntable ring. Inner pages switch to a light porcelain surface (`#F5F6F8`) so prices and forms stay easy to read.

**Typography**: [Syne](https://fonts.google.com/specimen/Syne) at extra-bold gives the wide, automotive-poster headline. [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) keeps forms, specs and prices clean at small sizes.

**One source of truth for shapes**: the same side-profile paths draw the SVG illustrations on the cards and are extruded into the 3D bodies, so the 2D and 3D cars always match.

**Motion**:
- The hero car turns slowly on its own and keeps turning as you scroll, while the hero text drifts with parallax.
- Booking steps slide in the direction of travel (forward or back), and the progress bar fills with a spring.
- Route changes use a clip-path wipe, and quote lines such as the weekly discount animate in and out of the summary.
- On confirmation, the check pops in and the booked car drives into frame.

## Author

**Zakaria Dabella**: UI/UX designer and web developer based in Casablanca, Morocco.

- Portfolio: [zakaria-dabella-portfolio.vercel.app](https://zakaria-dabella-portfolio.vercel.app/)
- GitHub: [@zakaria10-dabella](https://github.com/zakaria10-dabella)

## License

[MIT](LICENSE) © 2026 Zakaria Dabella
