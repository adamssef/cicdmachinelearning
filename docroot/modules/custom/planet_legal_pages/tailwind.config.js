module.exports = {
  mode: 'jit',
  content: [
    './templates/node--legal-pages.html.twig',
  ],
  safelist: [
    'border',
    'leading-[30px]',
    'text-2xl',
    'mb-2',
    'mb-6',
    'mb-[25px]',
    'mt-[25px]',
    'border-planet-grey',
    'pl-4',
    'border-planet-pink',
    'w-[264px]',
    'h-[241px]',
    'border-l-4',
    'leading-[18px]',
    'font-semibold',
    'text-planet-black',
    'uppercase',
    'w-[64px]',
    'h-[64px]',
    'sm:w-full' ,
    'w-full',
    'rounded-lg',
    'flex-grow-0',
    'basis-[264px]',
    'w-[264px]',
    'max-w-[264px]',
    'h-[241px]',
    'bg-white',
    'w-full',
    'md:w-1/2',
    'lg:w-1/4',
    'bg-gray-200',
    'text-center',
    'flex',
    'items-center',
    'justify-center',
    'justify-end',
    'border',
    'border-solid',
    'border-[#D1D1D1]',
    'text-sm',
    'px-6',
    'text-5xl',
    'rotate-180'
  ],
  theme: {
    dropShadow: {
      'custom': '0 0 1px black', // Add your custom drop-shadow here
    },
    extend: {
      boxShadow: {
        'planet-pp-card-hover': '0px 6px 20px 0px rgba(34, 34, 34, 0.16)',
        'planet-pp-card-hover--white': '0px 6px 20px 0px rgba(255, 255, 255, 0.6)', // Light shadow to contrast with black

      },
      screens: {
        'xs': '550px',
        'lg': '1180px',
        'lg-classic': '1024px',
        'lg-custom': '1380px',
        'xl-custom': '1400px',
        'xl': {'min': '1300px'},
        'xxl': {'min': '2000px'}
      },
      colors: {
        'custom-fafafa': '#FAFAFA',
        'planet-black': '#202020',
        'planet-grey': '#D1D1D1',
        'planet-pink': '#E00083'
      },
      backgroundImage: {
        'online': "url('/resources/images/accept_payments_online.jpg')",
        'inperson': "url('/resources/images/accept_payments_inperson.jpg')",
        'unattended': "url('/resources/images/accept_payments_unattended.jpg')",
        'dcc': "url('/resources/images/payment_methods/payment-in-cafe.png')",
        'payment_methods': "url('/resources/images/payment_methods/payment_methods_resized.jpg')",
      },
      gridTemplateColumns: {
        '3-custom' : 'repeat(3, 1fr)',
      }
    },
  },
  plugins: [],
};
