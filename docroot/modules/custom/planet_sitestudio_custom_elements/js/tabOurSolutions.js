/**
 * Add GA data-analytics to Our Solutions.
 * @file
 * File tabOurSolutions.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_tabOurSolutions = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-style-tab-planet-solutions-panel").each(function (index) {
            $('a', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Content","eventAction":"Our Solutions","eventLabel":"' + $('a', this).html() + '","eventValue":1}]' );
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
