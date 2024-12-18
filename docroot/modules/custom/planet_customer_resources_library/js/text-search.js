(function ($, Drupal) {
  'use strict';

  function getActiveCategoryId() {
    var category;

    document.querySelectorAll('.planet-cat-filter li a').forEach(function (element) {
      if (element.classList.contains('active')) {
        category = element;
      }
    });

    let categoryId = category.classList[0];
    category = 'all';

    if (categoryId === 'resource-target-1846') {
      category = 'training';
    }
    if (categoryId === 'resource-target-1851') {
      category = 'terminaldocs';
    }
    if (categoryId === 'resource-target-1856') {
      category = 'portaldocs';
    }
    if (categoryId === 'resource-target-1861') {
      category = 'links';
    }
    if (categoryId === 'resource-target-1881') {
      category = 'productdocs';
    }
    if (categoryId === 'resource-target-2221') {
      category = 'taxfree';
    }

    return category;
  }

  Drupal.behaviors.search_init = {
    attach: function (context, settings) {
      once('textSearchInit', '.search-bar__input', context).forEach(function (element) {
        element.addEventListener('keypress', async function (e) {
          if (e.key === 'Enter') {
            let text = element.value;

            if (text === '') {
              text = 'all';
            }

            let category = getActiveCategoryId();

            try {
              const contentContainer = document.querySelector('.content-container');

              let endpoint;

              if (text === 'all') {
                endpoint = `/api/views/planet_resources/${category}`;
              } else {
                endpoint = `/api/views/planet_resources/${category}/${text}`;
              }

              const response = await fetch(endpoint);

              if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
              }

              const json = await response.json();
              const count = json.length;

              if (count === 0) {
                document.querySelector('.search-results__container').classList.remove('hidden');
                document.querySelector('.search-results__span').classList.remove('hidden');
                document.querySelector('.search-results__span').innerText = Drupal.t('Search results for:') + ' ' + text;
                document.querySelector('.search-results-sorry__span').classList.remove('hidden');
              }

              if (count > 0 && text !== 'all') {
                document.querySelector('.search-results__container').classList.remove('hidden');
                document.querySelector('.search-results__span').classList.remove('hidden');
                document.querySelector('.search-results__span').innerText = Drupal.t('Search results for:') + ' ' + text;
                document.querySelector('.search-results-sorry__span').classList.add('hidden');
              }

              contentContainer.innerHTML = '';

              // Loop through keys of the response object
              for (const [key, item] of Object.entries(json)) {
                const html = `
                  <div class="flex flex-col md:flex-wrap p-6 border border-solid rounded-[8px] border-[rgba(209,209,209,1)]">
                    <img src="${item.icon}" alt="Resource icon" class="mb-[25px] h-[50px] w-fit"/>
                    <span class="border-l-[4px] border-l-[rgba(224,0,131,1)] border-solid block font-bold text-lg mb-2 text-[14px] pl-[18px] pb-[3px] h-[20px] leading-[14px]">${item.sub_heading}</span>
                    <span class="block font-semibold text-xl mb-2 text-2xl">${item.title}</span>
                    <span class="block text-gray-600 mb-5 font-light leading-[22px]">${item.description}</span>
                    <a target="_blank" href="${item.link}" class="w-fit inline-block bg-[rgba(32,32,32,1)] text-white inline-block no-underline text-[16px] font-bold px-[20px] py-[12px] rounded-[46px]">View ${item.resource_type}</a>
                  </div>
                `;
                contentContainer.insertAdjacentHTML('beforeend', html);
              }
            } catch (error) {
              console.error(error.message);
            }
          }
        });
      });
    },
  };
})(jQuery, Drupal);