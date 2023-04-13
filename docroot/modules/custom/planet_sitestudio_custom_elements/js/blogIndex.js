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
          let headingId = `coh-blog-index-heading-${i}`;
          let indexId = `coh-blog-heading-${i}`;
          $(this).attr("id", headingId);
          $(this).css("paddingTop", headerHeight);

          // Add each to index list
          $(list).append(
            `<li id="${indexId}" class="coh-list-item coh-blog-index-item ${indexId}">
              <a href="#${headingId}" class="coh-paragraph coh-style--body-regular---tt-commons-planet">
                ${$(this).text()}
              </a>
            </li>`
          );

          $(listTablet).append(
            `<li id="${indexId}" class="coh-list-item coh-blog-index-item ${indexId}">
              <a href="#${headingId}" class="coh-paragraph coh-style--body-regular---tt-commons-planet">
                ${$(this).text()}
              </a>
            </li>`
          );

          let headingTop = $(this).offset().top;
          // Check the scroll
          $(window).scroll(function () {
            let winScroll =
              document.body.scrollTop || document.documentElement.scrollTop;

            // If the height scrolled is bigger than the height where is the title
            if (winScroll + headerHeight > headingTop) {
              $(`.${indexId}`).addClass("coh-blog-index-item-active");
              $(indexHeading).text($(heading).text());
              // Remove active state from all indexes except the actual one.
              $(".coh-blog-index-item").not(`.${indexId}`).removeClass("coh-blog-index-item-active");
            }
          });
        });
      });
    },
  };
})(jQuery, Drupal);
