/**
 * @file
 * File tabsNavScrollDesktop.js.
 */

(function ($, Drupal) {
    Drupal.behaviors.planet_sitestudio_tabsNavScrollDesktop = {
        attach: function () {

            const tabPanel = document.querySelector('#products-tab-panel');
            const slider = tabPanel.querySelector('.coh-accordion-tabs-nav');
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
              isDown = true;
              startX = e.pageX - slider.offsetLeft;
              scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener('mouseleave', () => {
              isDown = false;
            });
            slider.addEventListener('mouseup', () => {
              isDown = false;
            });
            slider.addEventListener('mousemove', (e) => {
              if(!isDown) return;
              e.preventDefault();
              const x = e.pageX - slider.offsetLeft;
              const walk = (x - startX);
              slider.scrollLeft = scrollLeft - walk;
            });

        }
    };
})(jQuery, Drupal);

