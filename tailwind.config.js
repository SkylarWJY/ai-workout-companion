/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: ['SF Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bone: {
          50: '#FAF9F6',
          100: '#F4F2EC',
          200: '#E8E5DC',
          300: '#D8D3C5',
        },
        ink: {
          900: '#0A0A0A',
          800: '#141414',
          700: '#1C1C1E',
          600: '#2C2C2E',
          500: '#3A3A3C',
          400: '#636366',
          300: '#8E8E93',
          200: '#AEAEB2',
          100: '#C7C7CC',
        },
        accent: {
          DEFAULT: '#0A0A0A',
          dark: '#FAF9F6',
        },
        priority: {
          extreme: '#FF453A',
          veryhigh: '#FF9F0A',
          high: '#FFD60A',
          moderate: '#30D158',
          low: '#64D2FF',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        cardDark: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
        ring: '0 0 0 1px rgba(0,0,0,0.06)',
        ringDark: '0 0 0 1px rgba(255,255,255,0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
