/**
 * @file
 * File accordionMobile.js.
 */

(function ($, Drupal) {
    Drupal.behaviors.planet_sitestudio_planetHelperJs = {
        attach: function () {
            $(document).ready(function () {
                $(".coh-solving-challenges-button").on('click', function(e) {
                        $('body').scrollTo(".coh-solving-challenges-component");
                  });
            });
        }
    };
})(jQuery, Drupal);