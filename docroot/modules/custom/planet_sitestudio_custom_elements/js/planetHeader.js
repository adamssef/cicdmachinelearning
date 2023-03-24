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

      function disableScroll(){
        document.body.addEventListener('touchmove', preventDefault, { passive: false });
      }
      function enableScroll(){
        document.body.removeEventListener('touchmove', preventDefault);
      }

      if (alreadyRun === 0) {
        $(document).ready(function(){
          let hasNotificationBar = $("body").find(".notification-bar-container:visible").length;
          let hasHero = $("body").find(".coh-hero").length;
          //if has Hero        
          if (hasHero > 0) {
            $(".coh-hero").each(function(){
              let hero = $(this);
              // if has Hero on the top of the page
              // Considering height of header + notificationBar
              if($(this).position().top < 300){
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
                  if (hasNotificationBar > 0) {
                    $("#block-cohesion-theme-content").css("padding-top","138px");
                  } else {
                    $("#block-cohesion-theme-content").css("padding-top","96px");
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
              if (hasNotificationBar > 0) {
                $("#block-cohesion-theme-content").css("padding-top","138px");
              } else {
                $("#block-cohesion-theme-content").css("padding-top","96px");
              }
            }
          }
        })

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

            const shortUTMTime = 1
            const longUTMTime = 60

            // Save UTMs cookies
            if (utmSource && cookies.indexOf('Drupal.visitor.utm_source') < 0) {
              createCookie('Drupal.visitor.utm_source', utmSource, shortUTMTime);
            }
            if (utmMedium && cookies.indexOf('Drupal.visitor.utm_medium') < 0) {
              createCookie('Drupal.visitor.utm_medium', utmMedium, shortUTMTime);
            }
            if (utmCampaign && cookies.indexOf('Drupal.visitor.utm_campaign') < 0) {
              createCookie('Drupal.visitor.utm_campaign', utmCampaign, shortUTMTime);
            }
            if (utmContent && cookies.indexOf('Drupal.visitor.utm_content') < 0) {
              createCookie('Drupal.visitor.utm_content', utmContent, shortUTMTime);
            }
            if (utmTerm && cookies.indexOf('Drupal.visitor.utm_term') < 0) {
              createCookie('Drupal.visitor.utm_term', utmTerm, shortUTMTime);
            }
            if (gclid && cookies.indexOf('Drupal.visitor.gclid') < 0) {
              createCookie('Drupal.visitor.gclid', gclid, shortUTMTime);
            }

            // Save original UTMs cookies
            if (utmSource && cookies.indexOf('Drupal.visitor.orig_utm_source') < 0) {
              createCookie('Drupal.visitor.orig_utm_source', utmSource, longUTMTime);
            }
            if (utmMedium && cookies.indexOf('Drupal.visitor.orig_utm_medium') < 0) {
              createCookie('Drupal.visitor.orig_utm_medium', utmMedium, longUTMTime);
            }
            if (utmCampaign && cookies.indexOf('Drupal.visitor.orig_utm_campaign') < 0) {
              createCookie('Drupal.visitor.orig_utm_campaign', utmCampaign, longUTMTime);
            }
            if (utmContent && cookies.indexOf('Drupal.visitor.orig_utm_content') < 0) {
              createCookie('Drupal.visitor.orig_utm_content', utmContent, longUTMTime);
            }
            if (utmTerm && cookies.indexOf('Drupal.visitor.orig_utm_term') < 0) {
              createCookie('Drupal.visitor.orig_utm_term', utmTerm, longUTMTime);
            }
          }
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
        })
      } else {
        hero.addClass("menu-invisible");
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

})(jQuery, Drupal);
