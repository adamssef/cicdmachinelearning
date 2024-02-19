/**
 * @file
 * Planet offices JS.
 */
(function (Drupal, once) {
  'use strict';

  function showCountries(regionID) {
    document.querySelectorAll(".region-id").forEach(el => el.style.display = 'none');
    document.querySelectorAll(".region-id-" + regionID).forEach(el => el.style.display = 'block');
  }

  function showCountryOffices(countryId) {
    document.querySelectorAll(".country-id").forEach(el => el.style.display = 'none');
    document.querySelectorAll(".country-id-" + countryId).forEach(el => el.style.display = 'block');
  }

  Drupal.behaviors.planetOffices = {
    attach: function (context, settings) {
      once('planetOffices', '.region', context).forEach(element => {
        element.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelectorAll(".region").forEach(el => el.classList.remove("active"));
          this.classList.add("active");
          let regionID = this.getAttribute("data-id");
          showCountries(regionID);
        });
      });
      once('planetOffices', '.country', context).forEach(element => {
        element.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelectorAll(".country").forEach(el => el.classList.remove("active"));
          this.classList.add("active");
          let countryId = this.getAttribute("data-id");
          showCountryOffices(countryId);
        });
      });

      // Trigger initial click on the first region element
      document.addEventListener('DOMContentLoaded', function () {
        let firstRegion = context.querySelector('.region:eq(3)');
        if (firstRegion) {
          firstRegion.click();
        }
      });
    }
  };
}(Drupal, once));
