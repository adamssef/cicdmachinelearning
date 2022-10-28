/**
 * Add GA data-analytics to Tab Global Reach.
 * @file
 * File tabGlobalReach.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_tabGlobalReach = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-style-tab-planet-global-reach-panel").each(function (index) {
            $('a', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Content","eventAction":"Global Reach","eventLabel":"' + $('a', this).html() + '","eventValue":1}]' );
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
