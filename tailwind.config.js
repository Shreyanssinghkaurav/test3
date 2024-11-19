/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lora', 'serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        parchment: {
          50: '#fdf6e9',
          100: '#f7e6c4',
          200: '#f0d49b',
          300: '#e9c272',
          400: '#e2b049',
          500: '#d4a373',
        },
      },
      backgroundImage: {
        'paper-texture': "url('/paper-texture.png')",
        'leather-texture': "url('/leather-texture.png')",
      },
      animation: {
        'write': 'write 1.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'seal-press': 'sealPress 0.3s ease-out forwards',
      },
      keyframes: {
        write: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sealPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};