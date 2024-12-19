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

    const categoryMap = {
      'resource-target-1846': 'training',
      'resource-target-1851': 'terminaldocs',
      'resource-target-1856': 'portaldocs',
      'resource-target-1861': 'links',
      'resource-target-1881': 'productdocs',
      'resource-target-2221': 'taxfree'
    };

    return categoryMap[categoryId] || category;
  }

  async function handleSearch(element) {
    let text = element.value || 'all';
    let category = getActiveCategoryId();

    try {
      const contentContainer = document.querySelector('.content-container');
      const endpoint = text === 'all'
        ? `/api/views/planet_resources/${category}`
        : `/api/views/planet_resources/${category}/${text}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      const count = json.length;

      const searchResults = document.querySelector('.search-results__container');
      const searchSpan = document.querySelector('.search-results__span');
      const sorrySpan = document.querySelector('.search-results-sorry__span');

      if (count === 0) {
        searchResults.classList.remove('hidden');
        searchSpan.classList.remove('hidden');
        searchSpan.innerText = Drupal.t('Search results for:') + ' ' + text;
        sorrySpan.classList.remove('hidden');
      }

      if (count > 0 && text !== 'all') {
        searchResults.classList.remove('hidden');
        searchSpan.classList.remove('hidden');
        searchSpan.innerText = Drupal.t('Search results for:') + ' ' + text;
        sorrySpan.classList.add('hidden');
      }

      contentContainer.innerHTML = '';

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

  Drupal.behaviors.search_init = {
    attach: function (context, settings) {
      once('textSearchInit', '.search-bar__input', context).forEach(function (element) {
        element.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            handleSearch(element);
          }
        });
      });

      once('textSearchInitOnClick', '.search-bar-icon', context).forEach(function (element) {
        element.addEventListener('click', () => {
          element = document.querySelector('.search-bar__input');
          handleSearch(element);
        });
      });
    },
  };
})(jQuery, Drupal);
