/**
 * Add GA data-analytics to Resources.
 * @file
 * File resources.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_resources = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-resources-title").each(function (index) {
            if (typeof gtag === typeof Function) {
              $('a', this).on('click', function (e) {
                gtag('event', 'Link', {
                  'event_category': 'Resources',
                  'event_label': $(this).html(),
                  'event_value': 1
                });
              });
            }
          });
          $(".pager_planet").each(function (index) {
            if (typeof gtag === typeof Function) {
              $('a', this).on('click', function (e) {
                gtag('event', 'Navigation', {
                  'event_category': 'Resources',
                  'event_label': $(this).attr('title'),
                  'event_value': 1
                });
              });
            }
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
