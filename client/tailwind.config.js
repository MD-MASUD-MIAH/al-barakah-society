/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          850: '#0c442b',
          900: '#0F5132',
          950: '#072e1c',
        },
        gold: {
          100: '#fef9c3',
          300: '#fde047',
          400: '#facc15',
          500: '#D4AF37',
          600: '#b89628',
          700: '#92741c',
        },
        islamic: {
          green: '#0F5132',
          dark: '#072718',
          accent: '#166534',
          gold: '#D4AF37',
          lightGold: '#fef08a',
          sand: '#fcfbf7',
        }
      },
      fontFamily: {
        sans: ['Hind Siliguri', 'Inter', 'system-ui', 'sans-serif'],
        bengali: ['Hind Siliguri', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 81, 50, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(15, 81, 50, 0.14), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
