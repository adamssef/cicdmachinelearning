/**
 * Add GA data-analytics to Our Approach Container.
 * @file
 * File ourApproachContainer.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_ourApproachContainer = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".coh-ce-cpt_card_feature_icon_and_text-a305ba2").each(function (index) {
            if (typeof gtag === typeof Function) {
              $('a').on('click', function (e) {
                console.log("here");
                gtag('event', 'Our Approach Container', {
                  'event_category': 'Content',
                  'event_label': $('h3', this).html(),
                  'event_value': 1
                });
              });
            }
            //$('a', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Content","eventAction":"Our Approach Container","eventLabel":"' + $('h3', this).html() + '","eventValue":1}]' );
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
