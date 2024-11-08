module.exports = {
  mode: 'jit',
  content: [
    './templates/**/*.html.twig',
  ],
  theme: {
    dropShadow: {
      'custom': '0 0 1px black', // Add your custom drop-shadow here
    },
    extend: {
      colors: {
        'custom-fafafa': '#fafafa',
      },
      backgroundImage: {
        'online': "url('/resources/images/accept_payments_online.jpg')",
        'inperson': "url('/resources/images/accept_payments_inperson.jpg')",
        'unattended': "url('/resources/images/accept_payments_unattended.jpg')",
      },
      screens: {
        'xs': {'max': '330px'},  // Define a custom breakpoint for 325px and below
      },
    },
  },
  plugins: [],
};
