/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: { 700: '#1E2840', 800: '#141C30', 900: '#0B1120' },
        casa: { 400: '#F0566A', 500: '#D7263D', 600: '#B81D32' },
        porcelain: '#F5F6F8',
        mist: '#E7EAF0',
        slate: { 450: '#7A8399' },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,17,32,.05), 0 14px 40px -18px rgba(11,17,32,.35)',
      },
    },
  },
  plugins: [],
}
