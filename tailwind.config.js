/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF006E',
          50: '#FFB3D7',
          100: '#FF99CC',
          200: '#FF66B8',
          300: '#FF33A3',
          400: '#FF1A8F',
          500: '#FF006E',
          600: '#E60062',
          700: '#CC0056',
          800: '#B3004A',
          900: '#99003E'
        },
        secondary: {
          DEFAULT: '#8338EC',
          50: '#E0C7FF',
          100: '#D6B8FF',
          200: '#C299FF',
          300: '#AE7AFF',
          400: '#9B5CFF',
          500: '#8338EC',
          600: '#7020E8',
          700: '#5E1BC4',
          800: '#4C1699',
          900: '#3A116F'
        },
        accent: {
          DEFAULT: '#FFBE0B',
          50: '#FFF4CC',
          100: '#FFEFB8',
          200: '#FFE690',
          300: '#FFDC68',
          400: '#FFD340',
          500: '#FFBE0B',
          600: '#E6A900',
          700: '#CC9500',
          800: '#B38000',
          900: '#996B00'
        },
        surface: '#1A1A2E',
        background: '#0F0F1E',
        success: '#06FFA5',
        warning: '#FFB700',
        error: '#FF4365',
        info: '#3A86FF'
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'coin-splash': 'coinSplash 0.6s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'value-ticker': 'valueTicker 0.3s ease-out'
      },
      keyframes: {
        coinSplash: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px #FF006E' },
          '50%': { boxShadow: '0 0 20px #FF006E, 0 0 30px #8338EC' }
        },
        valueTicker: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}