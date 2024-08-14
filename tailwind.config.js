/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#87B3D0",

          "secondary": "#0d3047",

          "accent": "#f97316",

          "neutral": "#e5e7eb",

          "base-100": "#374151",

          "info": "#38bdf8",

          "success": "#4ade80",

          "warning": "#fcd34d",

          "error": "#f87171",
        },
      },
    ],
  },
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
