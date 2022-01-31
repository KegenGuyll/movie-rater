const { screens } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: true,
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        black: '#00000',
        cta: '#e82763',
        ctaLight: '#F5457C',
        dark: {
          background: '#131313',
          components: '#1c1c1c',
          light: '#2b2b2b',
          text: '#b6b6b6',
        },
        white: '#FBFBFB',
      },
      transitionProperty: {
        height: 'height',
      },
    },
    screens: {
      xs: '428px',
      ...screens,
    },
  },
};
