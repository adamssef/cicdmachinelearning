module.exports = {
  mode: 'jit',
  content: [
    './templates/**/*.html.twig',
  ],
  theme: {
    extend: {
      colors: {
        'custom-fafafa': '#fafafa',
      },
      screens: {
        'xs': {'max': '330px'},    // Max 330px
        'md': {'min': '991px'},  // Min 991px
        'lg-classic': {'min': '1024px'}, // Min 1024px
        'lg': {'min': '1200px'},   // Min 1180px
        'xl': {'min': '1300px'},   // Min 1300px
      },
    },
  },
  plugins: [],
};
