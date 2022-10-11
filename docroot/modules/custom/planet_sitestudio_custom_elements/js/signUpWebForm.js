/**
 * Add GA data-analytics to Sign up Webform.
 * @file
 * File signUpWebForm.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_signUpWebForm = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {
          $(".webform-submission-sign-up-form .form-item").each(function (index) {
            // GA Webform input fields.
            if ($('input', this).attr('type') === 'email' && $('input', this).attr('name') !== 'captcha_response') {
              $('input', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Footer - Sign up","eventAction":"Form: Fill","eventLabel":"' + $('input', this).attr('name') + '","eventValue":1}]' );
            }
          });
          $(".webform-submission-sign-up-form .form-actions").each(function (index) {
            // GA Webform submit button.
            if ($('input', this).attr('type') === 'submit') {
              $('input', this).attr("data-analytics", '[{"trigger":"click","eventCategory":"Footer - Sign up","eventAction":"Form: Click","eventLabel":"' + $('input', this).attr('value') + '","eventValue":1}]' );
            }
          });
          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
