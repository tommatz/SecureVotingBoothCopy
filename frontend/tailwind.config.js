/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: '320px',
      sm: '600px',
      md: '876px',
      lg: '1024px',
      xl: '1440px'
    },
    extend: {},
  },
  plugins: [],
}
