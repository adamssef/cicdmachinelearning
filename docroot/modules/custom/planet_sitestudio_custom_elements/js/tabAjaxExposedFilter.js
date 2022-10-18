/**
 * @file
 * File tabAjaxExposedFilter.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_tabAjaxExposedFilter = {
    attach: function () {
      $(document).ajaxComplete(function() {
        $('.coh-view-filter').scrollTo('li.active');
      });
    }
  };
})(jQuery, Drupal);
