/**
 * Add GA data-analytics to Tab Extra Team.
 * @file
 * File tabExtraTeam.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_tabExtraTeam = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-style-tab-extra-planet-team-panel").each(function (index) {
            $('a', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Careers","eventAction":"Meet our Team","eventLabel":"' + $('a', this).html() + '","eventValue":1}]' );
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
