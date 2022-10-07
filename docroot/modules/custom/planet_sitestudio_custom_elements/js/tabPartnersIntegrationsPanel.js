/**
 * Add GA data-analytics to Partners Integrations.
 * @file
 * File tabPartnersIntegrationsPanel.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_tabPartnersIntegrationsPanel = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-style-tab-planet-partner-panel").each(function (index) {
            $('a', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Content","eventAction":"Partners Integrations","eventLabel":"' + $('a', this).html() + '","eventValue":1}]' );
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
