/**
 * @file
 * File accordionDesktop.js.
 */


(function ($, Drupal) {
    let alreadyRun = 0;
    Drupal.behaviors.planet_sitestudio_planetHelperJs = {
        attach: function () {
            $(document).ready(function () {
                if ($(window).width() >= 768 && alreadyRun === 0) {
                    $(".whychooseplanetbutton").first().trigger("click");
                    alreadyRun = 1;
                }

                $(".whychooseplanetbutton").on('click', function(e) {
                    if (!$(this).hasClass("open")) {
                        $('body').scrollTo(".whychooseplanetcomponent");
                    }
                  });
            });
        }
    };
})(jQuery, Drupal);