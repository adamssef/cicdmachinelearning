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
        } else if (!header.classList.contains("white-bg-fixed")) {
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
            //disableScroll();
            menuState = 1;
            $("body").css("overflow", "hidden");

            $(".coh-container .menu-container").css("position", "fixed");
            $(".coh-container .menu-container").css("height", "100%");
            $(".coh-container .menu-container").css("overflow-y", "scroll");
          } else {
            // Menu is closed;
            //enableScroll();
            menuState = 0;
            $("body").css("overflow", "");
          }
          return false;
        });

        // Search for utm parameters in url.
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('utm_campaign') || urlParams.has('utm_medium') || urlParams.has('utm_source') || urlParams.has('utm_content') || urlParams.has('utm_term')){

          // Get the cookies.
          let cookies = document.cookie;
          if (cookies !== undefined) {

            // Add the url get to cookies.
            if (urlParams.get('utm_source') && cookies.indexOf('Drupal.visitor.utm_source') < 0) {
              createCookie('Drupal.visitor.utm_source', urlParams.get('utm_source'), 1);
            }
            if (urlParams.get('utm_medium') && cookies.indexOf('Drupal.visitor.utm_medium') < 0) {
              createCookie('Drupal.visitor.utm_medium', urlParams.get('utm_medium'), 1);
            }
            if (urlParams.get('utm_campaign') && cookies.indexOf('Drupal.visitor.utm_campaign') < 0) {
              createCookie('Drupal.visitor.utm_campaign', urlParams.get('utm_campaign'), 1);
            }
            if (urlParams.get('utm_content') && cookies.indexOf('Drupal.visitor.utm_content') < 0) {
              createCookie('Drupal.visitor.utm_content', urlParams.get('utm_content'), 1);
            }
            if (urlParams.get('utm_term') && cookies.indexOf('Drupal.visitor.utm_term') < 0) {
              createCookie('Drupal.visitor.utm_term', urlParams.get('utm_term'), 1);
            }
          }
        }

        alreadyRun = 1;
      }
    },
  };

  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";
  }

})(jQuery, Drupal);
