/**
 * Add GA data-analytics to Cards With Arrow (tax free).
 * @file
 * File cardsWithArrow.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_cardsWithArrow = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-ce-cpt_component_with_cards_with_ar-cb728f0c").each(function (index) {
            if (typeof gtag === typeof Function) {
              $('a', this).on('click', function (e) {
                gtag('event', 'Cards With Arrow', {
                  'event_category': 'Get in touch',
                  'event_label': $('h4', this).html(),
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
