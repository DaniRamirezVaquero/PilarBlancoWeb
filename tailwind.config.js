/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Tokens del fondo continuo: los valores viven en :root (src/styles.css).
      colors: {
        studio: 'var(--studio)',
        'studio-lit': 'var(--studio-lit)',
        shade: 'var(--shade)',
        'shade-deep': 'var(--shade-deep)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        platinum: 'var(--platinum)',
        silk: 'var(--silk)',
        peacock: 'var(--peacock)',
        cuff: 'var(--cuff)',
        orange: 'var(--orange)',
        rule: 'var(--rule)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [],
}
