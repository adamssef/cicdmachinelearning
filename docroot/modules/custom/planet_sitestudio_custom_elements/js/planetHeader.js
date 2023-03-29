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

      function preventDefault(e){
        e.preventDefault();
      }

      function functiondisable() {
        // To get the scroll position of current webpage
        TopScroll = window.pageYOffset || document.documentElement.scrollTop;
        LeftScroll = window.pageXOffset || document.documentElement.scrollLeft,
        
        // if scroll happens, set it to the previous value
        window.onscroll = function() {
          window.scrollTo(LeftScroll, TopScroll);
        };
      }
        
      function functionenable() {
        window.onscroll = function() {};
      }

      function disableScroll(){
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
        functiondisable();
      }

      function enableScroll(){
        document.body.removeEventListener('touchmove', preventDefault);
        functionenable();
      }


      if (alreadyRun === 0) {
        $(document).ready(function(){
          let hasNotificationBar = $("body").find(".notification-bar-container:visible").length;
          let hasHero = $("body").find(".coh-hero").length;
          let hasHeroOnTop = 0;
          //if has Hero        
          if (hasHero > 0) {
            $(".coh-hero").each(function(){
              let hero = $(this);
              // if has Hero on the top of the page
              // Considering height of header + notificationBar
              if($(this).position().top < 300){
                $(this).addClass("coh-hero-top");
                hasHeroOnTop = 1;
                // if has Hero 5050
                if($(this).hasClass("coh-hero-5050")){
                  // On Mobile
                  if ($(window).width() < 1023) {
                    headerBehaviorwithNotificationBar(hero, header);
                    headerBehaviorOnScroll(header);
                  // On desktop
                  } else {
                    header.classList.add("white-bg");
                  }
                // if has Hero Full Width
                } else if ($(this).hasClass("coh-hero-full-width")) {
                  // On mobile
                  if ($(window).width() < 1023) {
                    headerBehaviorwithNotificationBar(hero, header);
                  }
                  headerBehaviorOnScroll(header);
                }
              } else {
                header.classList.add("white-bg");
                // On mobile
                if ($(window).width() < 1023) {
                  $("#block-cohesion-theme-content").css("padding-top","72px");
                } else {
                  if (hasHeroOnTop == 0){
                    if (hasNotificationBar > 0) {
                      $("#block-cohesion-theme-content").css("padding-top","138px");
                    } else {
                      $("#block-cohesion-theme-content").css("padding-top","96px");
                    }
                  }
                }
              }
            })
          // if doesn't have Hero 
          // Pages without Hero or with Hero in the middle of the pag
          } else {
            header.classList.add("white-bg");
            // On mobile
            if ($(window).width() < 1023) {
              $("#block-cohesion-theme-content").css("padding-top","72px");
            } else {
              if (hasHeroOnTop == 0){
                if (hasNotificationBar > 0) {
                  $("#block-cohesion-theme-content").css("padding-top","138px");
                } else {
                  $("#block-cohesion-theme-content").css("padding-top","96px");
                }
              }
            }
          }
        })

        $('.mobile-menu-button').click(function (e) {
          e.preventDefault();
          if (menuState === 0) {
            // Menu is opened;
            disableScroll();
            menuState = 1;
            $("body").css("overflow", "hidden");
            $(".coh-container .menu-container").css("position", "fixed");
            $(".coh-container .menu-container").css("height", "100%");
            $(".coh-container .menu-container").css("overflow-y", "scroll");
          } else {
            // Menu is closed;
            enableScroll();
            menuState = 0;
            $("body").css("overflow", "");
          }
          return false;
        });

        $(".menu-level-1-li").hover(function (e) {
          e.preventDefault();
          if (menuState === 0) {
            // Menu is opened;
            disableScroll();
            menuState = 1;
          } else {
            // Menu is closed;
            enableScroll();
            menuState = 0;
          }
          return false;
        }) 

        // Search for utm parameters in url.
        const urlParams = new URLSearchParams(window.location.search);
        const shortUTMTime = 1
        const longUTMTime = 360
        const planetUrls = [
          "weareplanet.com",
          "preprod.weareplanet.com",
          "planetpaymentdev.prod.acquia-sites.com",
          "planet.lndo.site"
        ]
        const urlMaxLength = 150

        if (urlParams.has('utm_campaign') || urlParams.has('utm_medium') || urlParams.has('utm_source') || urlParams.has('utm_content') || urlParams.has('utm_term') || urlParams.has('gclid')){

          // Get the cookies.
          let cookies = document.cookie;
          if (cookies !== undefined) {

            const utmSource = urlParams.get('utm_source')
            const utmMedium = urlParams.get('utm_medium')
            const utmCampaign = urlParams.get('utm_campaign')
            const utmContent = urlParams.get('utm_content')
            const utmTerm = urlParams.get('utm_term')
            const gclid = urlParams.get('gclid')
           
            /**
             * Save recent UTMs as cookies.
             * We want to set the cookies only if they don't exist already
             */
            if (utmSource && !cookieExists('Drupal.visitor.utm_source')) {
              createCookie('Drupal.visitor.utm_source', utmSource, shortUTMTime);
            }
            if (utmMedium && !cookieExists('Drupal.visitor.utm_medium')) {
              createCookie('Drupal.visitor.utm_medium', utmMedium, shortUTMTime);
            }
            if (utmCampaign && !cookieExists('Drupal.visitor.utm_campaign')) {
              createCookie('Drupal.visitor.utm_campaign', utmCampaign, shortUTMTime);
            }
            if (utmContent && !cookieExists('Drupal.visitor.utm_content')) {
              createCookie('Drupal.visitor.utm_content', utmContent, shortUTMTime);
            }
            if (utmTerm && !cookieExists('Drupal.visitor.utm_term')) {
              createCookie('Drupal.visitor.utm_term', utmTerm, shortUTMTime);
            }
            if (gclid && !cookieExists('Drupal.visitor.gclid')) {
              createCookie('Drupal.visitor.gclid', gclid, shortUTMTime);
            }

            /**
             * Save original UTMs as cookies.
             * We want to set the cookies only if they don't exist already
             */
            if (utmSource && !cookieExists('Drupal.visitor.orig_utm_source')) {
              createCookie('Drupal.visitor.orig_utm_source', utmSource, longUTMTime);
            }
            if (utmMedium && !cookieExists('Drupal.visitor.orig_utm_medium')) {
              createCookie('Drupal.visitor.orig_utm_medium', utmMedium, longUTMTime);
            }
            if (utmCampaign && !cookieExists('Drupal.visitor.orig_utm_campaign')) {
              createCookie('Drupal.visitor.orig_utm_campaign', utmCampaign, longUTMTime);
            }
            if (utmContent && !cookieExists('Drupal.visitor.orig_utm_content')) {
              createCookie('Drupal.visitor.orig_utm_content', utmContent, longUTMTime);
            }
            if (utmTerm && !cookieExists('Drupal.visitor.orig_utm_term')) {
              createCookie('Drupal.visitor.orig_utm_term', utmTerm, longUTMTime);
            }
          }
        }

        /** 
         * Save referrer and original_lp as cookies.
         * referrer = the external website the user comes from
         * original_lp = the last page the user has seen on wap before sending the lead
         */
        const referrer = (!containsAny(document.referrer, planetUrls)) ? document.referrer : false
        if (referrer && !cookieExists('Drupal.visitor.referrer')) {
          createCookie('Drupal.visitor.referrer', referrer.substring(0, urlMaxLength), shortUTMTime);
        }

        const originalLp = (containsAny(document.referrer, planetUrls)) ? document.referrer : false
        if (originalLp && !cookieExists('Drupal.visitor.orig_lp')) {
          createCookie('Drupal.visitor.orig_lp', originalLp.substring(0, urlMaxLength), shortUTMTime);
        }
        alreadyRun = 1;
      }
    },
  };

  function headerBehaviorwithNotificationBar(hero, header) {
    $(document).ready(function(){
      let hasNotificationBar = $("body").find(".notification-bar-container:visible").length;
      // if has Notification Bar
      if(hasNotificationBar > 0) {
        header.classList.add("white-bg");
        // When click to close Notification Bar
        $(".notification-bar-button").click(function(){
          header.classList.remove("white-bg");
          $("#block-cohesion-theme-content").css("padding-top","0px");
          if($(hero).hasClass("coh-hero-full-width")) {
            $(hero).css("top","0px");
          }
        })
      } else {
        header.classList.remove("white-bg");
        $("#block-cohesion-theme-content").css("padding-top","0px");
        hero.addClass("menu-invisible");
        $(".hero-background").addClass("menu-invisible");
      }
    })
  }
  function headerBehaviorOnScroll(header) {
    // On Scroll
    $(window).on('scroll', function () {
      let scrollPosition = jQuery(window).scrollTop();
      let hasNotificationBar = $("body").find(".notification-bar-container:visible").length;
      // if scroll position is on the top 
      if (scrollPosition === 0) {
        // if has Notification Bar and is Mobile
        if(hasNotificationBar > 0 && $(window).width() < 1023) {
          header.classList.add("white-bg");
        // if doesn't have Notification Bar and/or is on Desktop
        } else {
          header.classList.remove("white-bg");
        }
      // if Scroll position isn't on the top
      } else {
        header.classList.add("white-bg");
      }
    });
  }

  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function cookieExists(name) {
    return !(document.cookie.indexOf(name) === -1)
  }
  function containsAny(str, substrings) {
    for (var i = 0; i != substrings.length; i++) {
       var substring = substrings[i];
       if (str.indexOf(substring) != - 1) {
         return substring;
       }
    }
    return null; 
}

})(jQuery, Drupal);
