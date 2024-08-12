(function ($, Drupal) {
  "use strict";
  let currentlyOpenMenuItem = null;

  function showHamburgerMenu() {
    let hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0];
    hamburgerMenu.classList.remove('display-none');
    $(hamburgerMenu).attr('src', '/resources/icons/hamburger-menu-black.svg');
  }

  function createCookie(name, value, hours) {
    var expires;
    if (hours) {
      const date = new Date();
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function cookieExists(name) {
    return document.cookie.indexOf(name) !== -1;
  }

  function headerBehaviorwithNotificationBar(hero, header) {
    $(document).ready(function(){
      let hasNotificationBar = $("body").find(".notification-bar-container:visible").length;
      if(hasNotificationBar > 0) {
        header.classList.add("white-bg");
        // When click to close Notification Bar
        $(".notification-bar-button").click(function(){
          header.classList.remove("white-bg");
          $("#block-cohesion-theme-content").css("padding-top","0px");
          if($(hero).hasClass("coh-hero-full-width")) {
            $(hero).css("top","0px");
          }
        });
      } else {
        header.classList.remove("white-bg");
        $("#block-cohesion-theme-content").css("padding-top","0px");
        hero.addClass("menu-invisible");
        $(".hero-background").addClass("menu-invisible");
      }
    });
  }

  function addTransparentBgClassToHeader() {
    const header = document.getElementsByClassName("megamenu-header")[0];
    header.classList.add("has-transparent-bg");
  }

  function removeTransparentBgClassFromHeader() {
    const header = document.getElementsByClassName("megamenu-header")[0];
    header.classList.remove("has-transparent-bg");
  }


  /**
   * Manages how the header behaves when the user scrolls the page vertically.
   */
  function headerBehaviorOnScroll() {
    let logo = document.getElementById('planet-logo');
    let logoMobileAndTablet = document.getElementById('planet-logo--mobile-and-tablet');
    let hasDarkMenuTheme = $("body").find(".dark-menu-items").length + $("body").find(".path-frontpage").length;
    let isFrontPage = $("body").hasClass("path-frontpage");

    $(window).on('scroll', function () {
      let isExpanded = document.getElementsByClassName("megamenu-header")[0].classList.contains("expanded");
      let hasTransparentBg = !isFrontPage && ($("body, div").hasClass("planet-header-transparent") || $("body, div").hasClass("coh-hero-full-width"));
      let hamburgerMenuIcon = document.getElementsByClassName('hamburger-menu')[0];

      let scrollPosition = jQuery(window).scrollTop();

      if (isExpanded) {
        removeTransparentBgClassFromHeader()
        $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
      }
      else {
        if (scrollPosition === 0 && hasDarkMenuTheme > 0) {
          $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
          addTransparentBgClassToHeader();
        }

        if (scrollPosition === 0 && hasDarkMenuTheme === 0) {
          $(logo).attr('src', '/resources/logo/planet_logo.svg');
          if (hasTransparentBg) {
            addTransparentBgClassToHeader();
            $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo.svg');
            $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu.svg');
          }
        }

        if (scrollPosition > 0 && hasDarkMenuTheme > 0) {
          $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
          $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
          removeTransparentBgClassFromHeader();
        }

        if (scrollPosition > 0 && hasDarkMenuTheme === 0) {
          $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
          $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
          removeTransparentBgClassFromHeader();
          $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu-black.svg');
        }
      }
    });
  }

  function removeExpandedFromHeader() {
    const header = document.getElementsByClassName("megamenu-header")[0];
    header.classList.remove("expanded");
  }

  function removeNoScrollFromBody() {
    document.body.classList.remove('no-scroll');
  }

  function addNoScrollToBody() {
    document.body.classList.add('no-scroll');
  }

  function unflipAllDesktopMenuArrows() {
    let businessLinks = document.getElementsByClassName('business-link');
    for (let i = 0; i < businessLinks.length; i++) {
      let img = businessLinks[i].children[0];
      img.classList.remove('flip');
    }
  }

  function isAnyDesktopMenuExpanded() {
    let menus = [
      document.getElementsByClassName('megamenu-products__desktop'),
      document.getElementsByClassName('megamenu-solutions__desktop'),
      document.getElementsByClassName('megamenu-resources__desktop'),
      document.getElementsByClassName('megamenu-company__desktop')
    ];

    for (let i = 0; i < menus.length; i++) {
      if (menus[i][0] !== undefined && !menus[i][0].classList.contains('display-none')) {
        return true;
      }
    }

    return false;
  }

  function isAnyMegamenuMobileAndTabletsContainerDisplayed() {
    let containers = document.getElementsByClassName('megamenu-mobile-and-tablets__container');

    for (let i = 0; i < containers.length; i++) {
      if (!containers[i].classList.contains('display-none')) {
        return true;
      }
    }

    return false;
  }

  function headerBehaviorOnResize() {
    let logo = document.getElementById('planet-logo');
    let logoMobileAndTablet = document.getElementById('planet-logo--mobile-and-tablet');
    let hasDarkMenuTheme = $("body").find(".dark-menu-items").length + $("body").find(".path-frontpage").length;
    let isFrontPage = $("body").hasClass("path-frontpage");
    let megamenuMobileAndTablets = document.getElementsByClassName('megamenu-mobile-and-tablets')[0];
    let hamburgerMenuIcon = document.getElementsByClassName('hamburger-menu')[0];
    let closingXIcon = document.getElementsByClassName('close-hamburger-menu')[0];
    let goBackSpan = document.getElementsByClassName('go-back-span')[0];
    let goHome = document.getElementsByClassName('go-home')[1];
    let goHomeDesktop = document.getElementsByClassName('go-home')[0];
    let scrollPosition = jQuery(window).scrollTop();
    let isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();
    let isMergedMenuItemsDisplayed = !document.getElementsByClassName('merged-menu-items')[0].classList.contains('display-none');
    let mergedMenuItems = document.getElementsByClassName('merged-menu-items')[0];

    $(window).on('resize', function () {
      let isExpanded = document.getElementsByClassName("megamenu-header")[0].classList.contains("expanded");
      let hasTransparentBg = !isFrontPage && ($("body, div").hasClass("planet-header-transparent") || $("body, div").hasClass("coh-hero-full-width"));

      if ($(window).width() > 1023) {
        mergedMenuItems.classList.add('display-none');
        megamenuMobileAndTablets.classList.add('display-none');
        let megamenuMobileAndTabletsContainer = document.getElementsByClassName('megamenu-mobile-and-tablets__container')[0];
        $(megamenuMobileAndTabletsContainer).addClass('display-none');

        if (hasTransparentBg === true) {
          if (!isAnyDesktopMenuExpanded()) {
            addTransparentBgClassToHeader();
            removeExpandedFromHeader();
          }

          $(goHomeDesktop).removeClass('display-none');
        }
        else {
          if (scrollPosition === 0) {
            // addTransparentBgClassToHeader();
          }
          else {
            removeTransparentBgClassFromHeader();
          }
          $(goHomeDesktop).removeClass('display-none');
          $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
        }
      }
      else {
        let isMobileExpanded = !megamenuMobileAndTablets.classList.contains('display-none');
        let containerProducts = document.getElementsByClassName('megamenu-products__desktop')[0];
        let containerSolutions = document.getElementsByClassName('megamenu-solutions__desktop')[0];
        let containerResources = document.getElementsByClassName('megamenu-resources__desktop')[0];
        let containerCompany = document.getElementsByClassName('megamenu-company__desktop')[0];

        containerProducts.classList.add('display-none');
        containerSolutions.classList.add('display-none');
        containerResources.classList.add('display-none');
        containerCompany.classList.add('display-none');
        scrollPosition = jQuery(window).scrollTop();

        if (!isMobileExpanded) {
          removeExpandedFromHeader();
          removeNoScrollFromBody();
        }

        unflipAllDesktopMenuArrows();

        if (hasTransparentBg === true) {
          if (scrollPosition === 0) {
            addTransparentBgClassToHeader();

            if (!isAnyContainerDisplayed) {
              goBackSpan.classList.add('display-none');
            }

            if (hasDarkMenuTheme === 0) {
              $(logo).attr('src', '/resources/logo/planet_logo.svg');
              $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
              $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu.svg');
              isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();
              isMergedMenuItemsDisplayed = !document.getElementsByClassName('merged-menu-items')[0].classList.contains('display-none');

              if (!isAnyContainerDisplayed && !isMergedMenuItemsDisplayed) {
                $(goHome).removeClass('display-none');
                closingXIcon.classList.add('display-none');
              }
              else {
                if (isMergedMenuItemsDisplayed) {
                  goBackSpan.classList.add('display-none');
                }
                else {
                  goBackSpan.classList.remove('display-none');
                }
              }
            }
            else {
              $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
              $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
              $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu-black.svg');
              $(goBackSpan).addClass('display-none');
              $(goHome).removeClass('display-none');


              $(closingXIcon).addClass('display-none');
              if (isExpanded) {
                isMergedMenuItemsDisplayed = !document.getElementsByClassName('merged-menu-items')[0].classList.contains('display-none');
                isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();

                if (isAnyContainerDisplayed) {
                  $(goBackSpan).removeClass('display-none');
                  $(goHome).addClass('display-none');
                }

                if (isMergedMenuItemsDisplayed) {
                  $(goBackSpan).addClass('display-none');
                  $(goHome).removeClass('display-none');
                }


                $(closingXIcon).removeClass('display-none');
                $(hamburgerMenuIcon).addClass('display-none');
              }
              else {
                $(closingXIcon).addClass('display-none');
                $(hamburgerMenuIcon).removeClass('display-none');
              }
              removeNoScrollFromBody();
            }
          } else {
            removeTransparentBgClassFromHeader();
            isMergedMenuItemsDisplayed = !document.getElementsByClassName('merged-menu-items')[0].classList.contains('display-none');

            if (!isAnyMegamenuMobileAndTabletsContainerDisplayed() && !isMergedMenuItemsDisplayed) {
              $(goHome).removeClass('display-none');
              closingXIcon.classList.add('display-none');
              hamburgerMenuIcon.classList.remove('display-none');
              goBackSpan.classList.add('display-none');
            }
            else {
              closingXIcon.classList.remove('display-none');
              hamburgerMenuIcon.classList.add('display-none');

              if (isMergedMenuItemsDisplayed) {
                goBackSpan.classList.add('display-none');
                $(goHome).removeClass('display-none');

              }

              if (isAnyContainerDisplayed) {
                goBackSpan.classList.remove('display-none');
                $(goHome).addClass('display-none');
              }
            }
          }
        }
        else {
          isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();

          if (isAnyContainerDisplayed) {
            if (isMergedMenuItemsDisplayed) {
              hamburgerMenuIcon.classList.add('display-none');
              closingXIcon.classList.remove('display-none');
            } else {
              closingXIcon.classList.add('display-none');
              hamburgerMenuIcon.classList.remove('display-none');
            }
          }
          else {
            $(closingXIcon).addClass('display-none');

            if (isMergedMenuItemsDisplayed) {
              $(hamburgerMenuIcon).addClass('display-none');
              closingXIcon.classList.remove('display-none');
              $(goBackSpan).addClass('display-none');
              $(goHome).removeClass('display-none');
            }
            else {
              closingXIcon.classList.add('display-none');
              $(hamburgerMenuIcon).removeClass('display-none');
            }
          }
        }
      }

      if (isExpanded) {
        removeTransparentBgClassFromHeader();
        $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
      }
      else {
        closingXIcon.classList.add('display-none');
        hamburgerMenuIcon.classList.remove('display-none');

        if (scrollPosition === 0 && hasDarkMenuTheme > 0) {
          $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
          addTransparentBgClassToHeader();
        }

        if (scrollPosition === 0 && hasDarkMenuTheme === 0) {
          $(logo).attr('src', '/resources/logo/planet_logo.svg');
          if (hasTransparentBg) {
            addTransparentBgClassToHeader();
            $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo.svg');
            $(hamburgerMenuIcon).attr('style', 'display: block !important');
            $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu.svg');
            $(closingXIcon).css('display', 'none');
          }
          else {
            $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
          }
        }

        if (scrollPosition > 0 && hasDarkMenuTheme > 0) {
          $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
          $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
          removeTransparentBgClassFromHeader();
        }

        if (scrollPosition > 0 && hasDarkMenuTheme === 0) {
          $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
          $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
          removeTransparentBgClassFromHeader();
          $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu-black.svg');
        }
      }
    });
  }

  /**
   * The DOMContentLoaded event handler.
   */
  document.addEventListener('DOMContentLoaded', function() {
    let isFrontPage = $("body").hasClass("path-frontpage");
    let hasTransparentBg = !isFrontPage && ($("body, div").hasClass("planet-header-transparent") || $("body, div").hasClass("coh-hero-full-width"));
    let logo = document.getElementById('planet-logo');
    let logoMobileAndTablet = document.getElementById('planet-logo--mobile-and-tablet');
    let closingXIcon = document.getElementsByClassName('close-hamburger-menu');
    let hasDarkMenuTheme = $("body").find(".dark-menu-items").length > 0 || isFrontPage;
    let hamburgerMenuIcon = document.getElementsByClassName('hamburger-menu')[0];
    let scrollPosition = jQuery(window).scrollTop();

    if (hasDarkMenuTheme) {
      $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
      $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu-black.svg');
      $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
      $(closingXIcon).attr('src', '/resources/icons/closing-x.svg');
    }
    else {
      $(logo).attr('src', '/resources/logo/planet_logo.svg');
      $(closingXIcon).attr('src', '/resources/icons/closing-x-white.svg');
    }
    const header = document.getElementsByClassName("megamenu-header")[0];

    if (hasTransparentBg) {
      if (hasDarkMenuTheme) {
        $(header).addClass("header-dark-theme");
        $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
      }
      else {
        $(logo).attr('src', '/resources/logo/planet_logo.svg');
        $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo.svg');
        $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu.svg');
      }

      if (scrollPosition === 0) {
        addTransparentBgClassToHeader();
      }
      else {
        removeTransparentBgClassFromHeader();
        $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
        $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu-black.svg');

      }

      headerBehaviorOnScroll(header);
      headerBehaviorOnResize(header);
    }
    else {
      removeTransparentBgClassFromHeader();
      $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
      $(logoMobileAndTablet).attr('src', '/resources/logo/planet_logo_black.svg');
      $(hamburgerMenuIcon).attr('src', '/resources/icons/hamburger-menu-black.svg');
      headerBehaviorOnResize(header);
    }

    // Search for utm parameters in url.
    const urlParams = new URLSearchParams(window.location.search);
    const shortUTMTime = 8760;
    const longUTMTime = 8760;

    if (urlParams.has('utm_campaign') || urlParams.has('utm_medium') || urlParams.has('utm_source') || urlParams.has('utm_content') || urlParams.has('utm_term') || urlParams.has('gclid')){

      // Get the cookies.
      let cookies = document.cookie;
      if (cookies !== undefined) {
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmContent = urlParams.get('utm_content');
        const utmTerm = urlParams.get('utm_term');
        const gclid = urlParams.get('gclid');

        /**
         * Save recent UTMs as cookies.
         * We want to set the cookies only if they don't exist already
         */
        if (utmSource) {
          createCookie('Drupal.visitor.utm_source', utmSource, shortUTMTime);
        }
        if (utmMedium) {
          createCookie('Drupal.visitor.utm_medium', utmMedium, shortUTMTime);
        }
        if (utmCampaign) {
          createCookie('Drupal.visitor.utm_campaign', utmCampaign, shortUTMTime);
        }
        if (utmContent) {
          createCookie('Drupal.visitor.utm_content', utmContent, shortUTMTime);
        }
        if (utmTerm) {
          createCookie('Drupal.visitor.utm_term', utmTerm, shortUTMTime);
        }
        if (gclid) {
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

    let hasNotificationBar = $("body").find(".notification-bar-container:visible").length;
    let hasHero = $("body").find(".coh-hero").length;
    let hasHeroOnTop = 0;

    if (hasTransparentBg) {
      headerBehaviorOnScroll(header);
      headerBehaviorOnResize(header);
    }

    if (hasHero > 0) {
      $(".coh-hero").each(function(){
        let hero = $(this);

        if ($(this).position().top < 300){
          $(this).addClass("coh-hero-top");
          hasHeroOnTop = 1;
          // if has Hero 5050
          if($(this).hasClass("coh-hero-5050")){
            // On Mobile
            if ($(window).width() < 1023) {
              headerBehaviorwithNotificationBar(hero, header);
              headerBehaviorOnScroll(header);
              headerBehaviorOnResize(header);
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
            headerBehaviorOnResize(header);
          }
        } else {
          header.classList.add("white-bg");
          // On mobile
          if ($(window).width() < 1023) {
            if(!hasTransparentBg) {
              $("#block-cohesion-theme-content").css("padding-top","72px");
            }
          } else {
            if (hasHeroOnTop === 0){
              if(!hasTransparentBg) {
                if (hasNotificationBar > 0) {
                  $("#block-cohesion-theme-content").css("padding-top","138px");
                } else {
                  $("#block-cohesion-theme-content").css("padding-top","72px");
                }
              }
            }
          }
        }
      });

      // Pages without Hero or with Hero in the middle of the page.
    } else {
      if(!hasTransparentBg) {
        header.classList.add("white-bg");
      }
      // On mobile
      if ($(window).width() < 1023) {
        if(!hasTransparentBg) {
          $("#block-cohesion-theme-content").css("padding-top","72px");
        }
      } else {
        if (hasHeroOnTop === 0){
          if(!hasTransparentBg) {
            if (hasNotificationBar > 0) {
              $("#block-cohesion-theme-content").css("padding-top","138px");
            } else {
              $("#block-cohesion-theme-content").css("padding-top","72px");
            }
          }
        }
      }
    }
  });

  Drupal.behaviors.megaMenu = {
    attach: function (context) {
      function areHtmlCollectionsEqual(collection1, collection2) {
        // Convert HTML collections to arrays
        const array1 = Array.from(collection1);
        const array2 = Array.from(collection2);

        // Check if they have the same length
        if (array1.length !== array2.length) {
          return false;
        }

        // Compare each element
        for (let i = 0; i < array1.length; i++) {
          if (array1[i] !== array2[i]) {
            return false;
          }
        }

        return true;
      }

      function removeExpandedFromHeader() {
        const header = document.getElementsByClassName("megamenu-header")[0];
        header.classList.remove("expanded");
      }

      function process(megamenuElement, element, menuName, className) {
        let isFrontPage = $("body").hasClass("path-frontpage");
        let hasDarkMenuTheme = $("body").find(".dark-menu-items").length > 0 || isFrontPage;
        let img = $(element).children().first().children().first();
        // Hide all other menus and remove their flip class
        let menus = [
          document.getElementsByClassName('megamenu-products__desktop'),
          document.getElementsByClassName('megamenu-solutions__desktop'),
          document.getElementsByClassName('megamenu-resources__desktop'),
          document.getElementsByClassName('megamenu-company__desktop')
        ];

        let map = new Map();
        map.set('megamenu-products__desktop', 'products_img');
        map.set('megamenu-solutions__desktop', 'solutions_img');
        map.set('megamenu-resources__desktop', 'resources_img');
        map.set('megamenu-company__desktop', 'company_img');

        let logo = document.getElementById('planet-logo');
        const header = document.getElementsByClassName("megamenu-header")[0];

        menus.forEach(function (menu) {
          if (areHtmlCollectionsEqual(menu, megamenuElement)) {
            if (menu[0] !== undefined) {
              if(menu[0].classList.contains('display-none')) {
                menu[0].classList.remove('display-none');
                header.classList.add('expanded');
                removeTransparentBgClassFromHeader();
                $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
                document.getElementById(map.get(className)).classList.add('flip');
              }
              else {
                menu[0].classList.add('display-none');
                header.classList.remove('expanded');
                let scrollPosition = jQuery(window).scrollTop();

                if  (scrollPosition === 0 && !hasDarkMenuTheme) {
                  $(logo).attr('src', '/resources/logo/planet_logo.svg');
                }

                let isFrontPage = $("body").hasClass("path-frontpage");
                let hasTransparentBg = !isFrontPage && ($("body, div").hasClass("planet-header-transparent") || $("body, div").hasClass("coh-hero-full-width") || $("body, div").hasClass("coh-hero-5050"));

                if (hasTransparentBg && scrollPosition === 0) {
                  addTransparentBgClassToHeader();
                }

                if (!hasTransparentBg) {
                  $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
                }
                document.getElementById(map.get(className)).classList.remove('flip');
              }
            }
          }
          else {
            map.forEach((value, key) => {
              if (className !== key) {
                if (document.getElementsByClassName(key)[0] !== undefined) {
                  document.getElementsByClassName(key)[0].classList.add('display-none');
                  document.getElementById(value).classList.remove('flip');
                }
              }
            });
          }
        });

        // Manage the flip class.
        if (!megamenuElement[0].classList.contains('display-none')) {
          img.addClass('flip');
        } else {
          img.removeClass('flip');
        }
      }

      function hideCloseHamburgerMenu() {
        let closeHamburgerMenu = document.getElementsByClassName('close-hamburger-menu')[0];
        closeHamburgerMenu.classList.add('display-none');
        $(closeHamburgerMenu).attr('src', '/resources/icons/closing-x.svg');
      }

      function showCloseHamburgerMenu() {
        let closeHamburgerMenu = document.getElementsByClassName('close-hamburger-menu')[0];
        closeHamburgerMenu.classList.remove('display-none');
        $(closeHamburgerMenu).css('display', 'block');
        let logo = document.getElementById('planet-logo--mobile-and-tablet');
        $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
      }

      function hideHamburgerMenu() {
        let hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0];
        let logo = document.getElementById('planet-logo--mobile-and-tablet');
        hamburgerMenu.classList.add('display-none');
        let header = $(document.getElementsByClassName("megamenu-header")[0]);
        header.addClass("expanded");
        let closingIcon = document.getElementsByClassName('close-hamburger-menu')[0];
        $(closingIcon).attr('src', '/resources/icons/closing-x.svg');
        $(logo).attr('src', '/resources/logo/planet_logo_black.svg');
      }

      function addDisplayNoneToAllContainers() {
        let allContainers = [
          document.getElementsByClassName('megamenu-mobile-and-tablets__container--products')[0],
          document.getElementsByClassName('megamenu-mobile-and-tablets__container--solutions')[0],
          document.getElementsByClassName('megamenu-mobile-and-tablets__container--resources')[0],
          document.getElementsByClassName('megamenu-mobile-and-tablets__container--company')[0]
        ];

        allContainers.forEach(function (container) {
          if (!container.classList.contains('display-none')) {
            container.classList.add('display-none');
          }
        });
      }

      function isHeaderForDesktopDisplayed() {
        let insideHeaderContainer = document.getElementsByClassName('inside-header-container')[0];
        let insideHeaderContainerStyle = window.getComputedStyle(insideHeaderContainer);
        return insideHeaderContainerStyle.display !== 'none';
      }

      function hideMergedMenuItems() {
        let mergedMenuItems = document.getElementsByClassName('merged-menu-items');
        for (let i = 0; i < mergedMenuItems.length; i++) {
          mergedMenuItems[i].classList.add('display-none');
        }
      }

      function hideLogo() {
        let logo = document.getElementsByClassName('go-home');

        for (let i = 0; i < logo.length; i++) {
          logo[i].classList.add('display-none');
        }
      }

      function showLogo() {
        let logo = document.getElementsByClassName('go-home');

        for (let i = 0; i < logo.length; i++) {
          logo[i].classList.remove('display-none');
        }
      }

      function showGoBack() {
        let goBack = document.getElementsByClassName('go-back-span');

        for (let i = 0; i < goBack.length; i++) {
          goBack[i].classList.remove('display-none');
        }
      }

      function hideGoBack() {
        let goBack = document.getElementsByClassName('go-back-span');

        for (let i = 0; i < goBack.length; i++) {
          goBack[i].classList.add('display-none');
        }
      }

      function showMergedMenuItems() {
        let mergedMenuItems = document.getElementsByClassName('merged-menu-items');
        for (let i = 0; i < mergedMenuItems.length; i++) {
          mergedMenuItems[i].classList.remove('display-none');
        }
      }

      function removeExpandedFromHeader() {
        const header = document.getElementsByClassName("megamenu-header")[0];
        header.classList.remove("expanded");
      }

      function manageHasTransparentBgClass() {
        const header = document.getElementsByClassName("megamenu-header")[0];
        let scrollPosition = jQuery(window).scrollTop();
        let isExpanded = header.classList.contains("expanded");
        let hasDarkMenuTheme = $("body").find(".dark-menu-items").length > 0 || $("body").hasClass("path-frontpage");
        let isFrontPage = $("body").hasClass("path-frontpage");
        let logo = $(document.getElementById('planet-logo'));

        let hasTransparentBg = !isFrontPage && ($("body, div").hasClass("planet-header-transparent") || $("body, div").hasClass("coh-hero-full-width"));
        if (isExpanded) {
          header.classList.remove("has-transparent-bg");
        }
        else {
          if (scrollPosition === 0 && hasTransparentBg) {
            addTransparentBgClassToHeader();
            if (!hasDarkMenuTheme) {
              logo.attr('src', '/resources/logo/planet_logo.svg');
            }
          }
          if (scrollPosition > 0 && hasTransparentBg) {
            removeTransparentBgClassFromHeader();
          }
        }
      }

      /**
       * Manages the behaviour of the group of menu elements when user clicks on them.
       */
      once('select_menu_items', '.business-li', context).forEach(function (element) {
        let elementId = $(element)[0].id;

        $(element).click(()=> {
          switch(elementId) {
            case 'products':
              let megamenuProducts = document.getElementsByClassName('megamenu-products__desktop');
              process(megamenuProducts, element, 'products', 'megamenu-products__desktop');
              currentlyOpenMenuItem = 'products';
              break;
            case 'solutions':
              let megamenuSolutions = document.getElementsByClassName('megamenu-solutions__desktop');
              process(megamenuSolutions, element, 'solutions', 'megamenu-solutions__desktop');
              currentlyOpenMenuItem = 'solutions';
              break;
            case 'resources':
              let megamenuResources = document.getElementsByClassName('megamenu-resources__desktop');
              process(megamenuResources, element, 'resources', 'megamenu-resources__desktop');
              currentlyOpenMenuItem = 'resources';
              break;
            case 'company':
              let megamenuCompany = document.getElementsByClassName('megamenu-company__desktop');
              process(megamenuCompany, element, 'company', 'megamenu-company__desktop');
              currentlyOpenMenuItem = 'company';
              break;
          }
        });
      });

      /**
       * Manages the hover effect on the menu items.
       */
      once('hover_effect', '.megamenu-column__item', context).forEach(function(element) {
        // Mouse over
        const imgElement = $(element).children().children()[0];
        const originalSrc = imgElement.src;

        $(element).on('mouseover', function() {
          if (originalSrc !== undefined && !imgElement.src.includes('_lavender.svg')) {
            imgElement.src = originalSrc.replace('.svg', '_lavender.svg');
          }
        });

        $(element).on('mouseleave', function() {
          // Mouse leave
          if (imgElement.src !== undefined && imgElement.src.includes('_lavender.svg')) {
            imgElement.src = originalSrc;
          }
        });
      });

      /**
       * Manages the behaviour of the mega-menu when hamburger menu icon is clicked.
       */
      once('hamburgerMenu_handler', '.hamburger-menu', context).forEach(function (element) {
        element.addEventListener('click', function() {
          let logo = document.getElementsByClassName('go-home')[0];
          let logoMobileAndTablet = document.getElementsByClassName('go-home')[1];
          hideHamburgerMenu();

          if (!isHeaderForDesktopDisplayed()) {
            showCloseHamburgerMenu();
            let mergedMenuItems = document.getElementsByClassName('merged-menu-items')[0];
            $(mergedMenuItems).removeClass('display-none');
            let megamenuMobileAndTablets = document.getElementsByClassName('megamenu-mobile-and-tablets')[0];
            megamenuMobileAndTablets.classList.remove('display-none');
          }
        });
      });

      /**
       * Manages the behaviour of the mega-menu when close hamburger menu icon is clicked.
       */
      once('closeHamburgerMenu_handler', '.close-hamburger-menu', context).forEach(function (element) {
        let isMobileAndTabletsExpanded = !document.getElementsByClassName("megamenu-mobile-and-tablets")[0].classList.contains("display-none");

        element.addEventListener('click', function() {
          if (!isHeaderForDesktopDisplayed()) {
            let hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0];
            hamburgerMenu.classList.remove('display-none');
            hamburgerMenu.classList.add('rotate-left');
            element.classList.add('display-none');
            let megamenuMobileAndTablets = document.getElementsByClassName('megamenu-mobile-and-tablets')[0];
            megamenuMobileAndTablets.classList.add('display-none');
            hideGoBack();
            showLogo();
            addDisplayNoneToAllContainers();
            showMergedMenuItems();
            showHamburgerMenu();
            removeNoScrollFromBody();

            if (!isMobileAndTabletsExpanded) {
              removeExpandedFromHeader();
            }

            currentlyOpenMenuItem = null;

            let scrollPosition = jQuery(window).scrollTop();
            let hasTransparentBg = !$("body").hasClass("path-frontpage") && ($("body, div").hasClass("planet-header-transparent") || $("body, div").hasClass("coh-hero-full-width"));
            let hasDarkMenuTheme = $("body").find(".dark-menu-items").length > 0 || $("body").hasClass("path-frontpage");
            let closingXIcon = document.getElementsByClassName('close-hamburger-menu');

            if (scrollPosition === 0) {
              if (hasTransparentBg) {
                if (hasDarkMenuTheme) {
                  $(document.getElementById('planet-logo--mobile-and-tablet')).attr('src', '/resources/logo/planet_logo_black.svg');
                  $(closingXIcon).attr('src', '/resources/icons/closing-x.svg');
                }
                else {
                  addTransparentBgClassToHeader();
                  $(document.getElementById('planet-logo--mobile-and-tablet')).attr('src', '/resources/logo/planet_logo.svg');
                  $(hamburgerMenu).attr('src', '/resources/icons/hamburger-menu.svg');
                }
              }
            }
          }
        });
      });

      /**
       * Manages the behaviour of the mega-menu when the item's right arrow is clicked.
       *
       * It concerns only mobile-and-tablet version.
       */
      once('megamenuMobileAndTablets_handler', '.arrow-right-anchor', context).forEach(function (element) {
        element.addEventListener('click', function() {
          let id = element.id;

          switch (id) {
            case 'anchor-products':
              let containerProducts = document.getElementsByClassName('megamenu-mobile-and-tablets__container--products')[0];
              addDisplayNoneToAllContainers();

              if (containerProducts.classList.contains('display-none')) {
                containerProducts.classList.remove('display-none');
                currentlyOpenMenuItem = 'products';
                hideMergedMenuItems();
                addNoScrollToBody();
                hideLogo();
                showGoBack();
              }
              break;
            case 'anchor-solutions':
              let containerSolutions = document.getElementsByClassName('megamenu-mobile-and-tablets__container--solutions')[0];
              addDisplayNoneToAllContainers();

              if (containerSolutions.classList.contains('display-none')) {
                containerSolutions.classList.remove('display-none');
                currentlyOpenMenuItem = 'solutions';
                hideMergedMenuItems();
                addNoScrollToBody();
                hideLogo();
                showGoBack();
              }
              break;
            case 'anchor-resources':
              let containerResources = document.getElementsByClassName('megamenu-mobile-and-tablets__container--resources')[0];
              addDisplayNoneToAllContainers();

              if (containerResources.classList.contains('display-none')) {
                containerResources.classList.remove('display-none');
                currentlyOpenMenuItem = 'resources';
                hideMergedMenuItems();
                addNoScrollToBody();
                hideLogo();
                showGoBack();
              }
              break;
            case 'anchor-company':
              let containerCompany = document.getElementsByClassName('megamenu-mobile-and-tablets__container--company')[0];
              addDisplayNoneToAllContainers();

              if (containerCompany.classList.contains('display-none')) {
                containerCompany.classList.remove('display-none');
                currentlyOpenMenuItem = 'company';
                hideMergedMenuItems();
                addNoScrollToBody();
                hideLogo();
                showGoBack();
              }

              break;
          }
        });
      });

      /**
       * Handles click-away functionality.
       */
      $(document).on('click', function (e) {
        const headerElement = document.getElementsByTagName('header')[0];
        const megamenuDesktopElement = document.getElementsByClassName('megamenu-complex-container')[0];
        const megamenuMobileElement = document.getElementsByClassName('megamenu-mobile-and-tablets')[0];

        if (
          !(headerElement && headerElement.contains(e.target)) &&
          !(megamenuDesktopElement && megamenuDesktopElement.contains(e.target)) &&
          !(megamenuMobileElement && megamenuMobileElement.contains(e.target))
        ) {
          setTimeout(() => {
            switch (currentlyOpenMenuItem) {
              case 'products':
                let containerProducts = document.getElementsByClassName('megamenu-products__desktop')[0];
                containerProducts.classList.add('display-none');
                removeExpandedFromHeader();
                manageHasTransparentBgClass();
                currentlyOpenMenuItem = null;
                unflipAllDesktopMenuArrows();
                break;
              case 'solutions':
                let containerSolutions = document.getElementsByClassName('megamenu-solutions__desktop')[0];
                containerSolutions.classList.add('display-none');
                removeExpandedFromHeader();
                manageHasTransparentBgClass();
                currentlyOpenMenuItem = null;
                unflipAllDesktopMenuArrows();
                break;
              case 'resources':
                let containerResources = document.getElementsByClassName('megamenu-resources__desktop')[0];
                containerResources.classList.add('display-none');
                removeExpandedFromHeader();
                manageHasTransparentBgClass();
                currentlyOpenMenuItem = null;
                unflipAllDesktopMenuArrows();
                break;
              case 'company':
                let containerCompany = document.getElementsByClassName('megamenu-company__desktop')[0];
                containerCompany.classList.add('display-none');
                removeExpandedFromHeader();
                manageHasTransparentBgClass();
                currentlyOpenMenuItem = null;
                unflipAllDesktopMenuArrows();
                break;
              default:
                megamenuMobileElement.classList.add('display-none');
                hideCloseHamburgerMenu();
                showHamburgerMenu();
                unflipAllDesktopMenuArrows();
                break;
            }
          }, 300);
        }
      });

      /**
       * Handles the behaviour of the menu when go-back icon is clicked.
       */
      once('go-back-handler', '.go-back-span', context).forEach(function (element) {
        element.addEventListener('click', function() {
          switch (currentlyOpenMenuItem) {
            case 'products':
              let containerProducts = document.getElementsByClassName('megamenu-mobile-and-tablets__container--products')[0];
              containerProducts.classList.add('display-none');
              showMergedMenuItems();
              removeNoScrollFromBody();
              showLogo();
              hideGoBack();
              break;
            case 'solutions':
              let containerSolutions = document.getElementsByClassName('megamenu-mobile-and-tablets__container--solutions')[0];
              containerSolutions.classList.add('display-none');
              showMergedMenuItems();
              removeNoScrollFromBody();
              showLogo();
              hideGoBack();
              break;
            case 'resources':
              let containerResources = document.getElementsByClassName('megamenu-mobile-and-tablets__container--resources')[0];
              containerResources.classList.add('display-none');
              showMergedMenuItems();
              removeNoScrollFromBody();
              showLogo();
              hideGoBack();
              break;
            case 'company':
              let containerCompany = document.getElementsByClassName('megamenu-mobile-and-tablets__container--company')[0];
              containerCompany.classList.add('display-none');
              showMergedMenuItems();
              removeNoScrollFromBody();
              showLogo();
              hideGoBack();
              break;
          }
        });
      });
    }
  };
})(jQuery, Drupal);
