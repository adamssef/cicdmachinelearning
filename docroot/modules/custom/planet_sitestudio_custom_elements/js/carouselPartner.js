/**
 * @file
 * File carouselPartner.js.
 */


(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_carouselPartner = {
    attach: function () {
      $(document).ready(function () {
        jQuery('.coh-style-tab-planet-partner-panel').on('click',function(){
          jQuery('.slick-slider').slick('setPosition');
        })
      });
    }
  };
})(jQuery, Drupal);
