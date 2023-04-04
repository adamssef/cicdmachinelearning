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
        console.log(headerHeight)

        // Get all headings on layout canvas
        let headings = content.querySelectorAll(
          ".coh-style-h700, .coh-style-h600, .coh-style-h500"
        );

        // Get index list
        let list = document.querySelector(".coh-index-list");
        $(headings).each(function (i) {

          let id = `coh-index-heading-${i}`;

          // Add each to index list
          $(list).append(
            `<li id="${id}" class="coh-list-item coh-index-item">
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
            if ((winScroll + headerHeight) > headingTop) {
              $(`#${id}`).addClass("coh-index-item-active");
            // If the opposite
            } else if ((winScroll + headerHeight) < headingTop) {
              $(`#${id}`).removeClass("coh-index-item-active");
            }
          });
        });
      });
    },
  };
})(jQuery, Drupal);
