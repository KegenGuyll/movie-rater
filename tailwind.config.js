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
          light: '#2b2b2b',
        },
        black: '#00000',
        white: '#FBFBFB',
        cta: '#e82763',
        ctaLight: '#F5457C',
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
