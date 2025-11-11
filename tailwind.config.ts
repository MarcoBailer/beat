import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--neon-green)',
        'brand-secondary': 'var(--neon-teal)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'background-dark': 'var(--dark-bg)',
        'surface-dark': 'var(--dark-surface)',
        'dark-green': 'var(--dark-green)',
        'text-green-glow': 'var(--text-green-glow)',
      },
      boxShadow: {
        'neon-soft': '0 0 15px var(--shadow-neon-soft)',
        'neon-medium': '0 0 25px var(--shadow-neon-medium)',
        'neon-strong': '0 0 40px var(--shadow-neon-strong)',
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { textShadow: '0 0 5px var(--neon-green), 0 0 10px var(--neon-green)' },
          'to': { textShadow: '0 0 20px var(--neon-teal), 0 0 30px var(--neon-teal)' },
        },
      }
    },
  },
  plugins: [],
}
export default config