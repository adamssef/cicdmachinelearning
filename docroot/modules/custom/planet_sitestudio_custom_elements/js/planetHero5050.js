/**
 * @file
 * File planetHero5050.js.
 */

(function ($) {
  document.addEventListener("DOMContentLoaded", (event) => {
    showMenu();

    window.addEventListener("scroll", function () {
      if (window.scrollY == 0) {
        showMenu();
      }
    });

    function showMenu() {
      if ($(window).width() > 1023) {
        $(".header-container").addClass("white-bg");
      }
    }
  });
})(jQuery);
