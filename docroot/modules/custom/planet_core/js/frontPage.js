var swiperBrandsOptions = {
    loop: true,
    draggable: false,
    preventInteractionOnTransition: true,
    autoplay: {
      delay: 1,
    },
    freeMode: true,
    speed: 6000,
    freeModeMomentum: false,
    breakpoints: {
      // when window width is >= 320px
      0: {
        slidesPerView: 3,
        spaceBetween: 5
      },
      767: {
        slidesPerView: 4,
        spaceBetween: 10
      },
      991: {
        slidesPerView: 4,
        spaceBetween: 10
      },
      1200: {
        slidesPerView: 10,
        spaceBetween: 10
      }
    }
  };
  
  const swiperBrands = new Swiper('.swiper-brands', swiperBrandsOptions);
  const swiperTestimonials = new Swiper('.swiper-testimonials', {
    navigation: {
      nextEl: '.next-inner-button',
      prevEl: '.prev-inner-button',
    },
  });
  const swiperPros = new Swiper('.swiper-pros', {
    centeredSlides: true,
    slidesPerView: 1.2,
    loop: true,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-custom-pagination",
      clickable: true,
    },
  });
  
  swiperPros.slideToLoop(1, 0);
  
  
  jQuery(document).ready(function () {
  
  // Event listeners for buttons
  jQuery('.pros-showcase-btn').click(function() {
      let industry = jQuery(this).data("pro"); //friction, revenue, simplify
      jQuery(".pros-showcase-btn").removeClass("pros-selected");
      jQuery(this).addClass("pros-selected");
  
      jQuery(".pros-wrapper").hide();
      jQuery(".pros-wrapper-" + industry).show();
  });
  
    });