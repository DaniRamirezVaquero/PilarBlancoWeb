/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  variants: {
    extend: {
      scale: ['group-hover'],
      opacity: ['group-hover'],
    },
  },
  theme: {

  },
  plugins: [
    require('daisyui')
  ],
}
