/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'betterhover': {'raw': '(hover: hover)'}, //This is used instead of the built-in tailwind hover to support touchscreen devices that do not have the hover option
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
