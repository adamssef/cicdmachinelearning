/**
 * @file
 * File csFeaturedSlider.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_csFeaturedSlider = {
    attach: function () {
      $('.cs-featured-slider-logos div:first-child').addClass('active');
      $('.slide-logo').addClass(function(i) {
        return 'slide-'+(i);
      });

      $('.coh-slider-nav-top button').click(function() {
        let index = $('.slick-active').attr('data-slick-index');
        let slideLogoItem = 'slide-'+index;

        $('.slide-logo').each(function(){
          if($(this).hasClass(slideLogoItem)) {
            $('.slide-logo').removeClass('active');
            $(this).addClass('active');
          }
        });
      });
    }
  };
})(jQuery, Drupal);
