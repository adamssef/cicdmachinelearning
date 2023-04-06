/**
 * @file
 * File blogIndex.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_blogIndex = {
    attach: function () {
      $(document).ready(function () {
        let content = document.querySelector(".coh-layout-canvas-content");
        let headerHeight = $(".header-container").height();
        // Get all headings on layout canvas
        let headings = content.querySelectorAll(
          ".coh-style-h700, .coh-style-h600, .coh-style-h500"
        );
        let indexHeading = document.querySelector(
          ".coh-blog-index-header .coh-heading"
        );
        // Get index list
        let list = document.querySelector(".coh-blog-index-list");
        let listTablet = document.querySelector(".coh-blog-index-list-tablet");

        let indexButton = document.querySelector(".coh-blog-index-button");

        $(indexButton).click(() => {
          $(indexButton).toggleClass("coh-blog-index-button-active");
          $(listTablet).toggleClass("coh-blog-index-list-tablet-active");
        });

        $(headings).each(function (i, heading) {
          let id = `coh-blog-index-heading-${i}`;

          // Add each to index list
          $(list).append(
            `<li id="${id}" class="coh-list-item coh-blog-index-item ${id}">
              <p class="coh-paragraph coh-style--body-regular---tt-commons-planet">
                ${$(this).text()}
              </p>
            </li>`
          );

          $(listTablet).append(
            `<li id="${id}" class="coh-list-item coh-blog-index-item ${id}">
              <p class="coh-paragraph coh-style--body-regular---tt-commons-planet">
                ${$(this).text()}
              </p>
            </li>`
          );

          let headingTop = $(this).offset().top;
          // Check the scroll
          $(window).scroll(function () {
            let winScroll =
              document.body.scrollTop || document.documentElement.scrollTop;

            // If the height scrolled is bigger than the height where is the title
            if (winScroll + headerHeight > headingTop) {
              $(`.${id}`).addClass("coh-blog-index-item-active");
              $(indexHeading).text($(heading).text());
              // If the opposite
            } else if (winScroll + headerHeight < headingTop) {
              $(`.${id}`).removeClass("coh-blog-index-item-active");
            }
          });
        });
      });
    },
  };
})(jQuery, Drupal);
