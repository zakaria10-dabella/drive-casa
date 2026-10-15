/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        coal: { 950: '#0C0C0E', 900: '#131316', 850: '#18181C', 800: '#1E1E23', 700: '#2B2B31', 600: '#3A3A42' },
        bone: { DEFAULT: '#F1ECE4', dim: '#BDB7AD', mute: '#948E85', paper: '#EEE8DE', line: '#D9D2C6' },
        signal: { 300: '#FF7A6E', 400: '#FF5A4E', 500: '#E0362E', 600: '#C42820', 700: '#A3201A' },
      },
      fontFamily: {
        display: ['"Archivo Variable"', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['"Geist Variable"', 'Geist', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '6px' },
      transitionTimingFunction: { out: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    },
  },
  plugins: [],
}
