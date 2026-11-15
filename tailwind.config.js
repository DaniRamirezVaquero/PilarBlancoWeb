/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#95B2C6",
          "secondary": "#1e3a4d",
          "accent": "#E4754E",
          "neutral": "#e5e7eb",
          // Gris neutro del fondo de estudio de fondo2 (medido en la foto: R≈G≈B, apenas frío).
          "base-100": "#3F3F42",
          "base-content": "#F5F5F5",
          "info": "#38bdf8",
          "success": "#4ade80",
          "warning": "#fcd34d",
          "error": "#f87171",
          "--page-from": "#515154",
          "--page-via": "#59595C",
          "--page-to": "#626265",
        },
      },
      {
        "mytheme-portada": {
          "primary": "#80A59E",
          "secondary": "#4A4542",
          "accent": "#2f76ba",
          "neutral": "#E4E8EC",
          "base-100": "#4E565E",
          "base-content": "#F5F7F9",
          "accent-content": "#FFFFFF",
          "info": "#38bdf8",
          "success": "#4ade80",
          "warning": "#fcd34d",
          "error": "#f87171",
          // Pizarra azulada del fondo de la portada, lo más clara posible sin bajar de 4.5:1 con el texto blanco.
          "--page-from": "#5F6973",
          "--page-via": "#646E78",
          "--page-to": "#69737D",
        },
      },
    ],
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      opacity: ['group-hover'],
      transform: ['group-hover'],
      blur: ['group-hover'],
    },
  },
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'shimmer-slow': 'shimmerSlow 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmerSlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
}
