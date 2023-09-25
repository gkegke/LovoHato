const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  theme: {
    keyframes: {
      replaceUp: {
        '0%': { transform: 'translateY(0)', opacity: 1 },
        '25%': { transform: 'translateY(-100%)', opacity: 0 },
        '50%': { transform: 'translateY(-100%)', opacity: 0 },
        '75%': { transform: 'translateY(-200%)', opacity: 0 },
        '100%': { transform: 'translateY(-200%)', opacity: 0 },
      },
    },
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
      },
      animation: {
        replaceUp: 'replaceUp 6s infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
