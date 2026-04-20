/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#2563eb',
          700: '#1d4ed8'
        }
      }
    }
  },
  plugins: []
};
