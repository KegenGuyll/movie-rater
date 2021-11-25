const { screens } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: '428px',
      ...screens,
    },
    extend: {
      colors: {
        dark: {
          background: '#131313',
          components: '#1c1c1c',
          text: '#b6b6b6',
        },
      },
      transitionProperty: {
        height: 'height',
      },
    },
  },
  variants: {
    extend: {
      backgroundBlendMode: ['hover', 'focus'],
      visibility: ['hover', 'focus'],
      display: ['hover', 'focus'],
      cursor: ['disabled'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
