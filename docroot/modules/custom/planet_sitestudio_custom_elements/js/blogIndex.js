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

        /**
         * TABLET INDEX - OPEN/CLOSE CONTAINER
         */
        $(indexButton)
          .once("blog-index-tablet-action")
          .click((event) => {
            event.preventDefault()
            $(indexButton).toggleClass("coh-blog-index-button-active");
            $(listTablet).toggleClass("coh-blog-index-list-tablet-active");
          });

        /**
         * TABLET INDEX - SHOW/HIDE CONTAINER
         */
        let contentTop = $(content).offset().top;
        let contentBottom = $(content).height() + contentTop;

        $(window).scroll(function () {
          let winScroll =
            document.body.scrollTop || document.documentElement.scrollTop;

          let winScrollPlusHeader = winScroll + headerHeight;

          // If the height scrolled is bigger than the height where is the title
          if (winScrollPlusHeader > contentTop && winScrollPlusHeader < contentBottom) {
            $(".coh-blog-index-tablet-container").addClass(
              "coh-blog-index-tablet-container-active"
            );
          } else {
            $(".coh-blog-index-tablet-container").removeClass(
              "coh-blog-index-tablet-container-active"
            );
          }
        });

        /**
         * ACTIVE/DESACTIVE INDEX INDICATORS
         * ADD INDICATORS TO EACH HEADING
         */
        $(headings)
          .once("blog-index-action")
          .each(function (i, heading) {
            let headingId = `coh-blog-index-heading-${i}`;
            let indexId = `coh-blog-heading-${i}`;
            $(this).attr("id", headingId);
            $(this).css("paddingTop", headerHeight);
            $(this).css("display", "block");

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

              if (winScroll + headerHeight > headingTop) {
                $(`.${indexId}`).addClass("coh-blog-index-item-active");
                $(indexHeading).text($(heading).text());
                // Remove active state from all indexes except the actual one.
                $(".coh-blog-index-item")
                  .not(`.${indexId}`)
                  .removeClass("coh-blog-index-item-active");
              }
            });
          });
      });
    },
  };
})(jQuery, Drupal);
