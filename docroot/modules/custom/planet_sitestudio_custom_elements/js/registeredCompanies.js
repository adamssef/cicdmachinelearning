/**
 * @file
 * File registeredCompanies.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.registeredCompanies = {
    attach: function () {
      if ($('ul.coh-view-filter li.ssa-field_country_target_id-All').hasClass('active')){
        $('.coh-active-country').text(
          $(".ssa-field_country_target_id-All a").first().text()
        );
      }
    }
  };
})(jQuery, Drupal);
