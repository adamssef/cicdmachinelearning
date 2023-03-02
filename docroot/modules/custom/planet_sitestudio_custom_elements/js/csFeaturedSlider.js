/**
 * @file
 * File csFeaturedSlider.js.
 */

(function ($, Drupal) {
  Drupal.planet = Drupal.planet || {};

  Drupal.behaviors.planet_sitestudio_csFeaturedSlider = {
    attach: function () {
      let caseStudiesBlock = $('.coh-style-case-studies-featured-slider-4-items');

      caseStudiesBlock.once('case-studies-4-action').each(function () {
        // add on click event on logo
        Drupal.planet.transformInLink($(this));

        // Add the active class to the first logo
        $(this).find('.cs-featured-slider-logos div:first-child').addClass('active');

        // Update the logos with a unique class
        $(this).find('.slide-logo').addClass(function(i) {
          return 'slide-'+(i);
        });

        // Update active on slide button click
        $(this).find('.coh-slider-nav-inner-top button').click(function() {
          const parent = $(this).parents('.coh-style-case-studies-featured-slider-4-items');
          const slideIndex = parent.find('.slick-active').attr('data-slick-index');
          const slideLogoItem = `slide-${slideIndex}`;

          parent.find('.slide-logo').each(function(){
            if($(this).hasClass(slideLogoItem)) {
              parent.find('.slide-logo').removeClass('active');
              $(this).addClass('active');
            }
          });
        });
      });
    }
  };

  // Update active on logo click
  Drupal.planet.transformInLink = (slideDiv) => {
    slideDiv.find('.slide-logo').on('click', function() {
      const parent = $(this).parents('.coh-style-case-studies');
      const slidePosition = $(this).attr('class').split('-').pop().replace(' active', '');

      parent.find('.slide-logo').removeClass('active');
      $(this).addClass('active');

      parent.find(`.slick-dots li:eq(${slidePosition}) button`).click();
    });
  }
})(jQuery, Drupal);
