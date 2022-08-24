/**
 * @file
 * File planetHelperJs.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_planetHelperJs = {
    attach: function (context) {
      $(document, context).on('click', function(e) {
        e.preventDefault();
        console.log('helper test console log');
      });
    }
  };
})(jQuery, Drupal);
