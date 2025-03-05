// Ensure Swiper is available before using it
if (typeof Swiper !== "undefined") {
    try {
      const swiperBrandsOptions = {
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
          0: { slidesPerView: 3, spaceBetween: 5 },
          767: { slidesPerView: 4, spaceBetween: 10 },
          991: { slidesPerView: 4, spaceBetween: 10 },
          1200: { slidesPerView: 10, spaceBetween: 10 },
        },
      };
  
      // Initialize Swipers only if elements exist
      const brandsEl = document.querySelector(".swiper-brands");
      if (brandsEl) new Swiper(brandsEl, swiperBrandsOptions);
  
      const testimonialsEl = document.querySelector(".swiper-testimonials");
      if (testimonialsEl) {
        new Swiper(testimonialsEl, {
          navigation: {
            nextEl: ".next-inner-button",
            prevEl: ".prev-inner-button",
          },
        });
      }
  
      const prosEl = document.querySelector(".swiper-pros");
      if (prosEl) {
        const swiperPros = new Swiper(prosEl, {
          centeredSlides: true,
          slidesPerView: 1.2,
          loop: true,
          spaceBetween: 20,
          pagination: {
            el: ".swiper-custom-pagination",
            clickable: true,
          },
        });
  
        // Ensure Swiper instance exists before calling methods
        if (swiperPros && typeof swiperPros.slideToLoop === "function") {
          swiperPros.slideToLoop(1, 0);
        }
      }
    } catch (error) {
      console.error("Error initializing Swiper:", error);
    }
  }
  
  // jQuery-related logic
  jQuery(document).ready(function () {
    // Ensure elements exist before adding event listeners
    if (jQuery(".pros-showcase-btn").length && jQuery(".pros-wrapper").length) {
      jQuery(".pros-showcase-btn").click(function () {
        let industry = jQuery(this).data("pro"); // e.g., 'friction', 'revenue', 'simplify'
        if (industry) {
          jQuery(".pros-showcase-btn").removeClass("pros-selected");
          jQuery(this).addClass("pros-selected");
  
          jQuery(".pros-wrapper").hide();
          jQuery(".pros-wrapper-" + industry).show();
        }
      });
    } else {
      console.warn("Pros showcase buttons or wrappers not found.");
    }
  });