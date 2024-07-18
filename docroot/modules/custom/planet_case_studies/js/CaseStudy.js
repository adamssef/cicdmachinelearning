(function ($, Drupal) {
  Drupal.behaviors.singleCaseStudyPage = {
    attach: function (context, settings) {
      $(document).ready(function () {
        // Check the initial width of the window
        let width = $(window).width();
        // Function to handle class toggling based on window width
        function toggleClasses() {
          if (width < 1024) {
            $('.case-study-page__h1--customer-info').removeClass('not-displayed');
            $('.case-study-page__h1--case-study-page').addClass('not-displayed');
          } else {
            $('.case-study-page__h1--customer-info').addClass('not-displayed');
            $('.case-study-page__h1--case-study-page').removeClass('not-displayed');
          }
        }

        // Call the function on document ready
        toggleClasses();

        // Call the function whenever the window is resized
        $(window).resize(function () {
          width = $(window).width();
          toggleClasses();
        });
      });
    }
  }

})(jQuery, Drupal);