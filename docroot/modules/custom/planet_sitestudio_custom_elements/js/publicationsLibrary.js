/**
 * @file
 * File publicationsLibrary.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.publicationsLibrary = {
    attach: function () {
      let cards = document.querySelectorAll(".publications__card");

      cards.forEach((card) => {
        let totalCardHeight = card.clientHeight;
        let cardTop = card.querySelector(".publications__card--top");
        let cardBottom = card.querySelector(".publications__card--bottom");
        let cardHeight = cardTop.clientHeight + cardBottom.clientHeight;
        let cardHeightDiff = totalCardHeight - cardHeight;

        if (cardHeightDiff > 1) {
          let cardLink = card.querySelector(".publications__card__link");
          let linkMarginTop = parseInt($(cardLink).css("marginTop"), 10);

          $(cardLink).css("marginTop", linkMarginTop + cardHeightDiff);
        }
      });
    },
  };
})(jQuery, Drupal);
