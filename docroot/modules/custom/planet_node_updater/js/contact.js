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
      document.querySelectorAll('.region').forEach(element => {
        console.log(element);
        element.addEventListener('click', function (e) {
          console.log('Click event triggered:', element);
          console.log('Scroll position before:', window.pageYOffset || document.documentElement.scrollTop);
          e.preventDefault();
          document.querySelectorAll(".region").forEach(el => el.classList.remove("active"));
          this.classList.add("active");
          let regionID = this.getAttribute("data-id");
          showCountries(regionID);
        });
      });

      document.querySelectorAll('.country').forEach(element => {
        element.addEventListener('click', function (e) {
          console.log('Click event triggered:', element);
          console.log('Scroll position before:', window.pageYOffset || document.documentElement.scrollTop);
          e.preventDefault();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

          document.querySelectorAll('.country').forEach(el => el.classList.remove('active'));
          this.classList.add('active');
          let countryId = this.getAttribute('data-id');
          showCountryOffices(countryId);
          console.log('Scroll position after showing offices:', window.pageYOffset || document.documentElement.scrollTop);

          // Restore the scroll position to prevent unwanted changes
          window.scrollTo(0, scrollTop);
        });
      });

      // Trigger initial click on the first region element
      document.addEventListener('DOMContentLoaded', function () {
        let firstRegion = context.querySelectorAll('.region')[3];
        if (firstRegion) {
          console.log('Triggering initial click on first region element');
          firstRegion.click();
        }
      });

      let accordionElement = document.querySelector('.coh-style-accordion-with-two-titles-planet-panel');
      if (accordionElement) {
        accordionElement.addEventListener('click', function (e) {
          let containerToBeToggled = document.querySelector('.coh-ce-cpt_tab_accordion_with_two_title-ab7050cd');
          if (containerToBeToggled.style.display === 'none') {
            containerToBeToggled.style.display = 'block';
            console.log('Accordion toggled to block');
          } else {
            containerToBeToggled.style.display = 'none';
          }
        });
      }
    }
  };
}(Drupal, once));
