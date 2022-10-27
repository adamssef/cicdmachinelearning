/**
 * Add GA data-analytics to Texts Button Cards.
 * @file
 * File textsButtonCards.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_textsButtonCards = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-ce-cpt_component_with_texts_button_-d0561730").each(function (index) {
            if (typeof gtag === typeof Function) {
              $('a', this).on('click', function (e) {
                gtag('event', 'Texts Button Cards', {
                  'event_category': 'Get in touch',
                  'event_label': $(this).html(),
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
