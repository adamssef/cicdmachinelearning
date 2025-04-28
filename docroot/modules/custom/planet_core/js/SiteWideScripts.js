class PlntSwitch {
  constructor(options) {
    this.container = document.querySelector(options.class);
    if (!this.container) return;

    this.callbacks = options.callbacks || {};
    this.startingTab = options.startingTab || 0;

    // Read values from data attributes
    const dataItems = this.container.dataset.items;
    this.values = dataItems ? dataItems.split(",") : [];

    const dataSections = this.container.dataset.sections;
    this.sections = dataSections
      ? dataSections.split(",").map(selector => document.querySelectorAll(selector))
      : [];

    this.init();
  }

  init() {
    this.renderSwitch();
    this.showSwitch(); // Ensure toggle is visible before layout measurements

    // Delay initial layout measurement
    requestAnimationFrame(() => {
      this.handleInitialChange();
    });

    // Recalculate indicator on window resize
    window.addEventListener("resize", () => this.updateIndicator());
  }

  renderSwitch() {
    const toggle = this.container.querySelector(".toggle");
    toggle.innerHTML = '';
    toggle.classList.add("plnt-toggle-switch");

    // Create and append the indicator
    this.indicator = document.createElement("div");
    this.indicator.classList.add("indicator");
    toggle.appendChild(this.indicator);

    // Create buttons from values
    this.values.forEach((value, index) => {
      const button = document.createElement("button");
      button.innerText = value;
      button.classList.toggle("active", index === this.startingTab);
      button.addEventListener("click", () => this.handleOnChange(index));
      toggle.appendChild(button);
    });
  }

  handleOnChange(index) {
    // Update active button state
    this.container.querySelectorAll("button").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === index);
    });

    // Show/hide corresponding sections
    this.sections.forEach((sectionGroup, idx) => {
      sectionGroup.forEach(section => {
        if (section) {
          section.style.display = idx === index ? "block" : "none";
        }
      });
    });

    // Update the indicator's position and size
    this.updateIndicator();

    // Trigger optional callback
    if (this.callbacks.onChange) {
      this.callbacks.onChange({
        selectedIndex: index,
        selectedValue: this.values[index]
      });
    }
  }

  handleInitialChange() {
    this.handleOnChange(this.startingTab);
  }

  updateIndicator() {
    const activeButton = this.container.querySelector("button.active");

    if (activeButton) {
      requestAnimationFrame(() => {
        const width = activeButton.offsetWidth;
        const left = activeButton.offsetLeft;

        if (width && left !== undefined) {
          this.indicator.style.width = `${width + 3}px`;
          this.indicator.style.left = `${left}px`;
        }
      });
    }
  }

  showSwitch() {
    const toggle = this.container.querySelector(".toggle");
    toggle.style.display = 'block';
  }
}

// Support page toggle

const supportSwitch = new PlntSwitch({
    class: ".support-switch",
    startingTab: 0,
    contentClasses: [".box-1", ".box-2"]
});

  
const homepageVerticalsSwitch = new PlntSwitch({
  class: ".verticals-switch",
  startingTab: 0, 
});


