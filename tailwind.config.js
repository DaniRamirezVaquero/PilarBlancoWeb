/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Tokens de la hoja de contactos: los valores viven en :root (src/styles.css).
      colors: {
        paper: 'var(--paper)',
        print: 'var(--print)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        rule: 'var(--rule)',
        film: 'var(--film)',
        'film-soft': 'var(--film-soft)',
        pencil: 'var(--pencil)',
        'pencil-deep': 'var(--pencil-deep)',
        edge: 'var(--edge)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        code: 'var(--font-code)',
        hand: 'var(--font-hand)',
      },
    },
  },
  plugins: [],
}
