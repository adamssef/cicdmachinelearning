/**
 * Add GA data-analytics to Get in Touch Webform.
 * @file
 * File getInTouchWebForm.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_getInTouchWebForm = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".form-item").each(function (index) {
            // GA Webform input fields.
            if ($('input', this).attr('type') === 'text' && $('input', this).attr('name') !== 'captcha_response') {
              $('input', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Get in touch","eventAction":"Form: Fill","eventLabel":"' + $('input', this).attr('name') + '","eventValue":1}]' );
            }
            // GA Webform textarea fields.
            if ($('textarea', this).attr('placeholder') !== undefined) {
              $('textarea', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Get in touch","eventAction":"Form: Fill","eventLabel":"' + $('textarea', this).attr('placeholder') + '","eventValue":1}]' );
            }
            // GA Webform select fields.
            if ($('select', this).attr('name') !== undefined) {
              $('select', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Get in touch","eventAction":"Form: Fill","eventLabel":"' + $('select', this).attr('name') + '","eventValue":1}]' );
            }
          });
          $(".form-actions").each(function (index) {
            // GA Webform submit button.
            if ($('input', this).attr('type') === 'submit') {
              $('input', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Get in touch","eventAction":"Form: Click","eventLabel":"' + $('input', this).attr('value') + '","eventValue":1}]' );
            }
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
