class PlntSwitch {
    constructor(options) {
      this.container = document.querySelector(options.class);
      this.callbacks = options.callbacks || {};
      this.startingTab = options.startingTab || 0;
      if (!this.container) return;
  
      // Ottieni le etichette dal data-items del contenitore genitore
      const dataItems = this.container.dataset.items;
      this.values = dataItems ? dataItems.split(",") : [];
  
      // Ottieni le sezioni dal data-sections del contenitore genitore
      const dataSections = this.container.dataset.sections;
      this.sections = dataSections
        ? dataSections
            .split(",")
            .map((selector) => document.querySelectorAll(selector))
        : [];
  
      this.init();
    }
  
    init() {
      this.renderSwitch();
      this.handleInitialChange();
      window.addEventListener("resize", () => this.updateIndicator());
      
      // Show the switch after initialization
      this.showSwitch();
    }
  
    renderSwitch() {
      const toggle = this.container.querySelector(".toggle");
  
      // Clear any existing content inside the toggle div
      toggle.innerHTML = '';
  
      toggle.classList.add("plnt-toggle-switch");
  
      // Crea l'indicatore
      this.indicator = document.createElement("div");
      this.indicator.classList.add("indicator");
      toggle.appendChild(this.indicator);
  
      // Crea i pulsanti basati sui valori letti dal data-items
      this.values.forEach((value, index) => {
          const button = document.createElement("button");
          button.innerText = value;
          button.classList.toggle("active", index === this.startingTab);
          button.addEventListener("click", () => this.handleOnChange(index));
          toggle.appendChild(button);
      });
  
      this.updateIndicator();
    }
  
    handleOnChange(index) {
      // Aggiorna il pulsante attivo
      this.container
        .querySelectorAll("button")
        .forEach((btn, idx) => btn.classList.toggle("active", idx === index));
  
      // Mostra o nasconde le sezioni in base alla selezione
      this.sections.forEach((sectionGroup, idx) => {
        sectionGroup.forEach((section) => {
          if (section) section.style.display = idx === index ? "block" : "none";
        });
      });
  
      // Aggiorna la posizione dell'indicatore
      this.updateIndicator();
  
      // Esegui callback
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
        this.indicator.style.width = `${activeButton.offsetWidth + 3}px`;
        this.indicator.style.left = `${activeButton.offsetLeft}px`;
      }
    }
  
    showSwitch() {
      // Show the switch element
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


jQuery(document).ready(function(){
  jQuery('.slide-track').slick({
    slidesToShow: 6,
    "infinite": true,
    "slidesToScroll": 1,
    "autoplay": true,
    "autoplaySpeed": 0,
    draggable: false,
    "speed": 2000,
    "cssEase": "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  });
 });


 jQuery(document).ready(function($) {
  jQuery('.coh-accordion-tabs').each(function() {
    const tabContainer = jQuery(this);
    const tabLinks = tabContainer.find('.coh-accordion-tabs-nav > li');
    const tabContents = tabContainer.find('.coh-accordion-tabs-content');
    const tabTitles = tabContainer.find('.coh-accordion-title');

    tabLinks.on('click', function(e) {
      e.preventDefault();
      const targetId = jQuery(this).find('a').attr('href');

      tabLinks.removeClass('is-active');
      tabContents.hide().removeClass('is-active');
      tabTitles.removeClass('is-active');

      jQuery(this).addClass('is-active');
      tabContainer.find(targetId).show().addClass('is-active');
      tabContainer.find(`.coh-accordion-title a[href="${targetId}"]`).parent().addClass('is-active');
    });
  });
});
jQuery(document).ready(function($) {
  jQuery('.coh-accordion-tab').each(function() {
    const accordionContainer = jQuery(this);
    const accordionTitle = accordionContainer.find('.coh-accordion-title a');
    const accordionContent = accordionContainer.find('.coh-accordion-tabs-content');

    accordionTitle.on('click', function(e) {
      e.preventDefault();
      const targetId = jQuery(this).attr('href');
      const isExpanded = jQuery(this).attr('aria-expanded') === 'true';
      
      if (isExpanded) {
        accordionContainer.find(targetId).slideUp();
        jQuery(this).attr('aria-expanded', 'false');
      } else {
        accordionContent.slideUp();
        accordionTitle.attr('aria-expanded', 'false');
        accordionContainer.find(targetId).slideDown();
        jQuery(this).attr('aria-expanded', 'true');
      }
    });
  });
});

jQuery(document).ready(function() {
  jQuery('.coh-js-scroll-to').on('click', function(e) {
      e.preventDefault();
      jQuery('html, body').animate({
          scrollTop: jQuery('#contact-us').offset().top
      }, 450); // Using the same duration as in your original HTML
  });
});
