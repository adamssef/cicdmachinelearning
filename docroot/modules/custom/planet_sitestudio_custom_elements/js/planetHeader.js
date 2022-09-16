/**
 * @file
 * File planetHeader.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_planetHeader = {
    attach: function (context) {
      let header = document.querySelector(".header-container");
      let menu = document.querySelector(".menu-container");

      window.addEventListener("scroll", (e) => {
        lastKnowScrollPosition = window.scrollY;

        if (
          lastKnowScrollPosition >= 5 &&
          !menu.classList.contains("menu-visible")
        ) {
          header.classList.add("white-bg");
        } else {
          header.classList.remove("white-bg");
        }
      });
    },
  };
})(jQuery, Drupal);
