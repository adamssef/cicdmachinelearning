(function ($, Drupal) {
  let previousBackgroundImageDivCount = $('.background-image-div').length;
  let previousProductOptionSelected = $('#edit-field-product-type-target-id').find('.selected span:first').text();
  let previousIndustryOptionSelected = $('#edit-field-industry-type-target-id').find('.selected span:first').text();
  let previousCompanySizeOptionSelected = $('#edit-field-company-size-target-id').find('.selected span:first').text();

  Drupal.behaviors.brandsWeWorkWithScript = {
    attach: function (context, settings) {
      once('brandsWeWorkWith', '.brands-we-work-with-container', context).forEach(function (element) {
        var container = $(element);
        var totalWidth = container[0].scrollWidth;
        var speed = 0.2;
        var logoWidth = container.children().first().outerWidth(true);
        var resetThreshold = logoWidth * 10;
        var animationFrameId;

        function animate() {
          container.children().each(function(index) {
            let currentTransform = new WebKitCSSMatrix(window.getComputedStyle(this).transform).m41;
            let newX = currentTransform - speed;

            if (Math.abs(newX) >= totalWidth - resetThreshold) {
              newX = 0; // Reset position back to the beginning.
            }

            this.style.transform = `translateX(${newX}px)`;
          });

          animationFrameId = requestAnimationFrame(animate);
        }

        // Function to reset and restart the animation
        function resetAndRestartAnimation() {
          cancelAnimationFrame(animationFrameId); // Stop the current animation
          container.children().css('transform', 'translateX(0)'); // Reset positions
          animate(); // Restart the animation

          // Set up the next reset in 3 minutes
          setTimeout(resetAndRestartAnimation, 120000);
        }

        // Start the animation and the reset loop
        animate();
        setTimeout(resetAndRestartAnimation, 120000);
      });
    }
  };

  Drupal.behaviors.swiperCarouselEnablerScript = {
    attach: function (context, settings) {
      if (context === document || context instanceof HTMLDocument) {
        let swiper = new Swiper('.swiper', {
          loop: true,
          observer: true,
          observeParents: true,
          centeredSlidesBounds: false,
          autoplay: {
            disableOnInteraction: false,
            delay: 4000,
            pauseOnMouseEnter: true,
            stopOnLastSlide: false
          },
          slidesPerView:'auto',
          spaceBetween: 20,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },

        });

        let swiperContainer = $(".swiper").get(0);

        swiperContainer.addEventListener("mouseout", () => {
          swiper.autoplay.start();
        });
      }
    }
  };

  function getSelectedProductOption() {
    return $("#edit-field-product-type-target-id").find(".selected span:first").text();
  }

  function getSelectedIndustryOption() {
    return $("#edit-field-industry-type-target-id").find(".selected span:first").text();
  }

  function getSelectedCompanySizeOption() {
    return $("#edit-field-company-size-target-id").find(".selected span:first").text();
  }

  Drupal.behaviors.fakeSelectDropdown = {
    attach: function (context, settings) {
      let fake_elements = $('.fake-element');

      window.addEventListener('scroll', function() {
        var scrollHeight = 740; // Change this to your desired scroll height
        var currentScroll = window.scrollY || window.pageYOffset;

        if (currentScroll > scrollHeight) {
          $('.dialog-off-canvas-main-canvas > header').css('background-color', 'white');
        } else {
          $('.dialog-off-canvas-main-canvas > header').css('background-color', '#F2F5F8');
        }
      });

      fake_elements.each(function(index, element) {
        let parent = $(this).closest('.case-studies__filter_select');

        $(element).click(function(event) {
          if($(this).hasClass('selected')) {
            let allElementsExpanded = true;

            $(parent).find('.fake-element').each((element)=>{
              if (!$(parent).find('.fake-element')[element].classList.contains('expanded')) {
                allElementsExpanded = false;
              }
            });

            if (allElementsExpanded) {
              $(parent).find('.fake-element').removeClass('expanded');
              $(parent).parent().removeClass('parent-expanded');
            }
            else {
              $('.fake-element').removeClass('expanded');
              $(parent).find('.fake-element').addClass('expanded');
              $(parent).parent().addClass('parent-expanded');

              let allElement = parent.get(0).querySelector('.fake-select-el');
              let newSelectedEl = document.querySelector('.selected.expanded');
              parent.prepend(allElement);
              parent.prepend(newSelectedEl);
            }
          } else {
            $(parent).children('.fake-element').removeClass('selected');
            $(parent).children('.fake-element').css('display', 'none');
            $(this).addClass('selected');
            $(parent).children('.fake-element').removeClass('expanded');
            $(parent).parent().removeClass('parent-expanded')
          }
        });
      });

      once('clickAwayFakeOptionEl', '.views-element-container', context).forEach((element) => {
        $(element).click(function(event) {
          if (!$(event.target).closest('.case-studies__filter_select').length) {
            $('.fake-element').removeClass('expanded');
            $('.fake-element').parent().parent().removeClass('parent-expanded');
          }
        });
      });
    }
  };

  Drupal.behaviors.loadMoreCardsScript = {
    attach: function (context, settings) {
      manage_load_more_button_display();

      once('loadMoreCardsScript', '.reset-filters-button', context).forEach(element => {
        $(element).click(e=>{
          resetAllTheSelects();
          manage_load_more_button_display();
        });
      });

      once('loadMoreCardsScript', '.we-are-sorry-button', context).forEach(element => {
        $(element).click(e=>{
          resetAllTheSelects();
          manage_load_more_button_display();
        })
      });

      function resetAllTheSelects() {
        $('.fake-element').each(function() {
          if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
          }

          if ($(this).hasClass('fake-select-el')) {
            $(this).addClass('selected');
          }
        });
      }

      const observer = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const backgroundImageDivElements = $('.background-image-div');
            if (backgroundImageDivElements.length !== previousBackgroundImageDivCount) {
              manage_load_more_button_display();
              previousBackgroundImageDivCount = backgroundImageDivElements.length;
            }

            if(
                previousProductOptionSelected !== getSelectedProductOption() ||
                previousIndustryOptionSelected !== getSelectedIndustryOption() ||
                previousCompanySizeOptionSelected !== getSelectedCompanySizeOption())
            {
              previousProductOptionSelected = getSelectedProductOption();
              previousIndustryOptionSelected = getSelectedIndustryOption();
              previousCompanySizeOptionSelected = getSelectedCompanySizeOption();

              let data = fetchCaseStudies(9);
              $('.triplet').remove();
              appendNewItems(data);
              manage_load_more_button_display();
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
        if(!status) {
          $(".loader").hide();
        } else {
          $(".loader").show();
        }
        $(".load-more-wrapper").hide();
        $(".no-articles").hide();
      }

      async function manage_load_more_button_display() {
        let load_more_btn = document.querySelector('.load-more-button');
        let loader = document.querySelector('.loader');
        loader.style.display = 'block';
        load_more_btn.style.display = 'none';

        let how_many_case_studies = $('.background-image-div').length;
        let product_option_selected = getSelectedProductOption().startsWith('All') ? 'All' : getSelectedProductOption();
        let industry_option_selected = getSelectedIndustryOption().startsWith('All') ? 'All' : getSelectedIndustryOption();
        let company_size_option_selected = getSelectedCompanySizeOption().startsWith('All') ? 'All' : getSelectedCompanySizeOption();

        try {
          const url = new URL(`/planet/case_studies/get_total_case_studies_count/${product_option_selected}/${industry_option_selected}/${company_size_option_selected}/`, window.location.origin);
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          var totalCaseStudiesCount = await response.json();
        } catch (error) {
          console.error('Error checking case studies count:', error);
          throw error;
        }

        if (how_many_case_studies >= 9 && how_many_case_studies < totalCaseStudiesCount) {
          load_more_btn.style.display = 'flex';
        }
        else {
          load_more_btn.style.display = 'none';
        }

        loader.style.display = 'none';
      }

      function appendNewItems(data) {
        let newTriplets = prepareTriplets(data);

        $(newTriplets).insertBefore($('footer').has('.load-more-button'));
        triplets = $('.triplet');
      }

      function prepareTriplets(data) {
        let howManyTriplets = $('.triplet').length;
        let triplets = [];
        let triplet = [];

        for (let i = 0; i < data.length; i++) {
          triplet.push(data[i]);
          if (triplet.length === 3) {
            triplets.push(triplet);
            triplet = [];
          }
        }

        if (triplet.length > 0) {
          triplets.push(triplet);
        }

        let newTriplets = triplets.map((tripletGroup, index) => {
          let className;
          let isEven = (howManyTriplets + index) % 2 === 0;
          let tripletHtml = tripletGroup.map((item, j) => {
            if (isEven) {
              className = j === 0 ? 'large-left' : (j === 1 ? 'small-right-top' : 'small-right-bottom');

              if (className === 'large-left') {
                return `<div class="background-image-div ${className}" style="background: linear-gradient(0deg, rgba(224, 0, 131, 0.30) 0%, rgba(224, 0, 131, 0.30) 100%), url('${item.image_url}') lightgray 50% / cover no-repeat;"><img class="background-image-div__logo-img" src="${item.logo_url}"/><a href="${item.url}"><span class="background-span">${item.title}</span><span class="initially-hidden-read-more">Read the full story <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy"></span></a></div>`;
              }
              else {
                if (className === 'small-right-top') {
                  return `<div class="background-image-div ${className}" style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), url('${item.image_url}') lightgray 50% / cover no-repeat;"><img class="background-image-div__logo-img" src="${item.logo_url}"/><a href="${item.url}"><span class="background-span">${item.title}</span><span class="initially-hidden-read-more">Read the full story <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy"></span></a></div>`;
                }

                if (className === 'small-right-bottom') {
                  return `<div class="background-image-div ${className}" style="background: linear-gradient(0deg, rgba(154, 174, 249, 0.30) 0%, rgba(154, 174, 249, 0.30) 100%), url('${item.image_url}') lightgray 50% / cover no-repeat;"><img class="background-image-div__logo-img" src="${item.logo_url}"/><a href="${item.url}"><span class="background-span">${item.title}</span><span class="initially-hidden-read-more">Read the full story <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy"></span></a></div>`;
                }

                // This is a fallback.
                return `<div class="background-image-div ${className}" style="background-image:url('${item.image_url}')"><img class="background-image-div__logo-img" src="${item.logo_url}"/><a href="${item.url}"><span class="background-span">${item.title}</span><span class="initially-hidden-read-more">Read the full story <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy"></span></a></div>`;
              }
            } else {
              className = j === 0 ? 'small-left-top' : (j === 1 ? 'small-left-bottom' : 'large-right');

              if (className === 'large-right') {
                return `<div class="background-image-div ${className}" style="background: linear-gradient(0deg, rgba(224, 0, 131, 0.30) 0%, rgba(224, 0, 131, 0.30) 100%), url('${item.image_url}') lightgray 50% / cover no-repeat;"><img class="background-image-div__logo-img" src="${item.logo_url}"/><a href="${item.url}"><span class="background-span">${item.title}</span><span class="initially-hidden-read-more">Read the full story <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy"></span></a></div>`;
              }
              else {
                if (className === 'small-left-top') {
                  return `<div class="background-image-div ${className}" style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), url('${item.image_url}') lightgray 50% / cover no-repeat;"><img class="background-image-div__logo-img" src="${item.logo_url}"/><a href="${item.url}"><span class="background-span">${item.title}</span><span class="initially-hidden-read-more">Read the full story <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy"></span></a></div>`;
                }

                if (className === 'small-left-bottom') {
                  return `<div class="background-image-div ${className}" style="background: linear-gradient(0deg, rgba(154, 174, 249, 0.30) 0%, rgba(154, 174, 249, 0.30) 100%), url('${item.image_url}') lightgray 50% / cover no-repeat;"><img class="background-image-div__logo-img" src="${item.logo_url}"/><a href="${item.url}"><span class="background-span">${item.title}</span><span class="initially-hidden-read-more">Read the full story <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy"></span></a></div>`;
                }

                // This is a fallback.
                return `<div class="background-image-div ${className}" style="background-image:url('${item.image_url}')"><img class="background-image-div__logo-img" src="${item.logo_url}"/><a href="${item.url}"><span class="background-span">${item.title}</span><span class="initially-hidden-read-more">Read the full story <img class="read-full-story__img" src="/resources/icons/sharp-arrow-pointing-right.svg" loading="lazy"></span></a></div>`;
              }
            }
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

      function manageClearButtonVisibility(optionArray = [] ,data= []) {
        let resetFilters = $('.reset-filters');
        let weAreSorrySpan = $('.we-are-sorry-span');

        if (optionArray.length === 0) {
          resetFilters.css('display', 'none');
          weAreSorrySpan.css('display', 'none');
          return;
        }

        let productOptionSelected = optionArray[0];
        let industryOptionSelected = optionArray[1];
        let companySizeOptionSelected = optionArray[2];

        if (
            productOptionSelected === "All" && industryOptionSelected === "All" && companySizeOptionSelected === "All"
        ) {
          $('.views-exposed-form ').css('margin', '48px');
          resetFilters.css('display', 'none');
          weAreSorrySpan.css('display', 'none');
        }
        else {
          $('.views-exposed-form').css('margin', '0');
          if (data.length === 0) {
            $('.reset-filters').addClass('with-we-are-sorry');
            weAreSorrySpan.css('display', 'block');
            $('.reset-filters-standalone-clear-filter-button').css('display', 'none');
          }
          else {
            $('.reset-filters').removeClass('with-we-are-sorry');
            $('.reset-filters-standalone-clear-filter-button').css('display', 'inline-flex');
            weAreSorrySpan.css('display', 'none');
          }
          resetFilters.css('display', 'inline-flex');
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

      /**
       * Event listener for document's ready event.
       */
      $(document).ready(function() {
        $('.triplet').each(function() {
          $(this).find('.background-image-div').each(function() {
            $(this).insertAfter($(this).parent());
          });
          $(this).find('div').not('.background-image-div').remove();
        });
      });

      let loadMoreButton = $('.load-more-button');
      manageClearButtonVisibility();

      /**
       * Event listener for the "Load more" button.
       */
      loadMoreButton.click(async function() {
        try {
          let current_number_of_loaded_items = $('.background-image-div').length;
          manage_load_more_button_display();
          fetchCaseStudies(9, current_number_of_loaded_items, "");
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
  };
})(jQuery, Drupal);
