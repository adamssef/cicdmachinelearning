/**
 * @file
 * File relatedContentCard.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_relatedContentCard = {
    attach: function () {
      $(document).ready(function () {
        let component = document.querySelector(".coh-related-content-cards");
        let cards = component.querySelectorAll(".coh-content-card");

        cards.forEach((card) => {
          let text = card.querySelector(".coh-text-wrapper p");
          let cardHeight = card.clientHeight;
          let textLineHeight = 24; // text line height defined by design 
          let titleHeight = card.querySelector(".coh-title-wrapper").clientHeight;
          let linkHeight = card.querySelector(".coh-link-wrapper").clientHeight;

          // Limit the number of visible lines basead on the number
          // of lines on the title
          let maxNumberOfLines = Math.round((cardHeight - titleHeight - linkHeight) / textLineHeight);
          text.style.webkitLineClamp = maxNumberOfLines; 
        })
      });
    },
  };
})(jQuery, Drupal);