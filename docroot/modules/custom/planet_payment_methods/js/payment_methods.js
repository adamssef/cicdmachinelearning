(function (Drupal, once) {
  'use strict';

  function hasOverflow(el) {
    return el.scrollWidth > el.clientWidth;
  }

  function initializeState() {
    let initialState = {
      defaultText: getDefaultTextForInitialization(),
      dropdownElements: [],
      defaultElementIndex: 0,
      selectedElementIndex: 0,
      isDropdownExpanded: false,
      clearFilterWithoutText: false,
      clearFilterWithText: false,
      lastSelectedNonDefaultElement: null,
      defaultChannelLabel: 'All Channels',
      selectedChannelLabel: false,
    };

    initialState.dropdownElements[0] = document.getElementsByClassName('dropdown-item__default')[0].innerText;
    let otherItems = document.querySelectorAll('.dropdown-item:not(.dropdown-item__default)');

    otherItems.forEach(function (item) {
      initialState.dropdownElements.push(Drupal.t(item.innerText.trim()));
    });

    return initialState;
  }

  // Initialize state with it's default values.
  let state = initializeState();

  function resetStateToDefaultText() {
    let defaultElement = document.querySelector('.dropdown-item__default > span');
    defaultElement.innerText = state.defaultText;
  }

  function updateDefaultStateText(index) {
    let defaultElement = document.querySelector('.dropdown-item__default > span');
    defaultElement.innerText = state.dropdownElements[index];
  }

  function getDefaultTextForInitialization() {
    let defaultElement = document.querySelector('.dropdown-item__default > span');
    return defaultElement.innerText;
  }

  function getIndexOfTheGivenItem(innerText) {
    let items = document.querySelectorAll('.dropdown-item');
    let index = 0;
    items.forEach(function (item, i) {
      if (item.innerText === innerText) {
        index = i;
      }
    });
    return index;
  }

  function showDropdownContainer() {
    document.getElementsByClassName('dropdown-container')[0].classList.remove('hidden');
    state.isDropdownExpanded = true;
  }

  function hideDropdownContainer() {
    document.getElementsByClassName('dropdown-container')[0].classList.add('hidden');
    state.isDropdownExpanded = false;
  }

  function hideClearFilterButtons() {
    document.querySelector('.reset-filters-not-standalone').classList.add('hidden');
    document.querySelector('.reset-filters-standalone-clear-filter-button').classList.add('hidden');
  }

  function showClearFilterButtons() {
    if (getTheCurrentPaymentMethodsCount() > 0) {
      document.querySelector('.reset-filters-not-standalone').classList.add('!hidden');
      document.querySelector('.reset-filters-standalone-clear-filter-button').classList.remove('hidden');
    }
    else {
      document.querySelector('.reset-filters-not-standalone').classList.remove('hidden');
      document.querySelector('.reset-filters-standalone-clear-filter-button').classList.add('hidden');
    }

  }

  function isLoading(status = true) {
    if (!status) {
      document.querySelector('.loader').classList.add('hidden');
    } else {
      document.querySelector('.loader').classList.remove('hidden');
    }
  }

  function hideLoadMoreButton() {
    document.querySelector('.load-more-button').classList.add('hidden');
  }

  function addTooltip() {
    document.querySelectorAll('.title-wrap').forEach(el => {
      if (hasOverflow(el)) {
        el.setAttribute('title', el.textContent.trim());
      } else {
        el.removeAttribute('title');
      }
    });
  }

  function showLoadMoreButton() {
    document.querySelector('.load-more-button').classList.remove('hidden');
  }

    function getTheCurrentPaymentMethodsCount() {
      return document.querySelectorAll('#payment-methods-container a').length;
    }

    async function fetchPaymentMethods(paymentMethod, channel, offset = 0, limit = 20) {
      if (paymentMethod === 'E-banking/bank transfer') {
        paymentMethod = 'E-banking';
      }
      try {
        // We use 'all' as a default value for the payment method, so we need to change it to 'all' for the backend.
        if (paymentMethod === getDefaultTextForInitialization()) {
          paymentMethod = 'all';
        }

        isLoading(true);
        const url = new URL(`/planet/payment_methods/${paymentMethod}/${channel}/${offset}/${limit}/`, window.location.origin);
        let response = await fetch(url);

        if (!response.ok) {
          isLoading(false);
          throw new Error('Network response was not ok');
        }

        response = await response.json();
        let currentPaymentMethodsCount = getTheCurrentPaymentMethodsCount();

        if (isNaN(currentPaymentMethodsCount)) {
          currentPaymentMethodsCount = 0;
        }

        let resultArray = Object.values(response);
        let totalPaymentMethodsCount = resultArray[resultArray.length - 1];
        let actualPaymentMethodsCount = Object.values(response).length + currentPaymentMethodsCount;

        if (actualPaymentMethodsCount < totalPaymentMethodsCount) {
          showLoadMoreButton();
        } else {
          let loadMoreButton = document.querySelector('.load-more-button');
          if (!loadMoreButton.classList.contains('hidden')) {
            showLoadMoreButton();
          }
        }

        isLoading(false);

        return response;
      } catch (error) {
        isLoading(false);
        throw error;
      }
    }

    async function fetchPaymentMethodsCount(paymentMethod, channel) {
      if (paymentMethod === 'E-banking/bank transfer') {
        paymentMethod = 'E-banking';
      }
      try {
        const url = new URL(`/planet/payment_methods/get_total_payment_methods_count/${paymentMethod}/${channel}`, window.location.origin);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        var totalPaymentMethodsCount = await response.json();
        return totalPaymentMethodsCount;
      } catch (error) {
        throw error;
      }

    }

    function removePaymentMethods() {
      let paymentMethods = document.querySelectorAll('#payment-methods-container a');
      paymentMethods.forEach(function (paymentMethod) {
        paymentMethod.remove();
      });

      hideLoadMoreButton();
    }

    function appendPaymentMethods(paymentMethods) {
      Object.values(paymentMethods).forEach(function (paymentMethod) {
        if (paymentMethod.title) {
          let surroundingAnchor = document.createElement('a');
          surroundingAnchor.setAttribute('href', paymentMethod['url']);
          surroundingAnchor.setAttribute(('target'), '_blank');
          let mainContainer = document.querySelector('#payment-methods-container');
          let imageContainer = document.createElement('img');
          imageContainer.src = paymentMethod['logo_url'];
          imageContainer.classList.add('w-[64px]', 'h-[64px]', 'rounded-lg', 'mb-[25px]', 'mt-[25px]');
          let singlePaymentMethodContainer = document.createElement('div');
          let titleContainer = document.createElement('div');
          titleContainer.classList.add('title-wrap','text-2xl', 'leading-[30px]', 'font-semibold', 'text-planet-black', 'mb-6');
          titleContainer.innerText = paymentMethod.title;
          let category = document.createElement('div');
          category.classList.add('text-sm', 'font-semibold', 'leading-[18px]', 'uppercase', 'text-planet-black', 'border-l-4', 'border-planet-pink', 'border-solid', 'pl-4', 'mb-2');
          category.innerText = paymentMethod['payment_options'][0];
          singlePaymentMethodContainer.append(imageContainer, category, titleContainer);
          singlePaymentMethodContainer.classList.add('px-6', 'w-full', 'sm:w-[264px]', 'h-[241px]', 'border', 'border-planet-grey', 'border-solid', 'p-[25px]', 'rounded-lg');
          let iconContainer = document.createElement('div');
          iconContainer.classList.add('flex', 'justify-end');
          let icon = document.createElement('img');
          icon.setAttribute('src', '/resources/images/payment_methods/icons/arrow_right.svg');
          iconContainer.append(icon);
          singlePaymentMethodContainer.append(iconContainer);
          surroundingAnchor.append(singlePaymentMethodContainer);
          surroundingAnchor.removeAttribute('target');
          surroundingAnchor.classList.add('w-full', 'md:w-[264px]', 'hover:shadow-planet-pp-card-hover', 'transition-shadow', 'duration-300', 'rounded-[8px]');
          mainContainer.appendChild(surroundingAnchor);
          addTooltip();
        }
      });
    }

    Drupal.behaviors.clickAway = {
      attach: function () {
        once('clickAwayFunctionality', '.dialog-off-canvas-main-canvas').forEach((element) => {
          element.addEventListener('click', function(event) {
            if (!event.target.closest('.dropdown-items')) {
              hideDropdownContainer();
            }
          });
        });
      }
    };

    Drupal.behaviors.initLoad = {
      attach: async function () {
        let paymentMethods = await fetchPaymentMethods('all', 'all');
        appendPaymentMethods(paymentMethods);
      },
    };

    Drupal.behaviors.loadMore = {
      attach: async function () {
        let loadMoreButton = document.querySelector('.load-more-button');
        loadMoreButton.addEventListener('click', async function () {
          let paymentMethod = state.dropdownElements[state.selectedElementIndex];
          let channel = state.selectedChannelLabel;
          let currentPaymentMethodsCount = getTheCurrentPaymentMethodsCount();
          let totalPaymentMethodsCount = await fetchPaymentMethodsCount(paymentMethod, channel ?? state.defaultChannelLabel);

          if (currentPaymentMethodsCount < totalPaymentMethodsCount) {
            isLoading(true);
            hideLoadMoreButton();
            let paymentMethods = await fetchPaymentMethods(paymentMethod, channel ?? state.defaultChannelLabel, currentPaymentMethodsCount);
            appendPaymentMethods(paymentMethods);
            isLoading(false);
            showLoadMoreButton();
            currentPaymentMethodsCount = getTheCurrentPaymentMethodsCount();
            totalPaymentMethodsCount = await fetchPaymentMethodsCount(paymentMethod, channel ?? state.defaultChannelLabel);

            if (currentPaymentMethodsCount === totalPaymentMethodsCount) {
              hideLoadMoreButton();
            }
          }
          else {
            hideLoadMoreButton();
          }
        });
      },
    };

    Drupal.behaviors.channelsSwitcher = {
      attach: () => {
        let channelLabels = document.querySelectorAll('.switch label');

        Array.from(channelLabels).forEach(item => {
          item.addEventListener('click', async () => {

            let areTheChannelsTheSame = state.selectedChannelLabel === item.innerText;

            if (!areTheChannelsTheSame) {
              state.selectedChannelLabel = item.innerText;
              removePaymentMethods();
              let paymentMethods = await fetchPaymentMethods(state.dropdownElements[state.selectedElementIndex], state.selectedChannelLabel !== false ? state.selectedChannelLabel : state.defaultChannelLabel);
              appendPaymentMethods(paymentMethods);
            }
          });
        });
      }
    };

    Drupal.behaviors.dropdown = {
      attach: function (context) {
        isLoading(false);
        once('paymentMethodsSwitcher', '.dropdown-item', context).forEach(function (element) {
          element.addEventListener('click', async function (event) {
            let text = event.target.innerText;
            let hasTheFilterSelectionChanged = state.dropdownElements[state.selectedElementIndex] !== text;
            let isTheElementDefault = element.classList.contains('dropdown-item__default');
            let isTheSamePaymentMethod = state.dropdownElements[state.selectedElementIndex] === text;

            if (hasTheFilterSelectionChanged && !isTheElementDefault && !isTheSamePaymentMethod) {
              removePaymentMethods();
            }

            let index = getIndexOfTheGivenItem(text);

            if (!element.classList.contains('dropdown-item__default') && !isTheSamePaymentMethod && state.dropdownElements.toString().includes(text)) {
              hideDropdownContainer();

              let paymentMethods = await fetchPaymentMethods(text, state.selectedChannelLabel ?? state.defaultChannelLabel);
              let index  = state.dropdownElements.indexOf(text);
              state.selectedElementIndex = index;
              appendPaymentMethods(paymentMethods);
            }

            if (state.isDropdownExpanded === false && index === 0) {
              showDropdownContainer();
              resetStateToDefaultText();
              state.isDropdownExpanded = true;
            } else {
              if (index === state.defaultElementIndex) {
                hideDropdownContainer();
                state.isDropdownExpanded = false;
              } else {
                state.selectedElementIndex = index;
                state.dropdownElements[0] = text;
                updateDefaultStateText(index);
                showClearFilterButtons();
                hideDropdownContainer();
                state.isDropdownExpanded = false;
              }
            }
          });
        });
      },
    };

    Drupal.behaviors.resetFilters = {
      attach: function (context) {
        Array.from(document.getElementsByClassName('reset-filters-button')).forEach(function (element) {
          element.addEventListener('click', async function () {
            resetStateToDefaultText();
            removePaymentMethods();
            hideClearFilterButtons();
            state.clearFilterWithText = false;
            state.clearFilterWithoutText = false;
            state.selectedElementIndex = 0;
            state.dropdownElements[0] = state.defaultText;
            let paymentMethods = await fetchPaymentMethods('all', 'all');
            appendPaymentMethods(paymentMethods);
          });
        });
      },
    };
  })(Drupal, once);
