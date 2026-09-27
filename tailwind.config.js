/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          950: '#0a0508', // 極めて深いナイトブラック
          900: '#140a12',
          850: '#1e0c1b',
          800: '#2c0f24', // 深みのあるワインレッドベース
          700: '#481537',
          600: '#671c4c',
          500: '#8e2363',
          400: '#bc3b85',
          300: '#d96aa8',
          200: '#f0a3ce',
          100: '#fce3f0',
        },
        gold: {
          100: '#fff7db',
          200: '#feecb3',
          300: '#fedc82',
          400: '#f8c751',
          500: '#e5aa2b', // シャンパンゴールド
          600: '#be831b',
          700: '#945f16',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Shippori Mincho"', 'serif'],
        sans: ['"Inter"', '"Hiragino Sans"', '"Meiryo"', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(229, 170, 43, 0.25)',
        'glow-crimson': '0 0 30px rgba(142, 35, 99, 0.35)',
        'card-elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 15px rgba(229, 170, 43, 0.15)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(0.98)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'shimmer': 'shimmer 6s infinite linear'
      }
    },
  },
  plugins: [],
}
