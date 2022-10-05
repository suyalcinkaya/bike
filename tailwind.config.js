/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    extend: {}
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: []
}
