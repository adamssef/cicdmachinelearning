/**
 * @file
 * File locationsButton.js.
 */

 (function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_locationsButton = {
      attach: function () {
          $(document).ready(function () {
            $(".coh-view-item-location").first().addClass("first-view-item");

            $('.locations-button').click(function() {
              $(".coh-view-item-location").toggleClass("show-view-item");
              var button = $(this);
              button.toggleClass('see-less');
              if(button.hasClass('see-less')){
                  button.text('Show less offices');         
              } else {
                  button.text('Show more offices');
              }
            });
          });
      }
  };
})(jQuery, Drupal);
