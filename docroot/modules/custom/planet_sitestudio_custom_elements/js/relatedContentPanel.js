/**
 * Add GA data-analytics to Related Content Panel.
 * @file
 * File relatedContentPanel.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_relatedContentPanel = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $('[class*="coh-ce-cpt_duplicate_of_test_related_co"]').each(function (index) {
            if ($('h1', this).html() !== undefined) {
              $('a', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Content","eventAction":"From our experts","eventLabel":"Card: ' + $('h1', this).html() + '","eventValue":1}]' );
            }
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
