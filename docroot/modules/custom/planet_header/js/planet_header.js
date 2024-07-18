(function ($, Drupal) {
  let currentlyOpenMenuItem = null;


  Drupal.behaviors.megaMenu = {
    attach: function (context, settings) {
     once('select_menu_items', '.business-li', context).forEach(function (element) {
      let element_id = $(element)[0].id;

      $(element).click(e=> {
        switch(element_id) {
          case 'products':
            let megamenu_products = document.getElementsByClassName('megamenu-products__desktop');
            process(megamenu_products, element, 'products', 'megamenu-products__desktop');
            currentlyOpenMenuItem = 'products';
            break;
          case 'solutions':
            let megamenu_solutions = document.getElementsByClassName('megamenu-solutions__desktop');
            process(megamenu_solutions, element, 'solutions', 'megamenu-solutions__desktop');
            currentlyOpenMenuItem = 'solutions';
            break;
          case 'resources':
            let megamenu_resources = document.getElementsByClassName('megamenu-resources__desktop');
            process(megamenu_resources, element, 'resources', 'megamenu-resources__desktop');
            currentlyOpenMenuItem = 'resources';
            break;
          case 'company':
            let megamenu_company = document.getElementsByClassName('megamenu-company__desktop');
            process(megamenu_company, element, 'company', 'megamenu-company__desktop');
            currentlyOpenMenuItem = 'company';
            break;
        }
      })
     });

      function htmlCollectionsAreEqual(collection1, collection2) {
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

      once('hover_effect', '.megamenu-column__item', context).forEach(function(element) {
        // Mouse over
        var imgElement = $(element).children().children()[0];
        var originalSrc = imgElement.src;

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


      once('hamburger_menu_handler', '.hamburger-menu', context).forEach(function (element) {
        element.addEventListener('click', function() {
          if (!isHeaderForDesktopDisplayed()) {
            hideHamburgerMenu();
            showCloseHamburgerMenu()
            let megamenu_mobile_and_tablets = document.getElementsByClassName('megamenu-mobile-and-tablets')[0];
            megamenu_mobile_and_tablets.classList.remove('display-none');
          }
        });
      });

      once('close_hamburger_menu_handler', '.close-hamburger-menu', context).forEach(function (element) {
        element.addEventListener('click', function() {
          if (!isHeaderForDesktopDisplayed()) {
            let hamburger_menu = document.getElementsByClassName('hamburger-menu')[0];
            hamburger_menu.classList.remove('display-none');
            hamburger_menu.classList.add('rotate-left')
            element.classList.add('display-none');
            let megamenu_mobile_and_tablets = document.getElementsByClassName('megamenu-mobile-and-tablets')[0];
            megamenu_mobile_and_tablets.classList.add('display-none');
            hideGoBack();
            showLogo();
            addDisplayNoneToAllContainers();
            showMergedMenuItems();
            currentlyOpenMenuItem = null;
          }
        });
      });

      once('megamenu_mobile_and_tablets_handler', '.arrow-right-anchor', context).forEach(function (element) {
        element.addEventListener('click', function() {
          let id = element.id;

          switch (id) {
            case 'anchor-products':
              let container_products = document.getElementsByClassName('megamenu-mobile-and-tablets__container--products')[0];
              addDisplayNoneToAllContainers();

              if (container_products.classList.contains('display-none')) {
                container_products.classList.remove('display-none');
                currentlyOpenMenuItem = 'products';
                hideMergedMenuItems();
                addNoScrollToBody();
                hideLogo();
                showGoBack();
              }
              break;
            case 'anchor-solutions':
              let container_solutions = document.getElementsByClassName('megamenu-mobile-and-tablets__container--solutions')[0];
              addDisplayNoneToAllContainers()

              if (container_solutions.classList.contains('display-none')) {
                container_solutions.classList.remove('display-none');
                currentlyOpenMenuItem = 'solutions';
                hideMergedMenuItems();
                addNoScrollToBody();
                hideLogo();
                showGoBack();
              }
              break;
            case 'anchor-resources':
              let container_resources = document.getElementsByClassName('megamenu-mobile-and-tablets__container--resources')[0];
              addDisplayNoneToAllContainers();

              if (container_resources.classList.contains('display-none')) {
                container_resources.classList.remove('display-none');
                currentlyOpenMenuItem = 'resources';
                hideMergedMenuItems();
                addNoScrollToBody();
                hideLogo();
                showGoBack();
              }
              break;
            case 'anchor-company':
              let container_company = document.getElementsByClassName('megamenu-mobile-and-tablets__container--company')[0];
              addDisplayNoneToAllContainers();

              if (container_company.classList.contains('display-none')) {
                container_company.classList.remove('display-none');
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

      // Click-away functionality.
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
                let container_products = document.getElementsByClassName('megamenu-products__desktop')[0];
                container_products.classList.add('display-none');
                currentlyOpenMenuItem = null;
                unflipAllDesktopMenuArrows();
                break;
              case 'solutions':
                let container_solutions = document.getElementsByClassName('megamenu-solutions__desktop')[0];
                container_solutions.classList.add('display-none');
                currentlyOpenMenuItem = null;
                unflipAllDesktopMenuArrows();
                break;
              case 'resources':
                let container_resources = document.getElementsByClassName('megamenu-resources__desktop')[0];
                container_resources.classList.add('display-none');
                currentlyOpenMenuItem = null;
                unflipAllDesktopMenuArrows();
                break;
              case 'company':
                let container_company = document.getElementsByClassName('megamenu-company__desktop')[0];
                container_company.classList.add('display-none');
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

      once('go-back-handler', '.go-back-span', context).forEach(function (element) {
        element.addEventListener('click', function() {
          switch (currentlyOpenMenuItem) {
            case 'products':
              let container_products = document.getElementsByClassName('megamenu-mobile-and-tablets__container--products')[0];
              container_products.classList.add('display-none');
              showMergedMenuItems();
              removeNoScrollFromBody();
              showLogo();
              hideGoBack();
              break;
            case 'solutions':
              let container_solutions = document.getElementsByClassName('megamenu-mobile-and-tablets__container--solutions')[0];
              container_solutions.classList.add('display-none');
              showMergedMenuItems();
              removeNoScrollFromBody();
              showLogo();
              hideGoBack();
              break;
            case 'resources':
              let container_resources = document.getElementsByClassName('megamenu-mobile-and-tablets__container--resources')[0];
              container_resources.classList.add('display-none');
              showMergedMenuItems();
              removeNoScrollFromBody();
              showLogo();
              hideGoBack();
              break;
            case 'company':
              let container_company = document.getElementsByClassName('megamenu-mobile-and-tablets__container--company')[0];
              container_company.classList.add('display-none');
              showMergedMenuItems();
              removeNoScrollFromBody();
              showLogo();
              hideGoBack();
              break;
          }
        });
      });

      function hideCloseHamburgerMenu() {
        let close_hamburger_menu = document.getElementsByClassName('close-hamburger-menu')[0];
        close_hamburger_menu.classList.add('display-none');
      }

      function showCloseHamburgerMenu() {
        let close_hamburger_menu = document.getElementsByClassName('close-hamburger-menu')[0];
        close_hamburger_menu.classList.remove('display-none');
      }

      function showHamburgerMenu() {
        let hamburger_menu = document.getElementsByClassName('hamburger-menu')[0];
        hamburger_menu.classList.remove('display-none');
      }

      function hideHamburgerMenu() {
        let hamburger_menu = document.getElementsByClassName('hamburger-menu')[0];
        hamburger_menu.classList.add('display-none');
      }

      function unflipAllDesktopMenuArrows() {
        let businessLinks = document.getElementsByClassName('business-link');
        for (let i = 0; i < businessLinks.length; i++) {
          let img = businessLinks[i].children[0];
          img.classList.remove('flip');
        }
      }

      function addDisplayNoneToAllContainers() {
        let all_containers = [
          document.getElementsByClassName('megamenu-mobile-and-tablets__container--products')[0],
          document.getElementsByClassName('megamenu-mobile-and-tablets__container--solutions')[0],
          document.getElementsByClassName('megamenu-mobile-and-tablets__container--resources')[0],
          document.getElementsByClassName('megamenu-mobile-and-tablets__container--company')[0]
        ];

        all_containers.forEach(function (container) {
          if (!container.classList.contains('display-none')) {
            container.classList.add('display-none');
          }
        });
      }

      function isHeaderForDesktopDisplayed() {
        let inside_header_container = document.getElementsByClassName('inside-header-container')[0];
        let inside_header_container_style = window.getComputedStyle(inside_header_container);
        return inside_header_container_style.display !== 'none';
      }

      function hideMergedMenuItems() {
        let merged_menu_items = document.getElementsByClassName('merged-menu-items');
        for (let i = 0; i < merged_menu_items.length; i++) {
          merged_menu_items[i].classList.add('display-none');
        }
      }

      function addNoScrollToBody() {
        document.body.classList.add('no-scroll');
      }

      function removeNoScrollFromBody() {
        document.body.classList.remove('no-scroll');
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
        let go_back = document.getElementsByClassName('go-back-span');

        for (let i = 0; i < go_back.length; i++) {
          go_back[i].classList.remove('display-none');
        }
      }

      function hideGoBack() {
        let go_back = document.getElementsByClassName('go-back-span');

        for (let i = 0; i < go_back.length; i++) {
          go_back[i].classList.add('display-none');
        }
      }

      function showMergedMenuItems() {
        let merged_menu_items = document.getElementsByClassName('merged-menu-items');
        for (let i = 0; i < merged_menu_items.length; i++) {
          merged_menu_items[i].classList.remove('display-none');
        }
      }

      function process(megamenu_element, element, menuName, className) {
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

        menus.forEach(function (menu) {
          if (htmlCollectionsAreEqual(menu, megamenu_element)) {
            if (menu[0] !== undefined) {
              if(menu[0].classList.contains('display-none')) {
                menu[0].classList.remove('display-none');
                document.getElementById(map.get(className)).classList.add('flip')
              }
              else {
                menu[0].classList.add('display-none');
                document.getElementById(map.get(className)).classList.remove('flip')
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
        if (!megamenu_element[0].classList.contains('display-none')) {
          img.addClass('flip');
        } else {
          img.removeClass('flip');
        }
      }
    }
  };
})(jQuery, Drupal);
