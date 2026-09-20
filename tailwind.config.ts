import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        background: '#0A0A0A',
        foreground: '#EDEDED',
        muted: '#737373',
        subtle: '#262626',
        surface: '#141414',
        accent: {
          DEFAULT: '#D4D4D8',
          hover: '#EDEDED',
          subtle: '#D4D4D81A',
        },
        correct: '#EDEDED',
        error: {
          DEFAULT: '#EF4444',
          subtle: '#EF444422',
          extra: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        poppins: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Poppins', 'monospace'],
      },
      animation: {
        blink: 'blink 1s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
