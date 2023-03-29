/**
 * @file
 * File blogIndex.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_blogIndex = {
    attach: function () {
      $(document).ready(function () {
        let content = document.querySelector(".coh-layout-canvas-content");
        let headings = content.querySelectorAll(
          ".coh-style-h700, .coh-style-h600, .coh-style-h500"
        );
        let list = document.querySelector(".coh-index-list");

        $(headings).each(function () {
          $(list).append(
            `<li class="coh-list-item coh-index-item">
              <span></span>
              <p class="coh-paragraph coh-style--body-regular---tt-commons-planet">
                ${$(this).text()}
              </p>
            </li>`
          );
        });
      });
    },
  };
})(jQuery, Drupal);