// jQuery(document).ready(function(){
//   jQuery('.slide-track').slick({
//     slidesToShow: 6,
//     "infinite": true,
//     "slidesToScroll": 1,
//     "autoplay": true,
//     "autoplaySpeed": 0,
//     draggable: false,
//     "speed": 2000,
//     "cssEase": "linear",
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3
//         }
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2
//         }
//       }
//     ]
//   });
//  });
jQuery(document).ready(function($) {
  // Handle top-level tab navigation
  $('.coh-accordion-tabs-nav li a').on('click', function(e) {
    e.preventDefault();
    const targetId = $(this).attr('href');
    const $tabContent = $(targetId);
    
    // Update tab states
    $('.coh-accordion-tabs-nav li').removeClass('is-active');
    $(this).parent().addClass('is-active');
    
    // Hide all content sections and show target
    $('.coh-accordion-tabs-content').hide().removeClass('is-active');
    $tabContent.show().addClass('is-active');
  });

  // Handle accordion functionality
  $('.coh-accordion-title a').on('click', function(e) {
    e.preventDefault();
    const $title = $(this).parent();
    const targetId = $(this).attr('href');
    const $content = $(targetId);
    const isExpanded = $(this).attr('aria-expanded') === 'true';

    // Close all other accordion items
    if (!isExpanded) {
      $('.coh-accordion-tabs-content').not($content).slideUp();
      $('.coh-accordion-title a').not(this).attr('aria-expanded', 'false');
      $('.coh-accordion-title').not($title).removeClass('is-active');
    }

    // Toggle current accordion item
    $content.slideToggle();
    $(this).attr('aria-expanded', !isExpanded);
    $title.toggleClass('is-active');
  });

  // Initialize: Show active tab/accordion content
  if ($('.coh-accordion-tabs-nav li.is-active').length > 0) {
    $('.coh-accordion-tabs-nav li.is-active a').trigger('click');
  } else {
    $('.coh-accordion-tabs-nav li:first a').trigger('click');
  }

  // Handle "Back to Top" buttons
  $('.coh-js-scroll-to').on('click', function(e) {
    e.preventDefault();
    const targetSelector = $(this).data('coh-scroll-to');
    const offset = $(this).data('coh-scroll-offset') || 0;
    const duration = $(this).data('coh-scroll-duration') || 450;
    
    $('html, body').animate({
      scrollTop: $(targetSelector).offset().top - offset
    }, duration);
  });

  // Handle responsive behavior
  function handleResponsiveChange(e) {
    if (window.matchMedia('(max-width: 767px)').matches) {
      // Mobile view - force accordion mode
      $('.coh-accordion-tabs-inner').addClass('coh-accordion-tabs-display-accordion');
    } else {
      // Desktop view - restore original state
      $('.coh-accordion-tabs-inner').removeClass('coh-accordion-tabs-display-accordion');
    }
  }

  // Initial check and listen for window resize
  handleResponsiveChange();
  $(window).on('resize', handleResponsiveChange);
});

jQuery(document).ready(function() {
  jQuery('.coh-js-scroll-to').on('click', function(e) {
      e.preventDefault();
      jQuery('html, body').animate({
          scrollTop: jQuery('#contact-us').offset().top
      }, 450); // Using the same duration as in your original HTML
  });
});
jQuery(document).ready(function() {

  // Hide the "default" option on page load
  jQuery('.planet-custom-select-list .default-option').hide();

  // Toggle dropdown on main click
  jQuery('.planet-custom-select-main').on('click', function(e) {
    e.stopPropagation(); // Prevent event from bubbling up to document

    // Close all other lists
    jQuery('.planet-custom-select-list').not(jQuery(this).next()).hide();

    // Toggle the current one
    jQuery(this).next('.planet-custom-select-list').toggle();
  });

  // Close dropdown when clicking outside
  jQuery(document).on('click', function() {
    jQuery('.planet-custom-select-list').hide();
  });

  // Prevent closing when clicking inside the list
  jQuery('.planet-custom-select-list').on('click', function(e) {
    e.stopPropagation();
  });

  jQuery('.planet-custom-select-list li').on('click', function(e) {
    e.stopPropagation(); // Optional: prevents bubbling
    
    // Optional: update the main text to what was clicked
    jQuery(this).closest('.planet-custom-select').find('.planet-custom-select-main').text(jQuery(this).text());

    var clickedId = jQuery(this).data('id');

    // Hide the list
    jQuery(this).parent('.planet-custom-select-list').hide();

    // If "default" is selected, hide it, else show it again
    if (clickedId === 'default') {
      jQuery('.planet-custom-select-list .default-option').hide();
    } else {
      jQuery('.planet-custom-select-list .default-option').show();
    }
  });

});

jQuery('.planet-events-search-wrapper').on('click', function(e) {
  e.stopPropagation(); // Prevent the document click from firing immediately
  jQuery(this).addClass('input-focus');
});

jQuery(document).on('click', function(e) {
  if (!jQuery(e.target).closest('.planet-events-search-wrapper').length) {
    jQuery('.planet-events-search-wrapper').removeClass('input-focus');
  }
});