/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Tokens del sistema visual: los valores viven en :root (src/styles.css).
      colors: {
        ground: 'var(--ground)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        rule: 'var(--rule)',
        navy: 'var(--navy)',
        'navy-soft': 'var(--navy-soft)',
        accent: 'var(--accent)',
        'accent-deep': 'var(--accent-deep)',
        'on-navy': 'var(--on-navy)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [],
}
