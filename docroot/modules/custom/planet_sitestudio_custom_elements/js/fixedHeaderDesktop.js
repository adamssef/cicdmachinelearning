/**
 * @file
 * File planetHero5050.js.
 */

(function ($) {
  document.addEventListener("DOMContentLoaded", (event) => {
      if ($(window).width() > 1023) {
        $(".header-container").addClass("white-bg-fixed");
        $(".header-container").addClass("white-bg");
      }
  });
})(jQuery);
