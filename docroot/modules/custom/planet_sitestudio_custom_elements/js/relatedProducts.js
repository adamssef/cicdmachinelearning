/**
 * @file
 * File relatedProducts.js.
 */

(function ($, Drupal) {
    Drupal.behaviors.planet_sitestudio_relatedProducts = {
      attach: function () {
        $(document).ready(function () {

          // display labels in switcher
          let labels = $(".planSwitch label");
          let spanTexts = $(".coh-inline-element.related-product-select span.coh-inline-element").map(function () {
            return $(this).text();
          }).get();
          
          // Update the text content of the labels
          labels.each(function (index) {
            $(this).text(spanTexts[index]);
          });

          $(".related-product-wrapper").hide();
          $(".related-product-1").show();
          $(".planSwitch label[data-box='1']").click();

        // Handle click events on labels within .planSwitch
        $(".planSwitch label").click(function () {
          // Get the data-box value of the clicked label
          let boxNumber = $(this).attr("data-box");
          // Hide all related containers
          $(".related-product-wrapper").hide();

          // Show the corresponding related container
          $(".related-product-" + boxNumber).show();
        });
        });
      },
    };
  })(jQuery, Drupal);