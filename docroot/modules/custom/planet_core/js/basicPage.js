var swiperBrandsOptions = {
    loop: true,
    draggable: false,
    preventInteractionOnTransition: true,
    autoplay: true,
    speed: 6000,
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