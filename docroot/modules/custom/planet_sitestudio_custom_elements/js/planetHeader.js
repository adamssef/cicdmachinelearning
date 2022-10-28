/**
 * @file
 * File planetHeader.js.
 */

(function ($, Drupal) {
  let menuState = 0;
  let alreadyRun = 0;
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

      function preventDefault(e){
        e.preventDefault();
      }

      function disableScroll(){
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
      }
      function enableScroll(){
        document.body.removeEventListener('touchmove', preventDefault);
      }

      if (alreadyRun === 0) {
        $('.mobile-menu-button').click(function (e) {
          e.preventDefault();
          if (menuState === 0) {
            // Menu is opened;
            disableScroll();
            menuState = 1;
            $("body").css("overflow", "hidden");
          } else {
            // Menu is closed;
            enableScroll();
            menuState = 0;
            $("body").css("overflow", "");
          }
          return false;
        });
        alreadyRun = 1;
      }
    },
  };
})(jQuery, Drupal);
