/**
 * @file
 * File megaMenu.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_megaMenu = {
    attach: function () {
      $(document).ready(function () {
        $(".coh-paragraph-items").html(function(index, html) {
          return html.replace(",", "");
        });
      });
    }
  };
})(jQuery, Drupal);
