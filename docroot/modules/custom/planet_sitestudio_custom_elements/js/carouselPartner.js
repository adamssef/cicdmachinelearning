/**
 * @file
 * File carouselPartner.js.
 */


(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_carouselPartner = {
    attach: function () {
      $(document).ready(function () {
        $('.coh-style-tab-planet-partner-panel').on('click',function(){
          $('.slick-slider').slick('setPosition');
        })
      });
    }
  };
})(jQuery, Drupal);
