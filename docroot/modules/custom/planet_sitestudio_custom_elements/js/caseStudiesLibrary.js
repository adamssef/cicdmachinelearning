/**
 * @file
 * File caseStudiesLibrary.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_caseStudiesLibrary = {
    attach: function () {
      $(document).ready(function () {
        let cards = document.querySelectorAll(".case-studies__card");

        cards.forEach((card) => {
          let totalCardHeight = card.clientHeight;
          let cardTop = card.querySelector(".case-studies__card--top");
          let cardBottom = card.querySelector(".case-studies__card--bottom");
          let cardHeight = cardTop.clientHeight + cardBottom.clientHeight;
          let cardHeightDiff = totalCardHeight - cardHeight;

          if (cardHeightDiff > 1) {
            let cardLink = card.querySelector(".case-studies__card__link");
            let linkMarginTop = parseInt($(cardLink).css("marginTop"), 10);

            $(cardLink).css("marginTop", linkMarginTop + cardHeightDiff);
          }
        });
      });
    },
  };
})(jQuery, Drupal);
