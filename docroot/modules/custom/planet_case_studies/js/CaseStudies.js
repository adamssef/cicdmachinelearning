(function (Drupal) {
  let previousBackgroundImageDivCount = document.querySelectorAll('.background-image-div').length;

  let previousProductOptionSelected = getTextFromFirstMatch(
    '#edit-field-product-type-target-id .selected span'
  );

  let previousIndustryOptionSelected = getTextFromFirstMatch(
    '#edit-field-industry-type-target-id .selected span'
  );

  let previousCompanySizeOptionSelected = getTextFromFirstMatch(
    '#edit-field-company-size-target-id .selected span'
  );

  // Helper function
  function getTextFromFirstMatch(selector) {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : '';
  }

  function debounce(func, wait = 100, immediate = false) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  Drupal.behaviors.brandsWeWorkWithScript = {
    attach: function (context, settings) {
      once('brandsWeWorkWith', '.brands-we-work-with-container', context).forEach(function (container) {
        const totalWidth = container.scrollWidth;
        const speed = 0.2;

        // Get first child and calculate width including margin (like jQuery's outerWidth(true))
        const firstChild = container.children[0];
        const logoWidth = firstChild ? firstChild.offsetWidth + getComputedMargin(firstChild) : 0;
        const resetThreshold = logoWidth * 10;
        let animationFrameId;

        function getComputedMargin(el) {
          const style = getComputedStyle(el);
          return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }

        function animate() {
          Array.from(container.children).forEach(child => {
            const transform = getComputedStyle(child).transform;
            let currentX = 0;

            if (transform && transform !== 'none') {
              currentX = new WebKitCSSMatrix(transform).m41;
            }

            let newX = currentX - speed;

            if (Math.abs(newX) >= totalWidth - resetThreshold) {
              newX = 0;
            }

            child.style.transform = `translateX(${newX}px)`;
          });

          animationFrameId = requestAnimationFrame(animate);
        }

        function resetAndRestartAnimation() {
          cancelAnimationFrame(animationFrameId);
          Array.from(container.children).forEach(child => {
            child.style.transform = 'translateX(0)';
          });
          animate();
          setTimeout(resetAndRestartAnimation, 120000);
        }

        // Start the animation
        animate();
        setTimeout(resetAndRestartAnimation, 120000);
      });
    }
  };

  Drupal.behaviors.swiperCarouselEnablerScript = {
    attach: function (context, settings) {
      if (context === document || context instanceof HTMLDocument) {
        const swiper = new Swiper('.swiper', {
          loop: true,
          // observer: true,
          // observeParents: true,
          centeredSlidesBounds: false,
          autoplay: {
            disableOnInteraction: false,
            delay: 4000,
            pauseOnMouseEnter: true,
            stopOnLastSlide: false
          },
          slidesPerView: 'auto',
          spaceBetween: 20,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        });

        const swiperContainer = document.querySelector('.swiper');
        if (swiperContainer) {
          swiperContainer.addEventListener('mouseout', () => {
            swiper.autoplay.start();
          });
        }
      }
    }
  };

  function getSelectedProductOption() {
    return Drupal.t(getTextContent('#edit-field-product-type-target-id .selected span'));
  }

  function getSelectedIndustryOption() {
    return Drupal.t(getTextContent('#edit-field-industry-type-target-id .selected span'));
  }

  function getSelectedCompanySizeOption() {
    return Drupal.t(getTextContent('#edit-field-company-size-target-id .selected span'));
  }

  // Helper function
  function getTextContent(selector) {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : '';
  }

  Drupal.behaviors.fakeSelectDropdown = {
    attach: function (context, settings) {
      const fakeElements = context.querySelectorAll('.fake-element');

      fakeElements.forEach((element) => {
        const parent = element.closest('.case-studies__filter_select');

        element.addEventListener('click', (event) => {
          if (element.classList.contains('selected')) {
            // Check if all siblings are expanded
            const allFakeElements = parent.querySelectorAll('.fake-element');
            const allExpanded = Array.from(allFakeElements).every(el => el.classList.contains('expanded'));

            if (allExpanded) {
              allFakeElements.forEach(el => el.classList.remove('expanded'));
              parent.parentElement?.classList.remove('parent-expanded');
            } else {
              document.querySelectorAll('.fake-element').forEach(el => el.classList.remove('expanded'));
              allFakeElements.forEach(el => el.classList.add('expanded'));
              parent.parentElement?.classList.add('parent-expanded');

              const allElement = parent.querySelector('.fake-select-el');
              const newSelectedEl = document.querySelector('.selected.expanded');
              if (allElement && newSelectedEl) {
                parent.prepend(allElement);
                parent.prepend(newSelectedEl);
              }
            }
          } else {
            const children = parent.querySelectorAll('.fake-element');
            children.forEach(el => {
              el.classList.remove('selected');
              el.style.display = 'none';
            });

            element.classList.add('selected');
            children.forEach(el => el.classList.remove('expanded'));
            parent.parentElement?.classList.remove('parent-expanded');
          }
        });
      });

      once('clickAwayFakeOptionEl', '.views-element-container', context).forEach((element) => {
        element.addEventListener('click', (event) => {
          if (!event.target.closest('.case-studies__filter_select')) {
            document.querySelectorAll('.fake-element').forEach(el => {
              el.classList.remove('expanded');
              el.parentElement?.parentElement?.classList.remove('parent-expanded');
            });
          }
        });
      });
    }
  };

  /**
   * Event listener for document's ready event.
   */
  document.addEventListener('DOMContentLoaded',function() {
    let scrollHeight = 720;
    let currentScroll = window.scrollY || window.pageYOffset;

    if (currentScroll < scrollHeight) {
      document.querySelector('.megamenu-header').style.backgroundColor = '#F2F5F8';
    } else {
      document.querySelector('.megamenu-header').style.backgroundColor = 'white';
    }

    window.addEventListener('scroll', debounce(function() {
      let scrollHeight = 720;
      let currentScroll = window.scrollY || window.pageYOffset;
      if (currentScroll < scrollHeight) {
        document.querySelector('.megamenu-header').style.backgroundColor = '#F2F5F8';
      } else {
        document.querySelector('.megamenu-header').style.backgroundColor = 'white';
      }
    }, 100));


    document.querySelectorAll('.triplet').forEach(triplet => {
      const backgroundDivs = triplet.querySelectorAll('.background-image-div');

      backgroundDivs.forEach(bgDiv => {
        const parent = bgDiv.parentElement;
        if (parent && parent !== triplet) {
          // Przenieś .background-image-div po jego rodzicu
          parent.insertAdjacentElement('afterend', bgDiv);
        }
      });

      // Usuń wszystkie divy w triplet, które NIE są .background-image-div
      triplet.querySelectorAll('div').forEach(div => {
        if (!div.classList.contains('background-image-div')) {
          div.remove();
        }
      });
    });
  });

  Drupal.behaviors.loadMoreCardsScript = {
    attach: function (context, settings) {
      manage_load_more_button_display();

      once('loadMoreCardsScript', '.reset-filters-button', context).forEach(element => {
        element.addEventListener('click', e => {
          resetAllTheSelects();
          manageClearButtonVisibility([], [], 'clear filter');
          manage_load_more_button_display();
        });
      });

      once('loadMoreCardsScript', '.we-are-sorry-button', context).forEach(element => {
        element.addEventListener('click', e => {
          resetAllTheSelects();
          manageClearButtonVisibility([], [], 'clear filter');
          manage_load_more_button_display();
        });
      });

      function resetAllTheSelects() {
        document.querySelectorAll('.fake-element').forEach(el => {
          if (el.classList.contains('selected')) {
            el.classList.remove('selected');
          }

          if (el.classList.contains('fake-select-el')) {
            el.classList.add('selected');
          }
        });
      }

      const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const backgroundImageDivElements = document.querySelectorAll('.background-image-div');

            if (backgroundImageDivElements.length !== previousBackgroundImageDivCount) {
              manage_load_more_button_display();
              previousBackgroundImageDivCount = backgroundImageDivElements.length;
            }

            if (
              previousProductOptionSelected !== getSelectedProductOption() ||
              previousIndustryOptionSelected !== getSelectedIndustryOption() ||
              previousCompanySizeOptionSelected !== getSelectedCompanySizeOption()
            ) {
              previousProductOptionSelected = getSelectedProductOption();
              previousIndustryOptionSelected = getSelectedIndustryOption();
              previousCompanySizeOptionSelected = getSelectedCompanySizeOption();

              fetchCaseStudies(9).then(data => {
                // Remove all .triplet elements
                document.querySelectorAll('.triplet').forEach(el => el.remove());

                appendNewItems(data);
                manage_load_more_button_display();
              });
            }
          }
        }
      });

      function observeDOMChanges() {
        const config = {
          attributes: true,
          childList: false,
          subtree: true,
          attributeOldValue: true,
          attributeFilter: ['class']
        };
        observer.observe(document.body, config);
      }

      function is_loading(status = true) {
        const loader = document.querySelector('.loader');
        const loadMoreWrapper = document.querySelector('.load-more-wrapper');
        const noArticles = document.querySelector('.no-articles');

        if (loader) {
          loader.style.display = status ? 'block' : 'none';
        }

        if (loadMoreWrapper) {
          loadMoreWrapper.style.display = 'none';
        }

        if (noArticles) {
          noArticles.style.display = 'none';
        }
      }
      async function manage_load_more_button_display() {
        const loadMoreBtn = document.querySelector('.load-more-button');
        const loader = document.querySelector('.loader');

        if (loader) loader.style.display = 'block';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';

        const howManyCaseStudies = document.querySelectorAll('.background-image-div').length;

        const productOptionSelected = getSelectedProductOption().startsWith('All') ? 'All' : getSelectedProductOption();
        const industryOptionSelected = getSelectedIndustryOption().startsWith('All') ? 'All' : getSelectedIndustryOption();
        const companySizeOptionSelected = getSelectedCompanySizeOption().startsWith('All') ? 'All' : getSelectedCompanySizeOption();

        try {
          const url = new URL(
            `/planet/case_studies/get_total_case_studies_count/${productOptionSelected}/${industryOptionSelected}/${companySizeOptionSelected}/`,
            window.location.origin
          );

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const totalCaseStudiesCount = await response.json();

          if (
            howManyCaseStudies >= 9 &&
            howManyCaseStudies < totalCaseStudiesCount
          ) {
            if (loadMoreBtn) loadMoreBtn.style.display = 'flex';
          } else {
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
          }

          if (loader) loader.style.display = 'none';

        } catch (error) {
          console.error('Error checking case studies count:', error);
          throw error;
        }
      }

      function appendNewItems(data) {
        // Prepare the new triplet elements
        const newTriplets = prepareTriplets(data);

        // Find the footer that contains the load-more-button
        const footers = document.querySelectorAll('footer');
        let targetFooter = null;

        footers.forEach(footer => {
          if (footer.querySelector('.load-more-button')) {
            targetFooter = footer;
          }
        });

        // If such a footer is found, insert the new triplets before it
        if (targetFooter) {
          targetFooter.insertAdjacentHTML('beforebegin', newTriplets);
        }

        // Update the triplets variable to include the newly added elements
        triplets = document.querySelectorAll('.triplet');
      }

      function prepareTriplets(data) {
        let howManyTriplets = document.querySelectorAll('.triplet').length;
        let triplets = [];
        let triplet = [];

        data.forEach(item => {
          triplet.push(item);
          if (triplet.length === 3) {
            triplets.push(triplet);
            triplet = [];
          }
        });

        if (triplet.length > 0) {
          triplets.push(triplet);
        }

        let newTriplets = triplets.map((tripletGroup, index) => {
          let isEven = (howManyTriplets + index) % 2 === 0;

          let tripletHtml = tripletGroup.map((item, j) => {
            let pinkStyle = `background: linear-gradient(0deg, rgba(224, 0, 131, 0.30) 0%, rgba(224, 0, 131, 0.30) 100%), url('${item.image_url}') lightgray 50% / cover no-repeat`;
            let lavenderStyle = `background: linear-gradient(322deg, rgba(79, 70, 229, 0.7) 0%, rgba(79, 70, 229, 0.1) 34.5%), url('${item.image_url}') lightgray 50% / cover no-repeat`;
            let currentStyle, classNameBackground;

            if (item.landing_page_display_style === 'pink') {
              currentStyle = pinkStyle;
              classNameBackground = 'background-image-div';
            } else {
              currentStyle = lavenderStyle;
              classNameBackground = 'background-image-div background-image-div--lavender';
            }

            let className;
            if (isEven) {
              className = j === 0 ? 'large-left' : (j === 1 ? 'small-right-top' : 'small-right-bottom');
            } else {
              className = j === 0 ? 'small-left-top' : (j === 1 ? 'small-left-bottom' : 'large-right');
            }

            return `<div class="${classNameBackground} ${className}" style="${currentStyle}">
                        <img class="background-image-div__logo-img" src="${item.logo_url}"/>
                        <a href="${item.url}">
                            <span class="background-span">${item.title}</span>
                            <span class="initially-hidden-read-more">Read the full story 
                                <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy">
                            </span>
                        </a>
                    </div>`;
          }).join('');

          let tripletClass = isEven ? 'even' : 'odd';
          if (index === triplets.length - 1) {
            tripletClass += ' last';
          }

          tripletClass += ` triplet-size-${tripletGroup.length}`;

          return `<div class="triplet ${tripletClass}">${tripletHtml}</div>`;
        }).join('');

        return newTriplets;
      }

      function manageClearButtonVisibility(optionArray = [], data = [], word) {
        if (word === 'clear filter') {
          const clearBtn = document.querySelector('.reset-filters-standalone-clear-filter-button');
          if (clearBtn) clearBtn.style.display = 'none';
        }

        const resetFilters = document.querySelector('.reset-filters');
        const weAreSorrySpan = document.querySelector('.we-are-sorry-span');

        if (optionArray.length === 0) {
          if (resetFilters) resetFilters.style.display = 'none';
          if (weAreSorrySpan) weAreSorrySpan.style.display = 'none';
          return;
        }

        let productOptionSelected = optionArray[0];
        let industryOptionSelected = optionArray[1];
        let companySizeOptionSelected = optionArray[2];

        const allInAllLanguages = [
          'All', 'Todos los productos', 'Todos los sectores', 'Todas las empresas', 'Tutti i prodotti',
          'Tutti i settori', 'Tutte la aziende', 'Alle Produkte', 'Alle Branchen', 'Alle Unternehmen',
          'Tous les produits', 'Tous les secteurs', 'Toutes les entreprises', 'All Products', 'All Industries',
          'All Companies',
        ];

        const viewsForm = document.querySelector('.views-exposed-form');

        const allSelected =
          allInAllLanguages.includes(productOptionSelected) &&
          allInAllLanguages.includes(industryOptionSelected) &&
          allInAllLanguages.includes(companySizeOptionSelected);

        if (allSelected) {
          if (viewsForm) viewsForm.style.margin = '48px';
          if (resetFilters) resetFilters.style.display = 'none';
          if (weAreSorrySpan) weAreSorrySpan.style.display = 'none';
        } else {
          if (viewsForm) viewsForm.style.margin = '0';

          const clearBtn = document.querySelector('.reset-filters-standalone-clear-filter-button');
          if (data.length === 0) {
            if (weAreSorrySpan) weAreSorrySpan.style.display = 'block';
            if (clearBtn) clearBtn.style.display = 'block';
            if (resetFilters) resetFilters.style.display = 'block';
          } else {
            if (clearBtn) clearBtn.style.display = 'block';
            if (resetFilters) resetFilters.style.display = 'block';
          }
        }
      }

      async function fetchCaseStudies(limit = 9, offset = 0, context_hint= "") {
        let productOptionSelected = getSelectedProductOption().startsWith('All') ? 'All' : getSelectedProductOption();
        let industryOptionSelected = getSelectedIndustryOption().startsWith('All') ? 'All' : getSelectedIndustryOption();
        let companySizeOptionSelected = getSelectedCompanySizeOption().startsWith('All') ? 'All' : getSelectedCompanySizeOption();
        let optionArray = [productOptionSelected, industryOptionSelected, companySizeOptionSelected];

        is_loading(true);
        manageClearButtonVisibility();
        try {
          const url = new URL(`/planet/case_studies/${productOptionSelected}/${industryOptionSelected}/${companySizeOptionSelected}/${offset}/${previousBackgroundImageDivCount}`, window.location.origin);
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          manageClearButtonVisibility(optionArray, data);
          appendNewItems(data);
          return data;
        } catch (error) {
          console.error('Error loading more case studies:', error);
          throw error;
        }
      }

      observeDOMChanges();


      manageClearButtonVisibility();

      once('loadMoreButtonInit', '.load-more-button', context).forEach(loadMoreButton => {
        loadMoreButton.addEventListener('click', async function () {
          try {
            const currentNumberOfLoadedItems = document.querySelectorAll('.background-image-div').length;
            await manage_load_more_button_display();
            await fetchCaseStudies(9, currentNumberOfLoadedItems, "");
          } catch (error) {
            console.error('Error:', error);
          }
        });
      });
    }
  };
})(Drupal);
