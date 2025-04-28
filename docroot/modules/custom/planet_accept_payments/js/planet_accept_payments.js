document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.swiper-testimonials', {
    loop: true,
    navigation: {
      nextEl: '.next-inner-button',
      prevEl: '.prev-inner-button',
    },
  });
});
