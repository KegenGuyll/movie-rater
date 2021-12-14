const { screens } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
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
        black: '#3E3E3E',
        'black-1': '#141A1C',
        'black-2': '#141A1C',
        blue: '#00ffff',
        gold: '#ffc700',
        'gray-1': '#535353',
        'gray-2': '#898989',
        'gray-3': '#E2E1E1',
        'gray-4': '#3E3E3E',
        'gray-5': '#F3F3F3',
        'gray-6': '#EBEBEB',
        orange: '#d9880f',
        primary: '#DED89D',
        'primary-active': '#DBD497',
        'primary-dark': '#D2CEA4',
        'primary-hover': '#E8E2AC',
        red: {
          dark: '#B4210F',
          default: '#c22713',
          light: '#e18d81',
        },
        secondary: '#FBFBFB',
        'secondary-active': '#F6F5EB',
        'secondary-hover': '#FDFBE9',
        white: '#FBFBFB',
      },
      transitionProperty: {
        height: 'height',
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
};
