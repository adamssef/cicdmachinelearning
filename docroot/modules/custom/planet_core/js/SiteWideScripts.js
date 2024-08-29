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

new PlntSwitch({
    class: ".support-switch",
    startingTab: 0,
    contentClasses: [".box-1", ".box-2"]
});