var swiperBrandsOptions = {
    loop: true,
    draggable: false,
    preventInteractionOnTransition: true,
    autoplay: {
      delay: 1,
    },
    freeMode: true,
    speed: 6000,
    freeModeMomentum: false,
    breakpoints: {
      // when window width is >= 320px
      0: {
        slidesPerView: 3,
        spaceBetween: 5
      },
      767: {
        slidesPerView: 4,
        spaceBetween: 10
      },
      991: {
        slidesPerView: 4,
        spaceBetween: 10
      },
      1200: {
        slidesPerView: 10,
        spaceBetween: 10
      }
    }
  };
  
  const swiperBrands = new Swiper('.swiper-brands', swiperBrandsOptions);
  const swiperTestimonials = new Swiper('.swiper-testimonials', {
    navigation: {
      nextEl: '.next-inner-button',
      prevEl: '.prev-inner-button',
    },
  });
  const swiperPros = new Swiper('.swiper-pros', {
    centeredSlides: true,
    slidesPerView: 1.2,
    loop: true,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-custom-pagination",
      clickable: true,
    },
  });
  
  swiperPros.slideToLoop(1, 0);
  
  
  
  class PlntSwitch {
    constructor(options) {
      this.selector = options.class || ".plnt-switch";
      this.values = options.values || [];
      this.callbacks = options.callbacks || {};
      this.startingTab = options.startingTab || 0; // Default to the first tab
      this.init();
    }
  
    init() {
      const plntSwitchContainer = document.querySelector(this.selector);
      if (!plntSwitchContainer) return;
  
      const toggleContainer = plntSwitchContainer.querySelector(".toggle");
      if (!toggleContainer) {
        console.error("Toggle container not found.");
        return;
      }
  
      this.renderSwitch(toggleContainer);
      this.addListeners(plntSwitchContainer);
  
      // Initialize the indicator position after rendering
      window.addEventListener("load", () =>
        this.updateIndicator(toggleContainer)
      );
      window.addEventListener("resize", () =>
        this.updateIndicator(toggleContainer)
      );
  
      // Manually trigger the initial change to display the correct section
      this.handleInitialChange(plntSwitchContainer);
    }
  
    renderSwitch(container) {
      container.classList.add("plnt-toggle-switch");
  
      const indicator = document.createElement("div");
      indicator.classList.add("indicator");
      container.appendChild(indicator);
  
      this.values.forEach((value, index) => {
        const id = `option_${index + 1}_${Date.now()}`;
  
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `plan_${Date.now()}`;
        input.id = id;
        input.dataset.box = index + 1;
        input.checked = index === this.startingTab; // Check the starting tab
  
        const label = document.createElement("label");
        label.htmlFor = id;
        label.dataset.box = index + 1;
        label.innerText = value;
  
        container.appendChild(input);
        container.appendChild(label);
      });
    }
  
    addListeners(container) {
      const inputs = container.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("change", () => {
          this.updateIndicator(container);
          this.handleOnChange(input, container);
        });
      });
    }
  
    handleInitialChange(container) {
      const inputs = container.querySelectorAll("input");
      const initialInput = inputs[this.startingTab];
      if (initialInput) {
        this.updateIndicator(container); // Ensure the indicator is positioned correctly
        this.handleOnChange(initialInput, container); // Trigger the change to show the correct section
      }
    }
  
    updateIndicator(container) {
      const checkedInput = container.querySelector("input:checked");
      if (checkedInput) {
        const label = checkedInput.nextElementSibling;
        const indicator = container.querySelector(".indicator");
  
        // Set the width and position of the indicator based on the selected label
        indicator.style.width = `${label.offsetWidth + 4}px`;
        indicator.style.left = `${label.offsetLeft}px`;
      }
    }
  
    handleOnChange(input, container) {
      const value = input.nextElementSibling.innerText;
      const index = Array.from(
        input.parentNode.querySelectorAll("input")
      ).indexOf(input);
  
      // Only target the toggle sections within the current container
      const sections = container.parentNode.querySelectorAll(".toggle-section");
      sections.forEach((section, sectionIndex) => {
        section.style.display = sectionIndex === index ? "block" : "none";
      });
  
      if (this.callbacks.onChange) {
        this.callbacks.onChange({
          selectedIndex: index,
          selectedValue: value
        });
      }
    }
  }
  
  
  new PlntSwitch({
    class: ".verticals-switch",
    values: ["Retail", "Hospitality", "Travel"],
    startingTab: 0, 
  });
  
  
  
  
  
  
  jQuery(document).ready(function () {
  
  // Event listeners for buttons
  jQuery('.pros-showcase-btn').click(function() {
      let industry = jQuery(this).data("pro"); //friction, revenue, simplify
      jQuery(".pros-showcase-btn").removeClass("pros-selected");
      jQuery(this).addClass("pros-selected");
  
      jQuery(".pros-wrapper").hide();
      jQuery(".pros-wrapper-" + industry).show();
  });
  
    });