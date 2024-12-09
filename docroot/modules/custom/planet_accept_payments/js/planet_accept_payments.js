document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.swiper-testimonials', {
    loop: true, // Enable looping
    navigation: {
      nextEl: '.next-inner-button',
      prevEl: '.prev-inner-button',
    },
    on: {
      slideChange: function () {
        console.log('Slide changed');
      },
    }
  });
});
