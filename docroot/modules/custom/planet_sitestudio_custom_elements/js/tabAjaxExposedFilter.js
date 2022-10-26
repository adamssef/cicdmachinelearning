/**
 * @file
 * File tabAjaxExposedFilter.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_tabAjaxExposedFilter = {
    attach: function () {
      $(document).ajaxComplete(function () {
        $('.coh-view-filter').scrollTo('li.active');
      });
      $(document).ready(function () {
        $(".coh-view-filter [class*=\"ssa-tid\"]").each(function (index) {
          if (typeof gtag === typeof Function) {
            $('a', this).on('click', function (e) {
              gtag('event', 'Locations & Contacts', {
                'event_category': 'Get in touch',
                'event_label': $(this).html(),
                'event_value': 1
              });
            });
          }
        });
      });
    }
  };
})(jQuery, Drupal);
