/**
 * Add GA data-analytics to Texts Button Cards.
 * @file
 * File supportPageToggle.js.
 */

(function ($, Drupal) {
    Drupal.behaviors.planet_sitestudio_supportPageToggle = {
      attach: function () {
        $(document).ready(function () {

            let selectedBox = 2; 
            let selectedElementId = $(".planSwitch-black input:checked").attr("id");
            let lastCharacter = selectedElementId[selectedElementId.length - 1];

            $(".related-product-1, .related-product-2").hide();
            $(".related-product-" + lastCharacter).show();

            //$(".planSwitch label[data-box='"+selectedBox+"']").click();
            // $(".related-product-2").hide();
            $(".planSwitch label").click(function () {
                // Get the data-box value of the clicked label
                let boxNumber = $(this).attr("data-box");
                // Hide all related containers
                $(".related-product-wrapper").hide();
      
                // Show the corresponding related container
                $(".related-product-" + boxNumber).show();

                selectedBox = boxNumber;
              });

            // $(".views-exposed-form .form-submit").click(function(e) {
            //     console.log(selectedBox);
            //     $(".planSwitch label[data-box='"+selectedBox+"']").click();
            // })

            // $(".planSwitch label").click(function () {
            // let boxNumber = $(this).attr("data-box");
            // $(".related-product-wrapper").hide();

            // // Show the corresponding related container
            // $(".related-product-" + boxNumber).show();

            // $("a[data='term-target-all']").click(function(e) {
            //     e.preventDefault();
            // });
        });
          console.log("supportpageeeeee");
      }
    };
  })(jQuery, Drupal);
  