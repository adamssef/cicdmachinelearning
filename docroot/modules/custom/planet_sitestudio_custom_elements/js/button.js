/**
 * @file
 * File button.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_button = {
    attach: function () {
      $(document).ready(function () {
        let buttons = document.querySelectorAll(".coh-style-button-variants");
        buttons.forEach((btn) => {
          btn.addEventListener("click", () => {
            btn.blur();
          });
        });
      });
    },
  };
})(jQuery, Drupal);
