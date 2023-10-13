/**
 * @file
 * File planetHelperJs.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_planetHelperJs = {
    attach: function (context) {
      $(document, context).on('click', function(e) {
        e.preventDefault();
      });
    }
  };
})(jQuery, Drupal);
