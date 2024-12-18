(function (Drupal) {
  'use strict';

  Drupal.behaviors.viewsAjaxFilter = {
    attach: function (context, settings) {
      once('viewsAjaxFilter', '.planet-cat-filter li a', context).forEach(function (element) {
        element.addEventListener('click', function (e) {
          e.preventDefault();

          let categoryId = this.classList[0];
          let category = 'all';

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

          const contentContainer = document.querySelector('.content-container');

          document.querySelector('.search-results__container').classList.add('hidden');
          document.querySelector('.search-results__span').classList.add('hidden');
          document.querySelector('.search-results-sorry__span').classList.add('hidden');
          document.querySelector('.search-bar__input').value = '';

          fetch(`/api/views/planet_resources/${category}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(response => {
              contentContainer.innerHTML = '';

              // Loop through keys of the response object
              for (const [key, item] of Object.entries(response)) {
                const downloadLink = item.download_link ? `
                  <span class="flex justify-between">
                    <a target="_blank" href="${item.link}" class="w-fit inline-block bg-[rgba(32,32,32,1)] text-white inline-block no-underline text-[16px] font-bold px-[20px] py-[12px] rounded-[46px]">View ${item.resource_type}</a>
                    <a download="${item.filename}" class="download-btn" target="_blank" href="${item.download_link}">Download 
                      <img src="/resources/icons/customer_resources_library/download-icon.png" alt="Download icon">
                    </a>
                  </span>
                ` : `
                  <a target="_blank" href="${item.link}" class="w-fit inline-block bg-[rgba(32,32,32,1)] text-white inline-block no-underline text-[16px] font-bold px-[20px] py-[12px] rounded-[46px]">View ${item.resource_type}</a>`;

                const html = `
                  <div class="flex flex-col md:flex-wrap p-6 border border-solid rounded-[8px] border-[rgba(209,209,209,1)]">
                    <img src="${item.icon}" alt="Resource icon" class="mb-[25px] h-[50px] w-fit"/>
                    <span class="border-l-[4px] border-l-[rgba(224,0,131,1)] border-solid block font-bold text-lg mb-2 text-[14px] pl-[18px] pb-[3px] h-[20px] leading-[14px]">${item.sub_heading}</span>
                    <span class="block font-semibold text-xl mb-2 text-2xl">${item.title}</span>
                    <span class="block text-gray-600 mb-5 font-light leading-[22px]">${item.description}</span>
                    ${downloadLink}
                  </div>`;
                contentContainer.insertAdjacentHTML('beforeend', html);
              }
            })
            .catch(error => {
              console.error('Error fetching filtered content:', error);
              contentContainer.innerHTML = '<div>Error loading content</div>';
            });
        });
      });
    },
  };
})(Drupal);