/**
 * @file
 * File heroWithVideoHeightAdjustment.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;

  Drupal.behaviors.planet_sitestudio_heroWithVideoHeightAdjustment = {
    attach: function () {
      if (alreadyRun === 0) {
        $(document).ready(setTimeout(() => {
          if ($(window).width() > 1280) {
            $(".coh-video-inner").height("954px");
          }
          else if ($(window).width() >= 565) {
            $(".coh-video-inner").height("631px");
          }
          else {
            $(".coh-video-inner").height("297px");
          }
        }, 2000));

        alreadyRun = 1;
      }
    }
  }

})(jQuery, Drupal);
