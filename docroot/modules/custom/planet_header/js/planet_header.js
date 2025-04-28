(function (Drupal) {
  "use strict";
  let currentlyOpenMenuItem = null;

  function showBlackHamburgerMenu() {
    let hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0];
    hamburgerMenu.classList.remove('display-none');
  }

  function isFrontpage() {
    let currentPath = window.location.pathname;
    let body = document.body;

    return (body.classList.contains("path-frontpage") && body.querySelectorAll(".home-hero").length > 0) || currentPath === "/new" || currentPath === "/homepage-prototype-v2";
  }

  function addTransparentBgClassToHeader() {
    const header = document.getElementsByClassName("megamenu-header")[0];
    header.classList.add("has-transparent-bg");
  }

  function removeTransparentBgClassFromHeader() {
    const header = document.getElementsByClassName("megamenu-header")[0];
    header.classList.remove("has-transparent-bg");
  }

  function pageHasTransparentBackground() {
    let isFrontPage = isFrontpage();
    let potentiallyTransparent = document.querySelectorAll("body, div");

    return isFrontPage || Array.from(potentiallyTransparent).some(el =>
      el.classList.contains("planet-header-transparent") ||
      el.classList.contains("coh-hero-full-width")
    );
  }

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

  function switchHamburgerMenuLogoWhite() {
    let hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0];
    if (hamburgerMenu) {
      hamburgerMenu.src = '/resources/icons/hamburger-menu.svg';
    }
  }

  function switchHamburgerMenuLogoBlack() {
    let hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0];
    if (hamburgerMenu) {
      hamburgerMenu.src = '/resources/icons/hamburger-menu-black.svg';
    }
  }

  function cookieExists(name) {
    return document.cookie.indexOf(name) !== -1;
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

  function hideCloseHamburgerMenu() {
    let closeHamburgerMenu = document.getElementsByClassName('close-hamburger-menu')[0];
    closeHamburgerMenu.classList.add('display-none');
    closeHamburgerMenu.setAttribute('src', '/resources/icons/closing-x.svg');
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

  function setDownArrowsColorWhite() {
    const arrows = document.querySelectorAll('.business-link img');

    arrows.forEach(arrow => {
      arrow.src = '/resources/icons/arrow-down--white.svg';
    });
  }

  function setDownArrowsColorPink() {
    const arrows = document.querySelectorAll('.business-link img');

    arrows.forEach(arrow => {
      arrow.src = '/resources/icons/arrow-down.svg';
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

  function changeHeaderBackgroundColor(hexColor) {
    let header = document.getElementsByClassName('megamenu-header')[0];
    header.style.backgroundColor = hexColor;
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

  function headerBehaviorwithNotificationBar(hero, header) {
    document.addEventListener("DOMContentLoaded", function () {
      const notificationBar = document.querySelector(".notification-bar-container");
      const isNotificationBarVisible = notificationBar && notificationBar.offsetParent !== null;

      const blockCoheshionThemeContent = document.getElementById("block-cohesion-theme-content");

      if (isNotificationBarVisible) {
        header.classList.add("white-bg");

        const closeButton = document.querySelector(".notification-bar-button");
        if (closeButton) {
          closeButton.addEventListener("click", function () {
            header.classList.remove("white-bg");
            if (blockCoheshionThemeContent) {
              blockCoheshionThemeContent.style.paddingTop = "0px";
            }

            if (hero.classList.contains("coh-hero-full-width")) {
              hero.style.top = "0px";
            }
          });
        }
      } else {
        header.classList.remove("white-bg");

        if (blockCoheshionThemeContent) {
          blockCoheshionThemeContent.style.paddingTop = "0px";
        }

        hero.classList.add("menu-invisible");

        const heroBackgrounds = document.querySelectorAll(".hero-background");
        heroBackgrounds.forEach(bg => bg.classList.add("menu-invisible"));
      }
    });
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

  function processDesktopMenuItemInteraction(megamenuElement, element, menuName, className) {
    let isFrontPage = isFrontpage();

    let hasDarkMenuTheme = document.querySelectorAll("body .dark-menu-items").length > 0;
    let img = document.querySelector('span#' + menuName + ' .business-link img');
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
        menu = menu[0];

        if (menu !== undefined) {
          if (menu.classList.contains('display-none')) {
            menu.classList.remove('display-none');
            header.classList.add('expanded');
            setDownArrowsColorPink();
            removeTransparentBgClassFromHeader();
            if (hasDarkMenuTheme) {
              logo.src = '/resources/logo/planet_logo_black.svg';
            }
            document.getElementById(map.get(className)).classList.add('flip');

            if (isFrontPage) {
              changeHeaderBackgroundColor('#ffffff');
            }
          }
          else {
            menu.classList.add('display-none');
            header.classList.remove('expanded');
            let scrollPosition = window.scrollY;

            if  (scrollPosition === 0 && !hasDarkMenuTheme) {
              logo.src = '/resources/logo/planet_logo.svg';
            }
            let isFrontPage = isFrontpage();

            if (isFrontPage) {
              changeHeaderBackgroundColor('#ffffff');
            }
            let potentiallyTransparent = document.querySelectorAll('body, div');
            let body = document.body;

            let hasPageTransparentBackground =
              !body.classList.contains('plnt-css-node-46') &&
              (
                isFrontPage ||
                Array.from(potentiallyTransparent).some(el =>
                  el.classList.contains('planet-header-transparent') ||
                  el.classList.contains('coh-hero-full-width') ||
                  el.classList.contains('coh-hero-5050')
                )
              );

            if (hasPageTransparentBackground && scrollPosition === 0) {
              addTransparentBgClassToHeader();

              if (!hasDarkMenuTheme) {
                setDownArrowsColorWhite();
              }
            }

            if (!hasPageTransparentBackground) {
              document.getElementById('planet-logo').src = '/resources/logo/planet_logo_black.svg';
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
      img.classList.add('flip');
    } else {
      img.classList.remove('flip');
    }
  }

  function manageHasTransparentBgClass() {
    const header = document.getElementsByClassName("megamenu-header")[0];
    let scrollPosition = window.scrollY;
    let isExpanded = header.classList.contains("expanded");
    let hasDarkMenuTheme = document.querySelectorAll(".dark-menu-items").length > 0;
    let logo = document.getElementById('planet-logo');

    if (isExpanded) {
      header.classList.remove("has-transparent-bg");
      setDownArrowsColorPink();
    }
    else {
      if (scrollPosition === 0 && pageHasTransparentBackground()) {
        addTransparentBgClassToHeader();
        if (!hasDarkMenuTheme) {
          setDownArrowsColorWhite();
          logo.src = '/resources/logo/planet_logo.svg';
        }
      }
      if (scrollPosition > 0 && pageHasTransparentBackground()) {
        removeTransparentBgClassFromHeader();
        setDownArrowsColorPink();
      }
    }
  }

  /**
   * Manages how the header behaves when the user scrolls the page vertically.
   */
  function headerBehaviorOnScroll() {
    let logo = document.getElementById('planet-logo');
    let logoMobileAndTablet = document.getElementById('planet-logo--mobile-and-tablet');
    let hasDarkMenuTheme =
      document.querySelectorAll('body .dark-menu-items').length +
      document.querySelectorAll('body .path-frontpage').length;
    let isFrontPage = isFrontpage();

    window.addEventListener('scroll', function () {
      let isExpanded = document.getElementsByClassName("megamenu-header")[0].classList.contains("expanded");
      let scrollPosition = window.scrollY;

      if (isExpanded) {
        removeTransparentBgClassFromHeader();
        logo.src = '/resources/logo/planet_logo_black.svg';
        setDownArrowsColorPink();

      }
      else {
        let megamenuHeader = document.querySelector('.megamenu-header');
        let megamenuHasTransparentBgClass = megamenuHeader?.classList.contains('has-transparent-bg') || false;

        if (scrollPosition === 0 && hasDarkMenuTheme > 0) {
          logo.src = '/resources/logo/planet_logo_black.svg';
          addTransparentBgClassToHeader();
        }

        if (scrollPosition === 0 && hasDarkMenuTheme === 0) {
         logo.src ='/resources/logo/planet_logo.svg';

          if (megamenuHasTransparentBgClass) {
            setDownArrowsColorWhite();
          }

          if (pageHasTransparentBackground()) {
            addTransparentBgClassToHeader();
            logoMobileAndTablet.src = '/resources/logo/planet_logo.svg';
            switchHamburgerMenuLogoWhite();
          }
          else {
            logo.src = '/resources/logo/planet_logo_black.svg';
          }
        }

        if (scrollPosition > 0) {
          if (isFrontPage) {
            changeHeaderBackgroundColor("#ffffff");
          }
          else {
            changeHeaderBackgroundColor('#ffffff');
          }
        }

        if (scrollPosition > 0 && hasDarkMenuTheme > 0) {
          logoMobileAndTablet.src ='/resources/logo/planet_logo_black.svg';
          logo.src = '/resources/logo/planet_logo_black.svg';
          removeTransparentBgClassFromHeader();
        }

        if (scrollPosition > 0 && hasDarkMenuTheme === 0) {
          setDownArrowsColorPink();
          logo.src = '/resources/logo/planet_logo_black.svg';
          logo.src = '/resources/logo/planet_logo_black.svg';
          removeTransparentBgClassFromHeader();
          switchHamburgerMenuLogoBlack();
        }
      }
    });
  }

  function headerBehaviorOnResize() {
    let logo = document.getElementById('planet-logo');
    let logoMobileAndTablet = document.getElementById('planet-logo--mobile-and-tablet');
    let body = document.body;
    let hasDarkMenuTheme =
      body.querySelectorAll(".dark-menu-items").length +
      body.querySelectorAll(".path-frontpage").length;
    let megamenuMobileAndTablets = document.getElementsByClassName('megamenu-mobile-and-tablets')[0];
    let hamburgerMenuIcon = document.getElementsByClassName('hamburger-menu')[0];
    let closingXIcon = document.getElementsByClassName('close-hamburger-menu')[0];
    let goBackSpan = document.getElementsByClassName('go-back-span')[0];
    let goHome = document.getElementsByClassName('go-home')[1];
    let goHomeDesktop = document.getElementsByClassName('go-home')[0];
    let scrollPosition = window.scrollY;
    let isMergedMenuItemsDisplayed = !document.getElementsByClassName('merged-menu-items')[0].classList.contains('display-none');
    let mergedMenuItems = document.getElementsByClassName('merged-menu-items')[0];

    window.addEventListener('resize', () => {
      let isExpanded = document.getElementsByClassName("megamenu-header")[0].classList.contains("expanded");
      if (window.innerWidth > 1023) {
        mergedMenuItems.classList.add('display-none');
        megamenuMobileAndTablets.classList.add('display-none');
        let megamenuMobileAndTabletsContainer = document.getElementsByClassName('megamenu-mobile-and-tablets__container')[0];
        megamenuMobileAndTabletsContainer.classList.add('display-none');

        if (pageHasTransparentBackground() === true) {
          if (!isAnyDesktopMenuExpanded()) {
            addTransparentBgClassToHeader();
            removeExpandedFromHeader();
            if (scrollPosition === 0) {
              if (hasDarkMenuTheme === 0) {
                setDownArrowsColorWhite();
              }
            }
          }

          goHomeDesktop.classList.remove('display-none');
        }
        else {
          if (scrollPosition === 0) {
            // addTransparentBgClassToHeader();
          }
          else {
            removeTransparentBgClassFromHeader();
          }
          goHomeDesktop.classList.remove('display-none');
          logoMobileAndTablet.src = '/resources/logo/planet_logo_black.svg';
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
        scrollPosition = window.scrollY;

        if (!isMobileExpanded) {
          removeExpandedFromHeader();
          removeNoScrollFromBody();
        }

        unflipAllDesktopMenuArrows();

        if (pageHasTransparentBackground() === true) {
          if (scrollPosition === 0) {
            addTransparentBgClassToHeader();

            let isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();

            if (!isAnyContainerDisplayed) {
              goBackSpan.classList.add('display-none');
            }

            if (hasDarkMenuTheme === 0) {
              logo.src ='/resources/logo/planet_logo.svg';
              logoMobileAndTablet.src = '/resources/logo/planet_logo_black.svg';
              switchHamburgerMenuLogoWhite();
              isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();
              isMergedMenuItemsDisplayed = !document.getElementsByClassName('merged-menu-items')[0].classList.contains('display-none');

              if (!isAnyContainerDisplayed && !isMergedMenuItemsDisplayed) {
                goHome.classList.remove('display-none');
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
              logo.scr = '/resources/logo/planet_logo_black.svg';
              logoMobileAndTablet.src = '/resources/logo/planet_logo_black.svg';
              switchHamburgerMenuLogoBlack();
              goBackSpan.classList.add('display-none');
              goHome.classList.remove('display-none');
              closingXIcon.classList.add('display-none');
              if (isExpanded) {
                isMergedMenuItemsDisplayed = !document.getElementsByClassName('merged-menu-items')[0].classList.contains('display-none');
                isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();

                if (isAnyContainerDisplayed) {
                  goBackSpan.classList.remove('display-none');
                  goHome.classList.add('display-none');
                }

                if (isMergedMenuItemsDisplayed) {
                  goBackSpan.classList.add('display-none');
                  goHome.classList.remove('display-none');
                }

                closingXIcon.classList.remove('display-none');
                hamburgerMenuIcon.classList.add('display-none');
              }
              else {
                closingXIcon.classList.add('display-none');
                hamburgerMenuIcon.classList.remove('display-none');
              }
              removeNoScrollFromBody();
            }
          } else {
            removeTransparentBgClassFromHeader();
            isMergedMenuItemsDisplayed = !document.getElementsByClassName('merged-menu-items')[0].classList.contains('display-none');

            if (!isAnyMegamenuMobileAndTabletsContainerDisplayed() && !isMergedMenuItemsDisplayed) {
              goHome.classList.remove('display-none');
              closingXIcon.classList.add('display-none');
              hamburgerMenuIcon.classList.remove('display-none');
              goBackSpan.classList.add('display-none');
            }
            else {
              closingXIcon.classList.remove('display-none');
              hamburgerMenuIcon.classList.add('display-none');

              if (isMergedMenuItemsDisplayed) {
                goBackSpan.classList.add('display-none');
                goHome.classList.remove('display-none');
              }

              let isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();

              if (isAnyContainerDisplayed) {
                goBackSpan.classList.remove('display-none');
                goHome.classList.add('display-none');
              }
            }
          }
        }
        else {
          let isAnyContainerDisplayed = isAnyMegamenuMobileAndTabletsContainerDisplayed();

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
            closingXIcon.classList.add('display-none');

            if (isMergedMenuItemsDisplayed) {
              hamburgerMenuIcon.classList.add('display-none');
              closingXIcon.classList.remove('display-none');
              document.querySelector('.go-back-span').classList.add('display-none');
              document.querySelector('.go-home').classList.remove('display-none');
            }
            else {
              closingXIcon.classList.add('display-none');
              hamburgerMenuIcon.classList.remove('display-none');
            }
          }
        }
      }

      if (isExpanded) {
        removeTransparentBgClassFromHeader();
        logo.src = '/resources/logo/planet_logo_black.svg';
      }
      else {
        closingXIcon.classList.add('display-none');
        hamburgerMenuIcon.classList.remove('display-none');

        if (scrollPosition === 0 && hasDarkMenuTheme > 0) {
          logo.src = '/resources/logo/planet_logo_black.svg';
          addTransparentBgClassToHeader();
        }

        if (scrollPosition === 0 && hasDarkMenuTheme === 0) {
          logo.src = '/resources/logo/planet_logo.svg';

          if (pageHasTransparentBackground()) {
            addTransparentBgClassToHeader();
            logoMobileAndTablet.src = '/resources/logo/planet_logo.svg';
            hamburgerMenuIcon.style.display = 'block';
            hamburgerMenuIcon.src = '/resources/icons/hamburger-menu.svg';
            closingXIcon.style.display = 'none';
          } else {
            logo.src = '/resources/logo/planet_logo_black.svg';
          }
        }

        if (scrollPosition > 0 && hasDarkMenuTheme > 0) {
          logoMobileAndTablet.src = '/resources/logo/planet_logo_black.svg';
          logo.src = '/resources/logo/planet_logo_black.svg';
          removeTransparentBgClassFromHeader();
        }

        if (scrollPosition > 0 && hasDarkMenuTheme === 0) {
          logo.src = '/resources/logo/planet_logo_black.svg';
          logoMobileAndTablet.src = '/resources/logo/planet_logo_black.svg';
          removeTransparentBgClassFromHeader();
          hamburgerMenuIcon.src = '/resources/icons/hamburger-menu-black.svg';
        }
      }
    });
  }

  /**
   * The DOMContentLoaded event handler.
   */  document.addEventListener('DOMContentLoaded', function() {
    window.requestAnimationFrame(() => {
      document.getElementById('page-loader').style.display = "none";
      let logo = document.getElementById('planet-logo');
      let logoMobileAndTablet = document.getElementById('planet-logo--mobile-and-tablet');
      let closingXIcon = document.getElementsByClassName('close-hamburger-menu')[0];
      let isFrontPage = isFrontpage();
      let hasDarkMenuTheme = document.querySelector('.dark-menu-items') !== null && !isFrontPage;
      let hamburgerMenuIcon = document.getElementsByClassName('hamburger-menu')[0];
      let scrollPosition = window.scrollY;
      let header = document.querySelector('.megamenu-header');
      let isMegamenuHeaderExpanded = header.classList.contains("expanded");

      if (hasDarkMenuTheme) {
        logoMobileAndTablet.src = '/resources/logo/planet_logo_black.svg';
        switchHamburgerMenuLogoBlack();
        logo.src = '/resources/logo/planet_logo_black.svg';
        closingXIcon.src = '/resources/icons/closing-x.svg';
      } else {
        switchHamburgerMenuLogoWhite();
        logo.src = '/resources/logo/planet_logo.svg';
        closingXIcon.src = '/resources/icons/closing-x-white.svg';
      }

      if (pageHasTransparentBackground()) {
        if (hasDarkMenuTheme) {
          header.classList.add("header-dark-theme");
          logo.src = '/resources/logo/planet_logo_black.svg';

          if (scrollPosition > 0) {
            if (!isFrontpage()) {
              var megamenuHeaders = document.querySelectorAll('.megamenu-header');
              megamenuHeaders.forEach(function(headerEl) {
                headerEl.style.backgroundColor = '#ffffff';
              });
            } else {
              header.style.backgroundColor = '#ffffff';
            }
          }
        } else {
          if (isMegamenuHeaderExpanded) {
            setDownArrowsColorPink();
          } else {
            if (scrollPosition === 0) {
              if (!isMegamenuHeaderExpanded) {
                setDownArrowsColorWhite();
                if (isFrontpage()) {
                  switchHamburgerMenuLogoWhite();
                }
              } else {
                setDownArrowsColorPink();
              }
            } else {
              if (!isFrontpage()) {
                header.style.backgroundColor = '#ffffff';
              } else {
                header.style.backgroundColor = '#ffffff';
              }
              removeTransparentBgClassFromHeader();
              logo.src = '/resources/logo/planet_logo_black.svg';
            }
          }

          logoMobileAndTablet.src = '/resources/logo/planet_logo.svg';
          switchHamburgerMenuLogoWhite();
        }

        if (scrollPosition === 0) {
          addTransparentBgClassToHeader();
        } else {
          setDownArrowsColorPink();
          removeTransparentBgClassFromHeader();
          logoMobileAndTablet.src = '/resources/logo/planet_logo_black.svg';
          hamburgerMenuIcon.src = '/resources/icons/hamburger-menu-black.svg';
        }

        headerBehaviorOnScroll(header);
        headerBehaviorOnResize(header);
      } else {
        removeTransparentBgClassFromHeader();
        logo.src = '/resources/logo/planet_logo_black.svg';
        logoMobileAndTablet.src = '/resources/logo/planet_logo_black.svg';
        switchHamburgerMenuLogoBlack();
        headerBehaviorOnResize(header);
        headerBehaviorOnScroll(header);
        header.style.backgroundColor = '#ffffff';
      }

      const urlParams = new URLSearchParams(window.location.search);
      const shortUTMTime = 8760;
      const longUTMTime = 8760;

      if (urlParams.has('utm_campaign') || urlParams.has('utm_medium') || urlParams.has('utm_source') || urlParams.has('utm_content') || urlParams.has('utm_term') || urlParams.has('gclid')) {

        let cookies = document.cookie;
        if (cookies !== undefined) {
          const utmSource = urlParams.get('utm_source');
          const utmMedium = urlParams.get('utm_medium');
          const utmCampaign = urlParams.get('utm_campaign');
          const utmContent = urlParams.get('utm_content');
          const utmTerm = urlParams.get('utm_term');
          const gclid = urlParams.get('gclid');

          if (utmSource) createCookie('Drupal.visitor.utm_source', utmSource, shortUTMTime);
          if (utmMedium) createCookie('Drupal.visitor.utm_medium', utmMedium, shortUTMTime);
          if (utmCampaign) createCookie('Drupal.visitor.utm_campaign', utmCampaign, shortUTMTime);
          if (utmContent) createCookie('Drupal.visitor.utm_content', utmContent, shortUTMTime);
          if (utmTerm) createCookie('Drupal.visitor.utm_term', utmTerm, shortUTMTime);
          if (gclid) createCookie('Drupal.visitor.gclid', gclid, shortUTMTime);

          if (utmSource && !cookieExists('Drupal.visitor.orig_utm_source')) createCookie('Drupal.visitor.orig_utm_source', utmSource, longUTMTime);
          if (utmMedium && !cookieExists('Drupal.visitor.orig_utm_medium')) createCookie('Drupal.visitor.orig_utm_medium', utmMedium, longUTMTime);
          if (utmCampaign && !cookieExists('Drupal.visitor.orig_utm_campaign')) createCookie('Drupal.visitor.orig_utm_campaign', utmCampaign, longUTMTime);
          if (utmContent && !cookieExists('Drupal.visitor.orig_utm_content')) createCookie('Drupal.visitor.orig_utm_content', utmContent, longUTMTime);
          if (utmTerm && !cookieExists('Drupal.visitor.orig_utm_term')) createCookie('Drupal.visitor.orig_utm_term', utmTerm, longUTMTime);
        }
      }

      let body = document.body;
      let notificationBars = body.querySelectorAll(".notification-bar-container");

      function isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
      }

      let visibleNotificationBars = Array.from(notificationBars).filter(isVisible);
      let hasNotificationBar = visibleNotificationBars.length;
      let hasHero = body.querySelectorAll(".coh-hero").length;
      let hasHeroOnTop = 0;

      if (pageHasTransparentBackground()) {
        headerBehaviorOnScroll(header);
        headerBehaviorOnResize(header);
      }

      if (hasHero > 0) {
        var cohHeroes = document.querySelectorAll(".coh-hero");

        cohHeroes.forEach(function(element) {
          var hero = element instanceof HTMLElement ? element : element[0];

          if (hero.offsetTop < 300) {
            hero.classList.add("coh-hero-top");
            hasHeroOnTop = 1;

            if (hero.classList.contains("coh-hero-5050")) {
              if (window.innerWidth < 1023) {
                headerBehaviorwithNotificationBar(hero, header);
                headerBehaviorOnScroll(header);
                headerBehaviorOnResize(header);
              } else {
                header.classList.add("white-bg");
              }
            } else if (hero.classList.contains("coh-hero-full-width")) {
              if (window.innerWidth < 1023) {
                headerBehaviorwithNotificationBar(hero, header);
              }
              headerBehaviorOnScroll(header);
              headerBehaviorOnResize(header);
            }
          } else {
            header.classList.add("white-bg");

            if (window.innerWidth < 1023) {
              if (!pageHasTransparentBackground()) {
                var contentElement = document.getElementById("block-cohesion-theme-content");
                if (contentElement) contentElement.style.paddingTop = "72px";
              }
            } else {
              if (hasHeroOnTop === 0) {
                if (!pageHasTransparentBackground()) {
                  var blockContent = document.getElementById("block-cohesion-theme-content");
                  if (blockContent) {
                    blockContent.style.paddingTop = (hasNotificationBar > 0) ? "138px" : "72px";
                  }
                }
              }
            }
          }
        });
      } else {
        if (!pageHasTransparentBackground()) {
          header.classList.add("white-bg");
        }
        var blockContent = document.getElementById("block-cohesion-theme-content");

        if (window.innerWidth < 1023) {
          if (!pageHasTransparentBackground()) {
            if (blockContent) blockContent.style.paddingTop = "72px";
          }
        } else {
          if (hasHeroOnTop === 0) {
            if (!pageHasTransparentBackground()) {
              if (blockContent) {
                blockContent.style.paddingTop = (hasNotificationBar > 0) ? "138px" : "72px";
              }
            }
          }
        }
      }

    });
  });
  ;

  Drupal.behaviors.megaMenu = {
    attach: function (context) {

      /**
       * Manages the behaviour of the group of menu elements when user clicks on them.
       */
      once('select_menu_items', '.business-li', context).forEach(function (element) {
        let elementId = element.id;

        element.addEventListener('click', () => {
          switch(elementId) {
            case 'products':
              let megamenuProducts = document.getElementsByClassName('megamenu-products__desktop');
              processDesktopMenuItemInteraction(megamenuProducts, element, 'products', 'megamenu-products__desktop');
              currentlyOpenMenuItem = 'products';
              break;
            case 'solutions':
              let megamenuSolutions = document.getElementsByClassName('megamenu-solutions__desktop');
              processDesktopMenuItemInteraction(megamenuSolutions, element, 'solutions', 'megamenu-solutions__desktop');
              currentlyOpenMenuItem = 'solutions';
              break;
            case 'resources':
              let megamenuResources = document.getElementsByClassName('megamenu-resources__desktop');
              processDesktopMenuItemInteraction(megamenuResources, element, 'resources', 'megamenu-resources__desktop');
              currentlyOpenMenuItem = 'resources';
              break;
            case 'company':
              let megamenuCompany = document.getElementsByClassName('megamenu-company__desktop');
              processDesktopMenuItemInteraction(megamenuCompany, element, 'company', 'megamenu-company__desktop');
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
        const imgElement = element.firstElementChild?.firstElementChild || null;
        const originalSrc = imgElement?.src;

        if (imgElement && originalSrc && !originalSrc.includes('_lavender.svg')) {
          element.addEventListener('mouseover', function() {
            imgElement.src = originalSrc.replace('.svg', '_lavender.svg');
          });

          element.addEventListener('mouseleave', function() {
            imgElement.src = originalSrc;
          });
        }
      });

      /**
       * Manages the behaviour of the mega-menu when hamburger menu icon is clicked.
       */
      once('hamburgerMenu_handler', '.hamburger-menu', context).forEach(function (element) {
        element.addEventListener('click', function() {
          let hamburgerMenu = document.getElementsByClassName('hamburger-menu')[0];


          let logo = document.getElementById('planet-logo--mobile-and-tablet');
          let header =document.getElementsByClassName("megamenu-header")[0];
          let closingIcon = document.getElementsByClassName('close-hamburger-menu')[0];

          hamburgerMenu.classList.add('display-none');
          header.classList.add("expanded");
          closingIcon.src ='/resources/icons/closing-x.svg';
          logo.src = '/resources/logo/planet_logo_black.svg';

          if (!isHeaderForDesktopDisplayed()) {
            let megamenuMobileAndTablets = document.getElementsByClassName('megamenu-mobile-and-tablets')[0];
            let logo = document.getElementById('planet-logo--mobile-and-tablet');
            let mergedMenuItems = document.getElementsByClassName('merged-menu-items')[0];
            let closeHamburgerMenu = document.getElementsByClassName('close-hamburger-menu')[0];
            closeHamburgerMenu.classList.remove('display-none');
            hamburgerMenu.style.setProperty('display', 'none', 'important');
            logo.src = '/resources/logo/planet_logo_black.svg';
            mergedMenuItems.classList.remove('display-none');
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
            showBlackHamburgerMenu();
            switchHamburgerMenuLogoBlack();
            removeNoScrollFromBody();

            if (!isMobileAndTabletsExpanded) {
              removeExpandedFromHeader();
            }

            currentlyOpenMenuItem = null;
            let scrollPosition = window.scrollY;
            let potentiallyTransparent = document.querySelectorAll('body, div');

            let hasTransparentBg = isFrontpage() || Array.from(potentiallyTransparent).some(el =>
              el.classList.contains("planet-header-transparent") ||
              el.classList.contains("coh-hero-full-width")
            );

            let hasDarkMenuTheme = document.querySelectorAll(".dark-menu-items").length > 0;
            let closingXIcon = document.getElementsByClassName('close-hamburger-menu');

            if (scrollPosition === 0) {
              if (hasTransparentBg) {
                let planetLogoMobileAndTablet = document.getElementById('planet-logo--mobile-and-tablet');

                if (hasDarkMenuTheme) {
                  planetLogoMobileAndTablet.src =  '/resources/logo/planet_logo_black.svg';
                  closingXIcon.src = '/resources/icons/closing-x.svg';
                  hamburgerMenu.setAttribute("style", "display: block !important;");                }
                else {
                  addTransparentBgClassToHeader();
                  planetLogoMobileAndTablet.src = '/resources/logo/planet_logo.svg';
                  switchHamburgerMenuLogoWhite();
                }
              }
            }
            else {
            }
          }
        });
      })


      ;

      /**
       * Manages the behaviour of the mega-menu when the item's right arrow is clicked.
       *
       * It concerns only mobile-and-tablet version.
       */
      once('megamenuMobileAndTablets_handler', '.arrow-right-anchor', context).forEach(function (element) {
        element.addEventListener('click', function () {
          const id = element.id;
          let container;

          switch (id) {
            case 'anchor-products':
              container = document.querySelector('.megamenu-mobile-and-tablets__container--products');
              break;
            case 'anchor-solutions':
              container = document.querySelector('.megamenu-mobile-and-tablets__container--solutions');
              break;
            case 'anchor-resources':
              container = document.querySelector('.megamenu-mobile-and-tablets__container--resources');
              break;
            case 'anchor-company':
              container = document.querySelector('.megamenu-mobile-and-tablets__container--company');
              break;
          }

          if (container) {
            addDisplayNoneToAllContainers();

            if (container.classList.contains('display-none')) {
              container.classList.remove('display-none');
              currentlyOpenMenuItem = id.replace('anchor-', '');
              hideMergedMenuItems();
              addNoScrollToBody();
              hideLogo();
              showGoBack();
            }
          }
        });
      });

      /**
       * Handles click-away functionality.
       */
      document.addEventListener('click', function (e) {
        const headerElement = document.querySelector('header');
        const megamenuDesktopElement = document.querySelector('.megamenu-complex-container');
        const megamenuMobileElement = document.querySelector('.megamenu-mobile-and-tablets');

        if (
          !(headerElement && headerElement.contains(e.target)) &&
          !(megamenuDesktopElement && megamenuDesktopElement.contains(e.target)) &&
          !(megamenuMobileElement && megamenuMobileElement.contains(e.target))
        ) {
          setTimeout(() => {
            switch (currentlyOpenMenuItem) {
              case 'products':
                const containerProducts = document.querySelector('.megamenu-products__desktop');
                if (containerProducts) containerProducts.classList.add('display-none');
                break;
              case 'solutions':
                const containerSolutions = document.querySelector('.megamenu-solutions__desktop');
                if (containerSolutions) containerSolutions.classList.add('display-none');
                break;
              case 'resources':
                const containerResources = document.querySelector('.megamenu-resources__desktop');
                if (containerResources) containerResources.classList.add('display-none');
                break;
              case 'company':
                const containerCompany = document.querySelector('.megamenu-company__desktop');
                if (containerCompany) containerCompany.classList.add('display-none');
                break;
              default:
                if (megamenuMobileElement) megamenuMobileElement.classList.add('display-none');
                hideCloseHamburgerMenu();
                showBlackHamburgerMenu();
                unflipAllDesktopMenuArrows();
                break;
            }
            removeExpandedFromHeader();
            manageHasTransparentBgClass();
            currentlyOpenMenuItem = null;
            unflipAllDesktopMenuArrows();
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
})(Drupal);
