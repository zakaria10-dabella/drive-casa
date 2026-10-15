export const types = ['All', 'City', 'Economy', 'Sedan', 'SUV', 'Premium']

export const locations = [
  { id: 'cmn', name: 'Mohammed V Airport (CMN)', short: 'Airport CMN', note: 'Arrivals hall, Terminal 1 and 2. Every flight, day and night.', hours: '24 h' },
  { id: 'voyageurs', name: 'Casa Voyageurs station', short: 'Casa Voyageurs', note: 'Off the Al Boraq platform, car park level -1.', hours: '06:00 to 23:00' },
  { id: 'port', name: 'Casa Port station', short: 'Casa Port', note: 'Next to the tram stop, five minutes from the medina.', hours: '07:00 to 22:00' },
  { id: 'maarif', name: 'Maarif office, Bd Zerktouni', short: 'Maarif', note: 'Our main office. Coffee while we check the car with you.', hours: '08:00 to 20:00' },
  { id: 'aindiab', name: 'Aïn Diab, La Corniche', short: 'Aïn Diab', note: 'Boulevard de la Corniche, opposite the beach clubs.', hours: '09:00 to 21:00' },
]

export const extras = [
  { id: 'insurance', name: 'Full coverage insurance', note: 'Zero deductible, glass and tyres included', price: 120, per: 'day' },
  { id: 'driver2', name: 'Additional driver', note: 'Share the wheel on long drives', price: 60, per: 'day' },
  { id: 'child', name: 'Child seat', note: 'ISOFIX, 9–18 kg', price: 40, per: 'day' },
  { id: 'gps', name: 'GPS + 4G hotspot', note: 'Unlimited data across Morocco', price: 35, per: 'day' },
  { id: 'delivery', name: 'Delivery to your address', note: 'Anywhere in Casablanca', price: 150, per: 'trip' },
]

export const ONE_WAY_FEE = 300
export const DEPOSIT = 5000

const car = (o) => ({ ...o, photo: `/photos/${o.id}.jpg` })
export const cars = [
  car({ id: 'dacia-logan', pos: '50% 62%', blurb: 'The car most of Casablanca drives. Frugal diesel, a boot that swallows three suitcases, and nobody looks twice at it in Derb Sultan.', name: 'Dacia Logan', type: 'Economy', body: 'sedan', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 4, bags: 3, price: 250, year: 2024, consumption: '4.4 L/100 km', color: '#E8E9EC', rating: 4.6, trips: 412, features: ['Air conditioning', 'Bluetooth', 'Cruise control', 'USB charging'] }),
  car({ id: 'fiat-500', pos: '50% 58%', blurb: 'Two doors, a glass roof and a turning circle made for the lanes of the old medina. Parks where nothing else fits in Maarif.', name: 'Fiat 500 Hybrid', type: 'City', body: 'hatch', transmission: 'Manual', fuel: 'Hybrid', seats: 4, doors: 3, bags: 1, price: 280, year: 2024, consumption: '4.1 L/100 km', color: '#F2C6C2', rating: 4.7, trips: 198, features: ['Air conditioning', 'Apple CarPlay', 'Panoramic roof', 'Park assist'] }),
  car({ id: 'clio-5', pos: '58% 70%', blurb: 'Our most booked city car. Light steering for Gauthier traffic, Android Auto, and a rear camera for tight Anfa driveways.', name: 'Renault Clio 5', type: 'City', body: 'hatch', transmission: 'Manual', fuel: 'Petrol', seats: 5, doors: 5, bags: 2, price: 300, year: 2025, consumption: '5.2 L/100 km', color: '#D7263D', rating: 4.8, trips: 356, features: ['Air conditioning', 'Android Auto', 'Rear camera', 'Lane assist'] }),
  car({ id: 'peugeot-208', pos: '45% 55%', blurb: 'An automatic small car, which is rarer here than you think. Easy in stop-start traffic on Boulevard Zerktouni.', name: 'Peugeot 208', type: 'Economy', body: 'hatch', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, bags: 2, price: 380, year: 2025, consumption: '5.4 L/100 km', color: '#2E5BFF', rating: 4.8, trips: 287, features: ['3D i-Cockpit', 'Apple CarPlay', 'Climate control', 'Keyless start'] }),
  car({ id: 'duster', pos: '50% 55%', blurb: 'Locked 4x4 when you need it. Built for the coast road to El Jadida and the piste beyond Bouskoura forest.', name: 'Dacia Duster', type: 'SUV', body: 'suv', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 5, bags: 4, price: 450, year: 2024, consumption: '5.3 L/100 km', color: '#C9A26B', rating: 4.7, trips: 520, features: ['4x4 mode', 'Hill descent control', 'Roof bars', 'Rear camera'] }),
  car({ id: 'corolla', pos: '64% 50%', blurb: 'Quiet hybrid saloon for the A3 to Rabat. Adaptive cruise and around 4 L/100 km on the motorway.', name: 'Toyota Corolla Hybrid', type: 'Sedan', body: 'sedan', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, doors: 4, bags: 3, price: 520, year: 2025, consumption: '4.0 L/100 km', color: '#3A3F4B', rating: 4.9, trips: 233, features: ['Adaptive cruise', 'Heated seats', 'Apple CarPlay', 'Lane keeping'] }),
  car({ id: 'tucson', pos: '46% 55%', blurb: 'Room for a family and the luggage from CMN. Panoramic roof, 360° camera and a calm hybrid drivetrain.', name: 'Hyundai Tucson', type: 'SUV', body: 'suv', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, doors: 5, bags: 4, price: 650, year: 2025, consumption: '5.6 L/100 km', color: '#F5F6F8', rating: 4.8, trips: 174, features: ['Panoramic roof', 'Wireless charging', '360° camera', 'Ventilated seats'] }),
  car({ id: 'c-class', pos: '44% 52%', blurb: 'For the client meeting in Casa Finance City, or the wedding in Anfa. Leather, Burmester sound, delivered to your door.', name: 'Mercedes C-Class', type: 'Premium', body: 'sedan', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 4, bags: 3, price: 1100, year: 2025, consumption: '5.0 L/100 km', color: '#0B1120', rating: 4.9, trips: 96, features: ['MBUX voice assistant', 'Ambient lighting', 'Leather seats', 'Burmester sound'] }),
  car({ id: 'evoque', pos: '50% 55%', blurb: 'The weekend car. Terrain Response for the Atlas foothills, Meridian sound for the Corniche at night.', name: 'Range Rover Evoque', type: 'Premium', body: 'suv', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, bags: 3, price: 1400, year: 2024, consumption: '7.6 L/100 km', color: '#5E6B5A', rating: 4.9, trips: 71, features: ['Terrain response', 'Meridian sound', 'Head-up display', 'Matrix LED lights'] }),
]

export const mad = (n) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MAD`
