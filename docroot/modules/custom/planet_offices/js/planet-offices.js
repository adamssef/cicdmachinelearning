
/**
 * @file
 * Planet offices JS.
 */

(function ($) {
  'use strict';

  function showCountries(regionID) {
    $(".region-id").hide();
    $(".region-id-" + regionID + "").show();
  }

  function showCountryOffices(countryId) {
    $(".country-id").hide();
    $(".country-id-" + countryId + "").show();
  }

  Drupal.behaviors.planetOffices = {
    attach: function (context, settings) {
      $('.region', context).once('planetOffices').click(function (e) {
        e.preventDefault();
        $(".region").removeClass("active");
        $(this).addClass("active");
        let regionID = $(this).attr("data-id");
        showCountries(regionID);
      });
      $('.country', context).once('planetOffices').click(function (e) {
        e.preventDefault();
        $(".country").removeClass("active");
        $(this).addClass("active");
        let countryId = $(this).attr("data-id");
        showCountryOffices(countryId);
      });
      

       // Trigger initial click on the first region element
       $(document).ready(function () {
        $('.region:eq(3)', context).click();
      });

    }
  };
})(jQuery);