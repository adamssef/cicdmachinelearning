(function ($, Drupal, once) {
  'use strict';

  function toggleRegions(region) {
    document.querySelectorAll('.region').forEach((el => {
      el.classList.remove('selected');
    }));

    region.classList.toggle('selected');
  }

  function toggleCompanies(company) {
    document.querySelectorAll('.company').forEach((el => {
      el.classList.remove('selected');
    }));

    company.classList.toggle('selected');
  }

  function buildCountries(regionData) {
    const countryContainer = document.querySelector('.grid');

    for (const key in regionData) {
      if (regionData.hasOwnProperty(key)) {
        const country = regionData[key];

        // Create the country element while keeping the existing styles
        const countryElement = document.createElement('div');
        countryElement.classList.add('flex', 'flex-col');

        const countryNameElement = document.createElement('span');
        countryNameElement.classList.add('font-semibold', 'leading-[20px]', 'text-[19px]');
        countryNameElement.textContent = country.name;

        const countryPhoneElement = document.createElement('span');
        countryPhoneElement.classList.add('font-light');
        countryPhoneElement.textContent = country.phone;

        // Append name and phone number to the country element
        countryElement.appendChild(countryNameElement);
        countryElement.appendChild(countryPhoneElement);

        // Append country element to the container
        countryContainer.appendChild(countryElement);
      }
    }
  }

  function clearCountries() {
    const countryContainer = document.querySelector('.grid');
    if (countryContainer) {
      countryContainer.innerHTML = ''; // Remove existing countries
    }
  }

  function handleSwitcherClick(switcher) {
    switcher.addEventListener('click', async () => {
      let switchers = document.querySelectorAll('.switcher-section');

      let text = switcher.innerText;
      let classToCompareTo;

      if (text === "E-mail contacts") {
        classToCompareTo = 'switcher-section--emails';
      }
      else {
        classToCompareTo = 'switcher-section--phones';
      }

      switchers.forEach((element) => {
        if (element.classList.contains(classToCompareTo)) {
          element.classList.remove('hidden');
        }
        else {
          element.classList.add('hidden');
        }
      });
    });
  }

  Drupal.behaviors.toggleRegions = {
    attach: function (context, settings) {
      once('regionIsSelected', '.region', context).forEach(
       (region) => {
          region.addEventListener('click', async () => {
            toggleRegions(region);

            let regionText = region.innerText;

            let longToShortRegionNameMap = {
              'All': null,
              'Africa': 'africa',
              'Americas': 'americas',
              'Asia': 'asia',
              'Central Europe' : 'c_eurupe',
              'Eastern Europe' : 'e_eurupe',
              'Nordic Europe' : 'n_eurupe',
            };

            regionText = longToShortRegionNameMap[regionText];

            try {
              // Fetch data for the selected region

              var response;

             if (regionText !== null) {
                response = await fetch(`/planet/support/${encodeURIComponent(regionText)}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
              }
              else {
                response = await fetch(`/planet/support/${null}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
              }

              if (!response.ok) {
                throw new Error(`Error fetching region data: ${response.statusText}`);
              }

              let regionData = await response.json();

              // Remove existing countries when region is changed
              clearCountries();
              // Rebuild the countries based on the response
              buildCountries(regionData);
              console.log(regionData);
            } catch (error) {
              console.error('Failed to fetch region data:', error);
            }

          });
        }
      );
    }
  };

  Drupal.behaviors.pagetopFilter = {
    attach: function (context, settings) {
      once('switcherIsSwitched', '.plnt-switch button', context).forEach(
        (switcher) => {
          handleSwitcherClick(switcher);
        }
      );
    }
  };

  Drupal.behaviors.toggleCompanies = {
    attach: function (context, settings) {
      once('companyIsSelected', '.company', context).forEach(
        (company) => {
          company.addEventListener('click', async () => {
            toggleCompanies(company);

            let companyText = company.innerText;

            const longToShortCompanyNameMap = {
              "Datatrans": "datatrans",
              "Hoist Group": "hoist",
              "Hoist PMS Products": "hoist_pms",
              "Payments and Tax Free (Technical)": "payments_and_taxfree",
              "Planet Unified Commerce": "unified_commers",
              "Protel": "protes",
              "Tax Free (General)": "tax_free"
            };

            companyText = longToShortCompanyNameMap[companyText];
            console.log(companyText);

            try {
              var response;

              if (companyText !== null) {
                response = await fetch(`/planet/support/email/${encodeURIComponent(companyText)}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
              }
              else {
                response = await fetch(`/planet/support/email/${null}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
              }

              if (!response.ok) {
                throw new Error(`Error fetching company data: ${response.statusText}`);
              }

              let companyData = await response.json();

              // // Remove existing countries when company is changed
              // clearCountries();
              // // Rebuild the countries based on the response
              // buildCountries(companyData);
              console.log(companyData);
            } catch (error) {
              console.error('Failed to fetch company data:', error);
            }

          });
        }
      );
    }
  };

})(jQuery, Drupal, once);
