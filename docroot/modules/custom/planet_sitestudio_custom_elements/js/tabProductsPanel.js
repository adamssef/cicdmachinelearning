/**
 * Add GA data-analytics to Products.
 * @file
 * File tabProductsPanel.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_tabProductsPanel = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-style-tab-planet-products-panel").each(function (index) {
            $('a', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Content","eventAction":"Products","eventLabel":"' + $('a', this).html() + '","eventValue":1}]' );
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
