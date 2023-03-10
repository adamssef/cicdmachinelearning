/**
 * @file
 * File gridContainer.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_gridContainer = {
    attach: function () {
      $(document).ready(function () {
        /**
         * T: tablet
         * SD: Small Desktop
         * LD: Large Desktop
         */
        /*
        CLASSES - Width Screen x Cards per row

        coh-grid-two-three:
          T: 2 - SD: 3 - LD: 3; (2 CARDS)

        coh-grid-three:
          T: 3 - SD: 3 - LD: 3; (3, 5, 6 CARDS)

        coh-grid-four:
          T: 2 - SD: 4 - LD: 4; (4, 7, 8 CARDS)
        */
        let container = document.querySelectorAll(".coh-grid-container");

        container.forEach((grid) => {
          let countCards = grid.childElementCount;

          if (countCards > 1 && countCards === 2) {
            grid.classList.add("coh-grid-two-three");
          } else if (countCards === 4 || countCards >= 7) {
            grid.classList.add("coh-grid-four");
          } else {
            grid.classList.add("coh-grid-three");
          }
        });
      });
    },
  };
})(jQuery, Drupal);
