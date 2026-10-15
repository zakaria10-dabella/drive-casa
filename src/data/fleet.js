export const types = ['All', 'City', 'Economy', 'Sedan', 'SUV', 'Premium']

export const locations = [
  { id: 'cmn', name: 'Mohammed V Airport (CMN)', short: 'Airport CMN' },
  { id: 'voyageurs', name: 'Casa Voyageurs station', short: 'Casa Voyageurs' },
  { id: 'port', name: 'Casa Port station', short: 'Casa Port' },
  { id: 'maarif', name: 'Maarif office, Bd Zerktouni', short: 'Maarif' },
  { id: 'aindiab', name: 'Aïn Diab, La Corniche', short: 'Aïn Diab' },
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

const car = (o) => o
export const cars = [
  car({ id: 'dacia-logan', name: 'Dacia Logan', type: 'Economy', body: 'sedan', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 4, bags: 3, price: 250, year: 2024, consumption: '4.4 L/100 km', color: '#E8E9EC', rating: 4.6, trips: 412, features: ['Air conditioning', 'Bluetooth', 'Cruise control', 'USB charging'] }),
  car({ id: 'fiat-500', name: 'Fiat 500 Hybrid', type: 'City', body: 'hatch', transmission: 'Manual', fuel: 'Hybrid', seats: 4, doors: 3, bags: 1, price: 280, year: 2024, consumption: '4.1 L/100 km', color: '#F2C6C2', rating: 4.7, trips: 198, features: ['Air conditioning', 'Apple CarPlay', 'Panoramic roof', 'Park assist'] }),
  car({ id: 'clio-5', name: 'Renault Clio 5', type: 'City', body: 'hatch', transmission: 'Manual', fuel: 'Petrol', seats: 5, doors: 5, bags: 2, price: 300, year: 2025, consumption: '5.2 L/100 km', color: '#D7263D', rating: 4.8, trips: 356, features: ['Air conditioning', 'Android Auto', 'Rear camera', 'Lane assist'] }),
  car({ id: 'peugeot-208', name: 'Peugeot 208', type: 'Economy', body: 'hatch', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, bags: 2, price: 380, year: 2025, consumption: '5.4 L/100 km', color: '#2E5BFF', rating: 4.8, trips: 287, features: ['3D i-Cockpit', 'Apple CarPlay', 'Climate control', 'Keyless start'] }),
  car({ id: 'duster', name: 'Dacia Duster', type: 'SUV', body: 'suv', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 5, bags: 4, price: 450, year: 2024, consumption: '5.3 L/100 km', color: '#C9A26B', rating: 4.7, trips: 520, features: ['4x4 mode', 'Hill descent control', 'Roof bars', 'Rear camera'] }),
  car({ id: 'corolla', name: 'Toyota Corolla Hybrid', type: 'Sedan', body: 'sedan', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, doors: 4, bags: 3, price: 520, year: 2025, consumption: '4.0 L/100 km', color: '#3A3F4B', rating: 4.9, trips: 233, features: ['Adaptive cruise', 'Heated seats', 'Apple CarPlay', 'Lane keeping'] }),
  car({ id: 'tucson', name: 'Hyundai Tucson', type: 'SUV', body: 'suv', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, doors: 5, bags: 4, price: 650, year: 2025, consumption: '5.6 L/100 km', color: '#F5F6F8', rating: 4.8, trips: 174, features: ['Panoramic roof', 'Wireless charging', '360° camera', 'Ventilated seats'] }),
  car({ id: 'c-class', name: 'Mercedes C-Class', type: 'Premium', body: 'sedan', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 4, bags: 3, price: 1100, year: 2025, consumption: '5.0 L/100 km', color: '#0B1120', rating: 4.9, trips: 96, features: ['MBUX voice assistant', 'Ambient lighting', 'Leather seats', 'Burmester sound'] }),
  car({ id: 'evoque', name: 'Range Rover Evoque', type: 'Premium', body: 'suv', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, bags: 3, price: 1400, year: 2024, consumption: '7.6 L/100 km', color: '#5E6B5A', rating: 4.9, trips: 71, features: ['Terrain response', 'Meridian sound', 'Head-up display', 'Matrix LED lights'] }),
]

export const mad = (n) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MAD`
