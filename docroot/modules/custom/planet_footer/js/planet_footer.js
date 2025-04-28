/**
 * @file
 * Dropdown language switcher JS.
 */

(function (Drupal, once) {
  'use strict';

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setLangCookie() {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `modal-lang-detection=true; expires=${expiryDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
  }

  Drupal.behaviors.languageSwitcher = {
    attach: function (context, settings) {
      once('block-language-switcher', '#block-language-switcher', context).forEach(function (element) {
        const selectMenu = element.querySelector('.language-switcher__select-menu');
        const selectButton = element.querySelector('.language-switcher__button');
        const dropdown = element.querySelector('.language-switcher__drop-down');

        selectButton.addEventListener('click', function (event) {
          event.stopPropagation();
          dropdown.style.display = 'block';
          selectMenu.setAttribute('aria-expanded', 'true');
          selectMenu.classList.add('is-expanded');
        });

        document.body.addEventListener('click', function () {
          dropdown.style.display = 'none';
          selectMenu.setAttribute('aria-expanded', 'false');
          selectMenu.classList.remove('is-expanded');
        });

        selectMenu.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      });

      const browserLanguage = navigator.language || navigator.userLanguage;
      const browserLanguageCode = browserLanguage.substr(0, 2);

      const modalElement = document.getElementById('modal-language-detection');

      // ✅ Bezpieczne sprawdzenie, czy modal istnieje
      if (modalElement) {
        const hasLanguage = modalElement.classList.contains('lang-' + browserLanguageCode);
        const isEnglish = modalElement.classList.contains('en');

        if (isEnglish && hasLanguage && !getCookie('modal-lang-detection')) {
          document.querySelectorAll('.btn-lang-all').forEach(function (btn) {
            btn.style.display = 'none';
          });
          document.querySelectorAll('.btn-lang-' + browserLanguageCode).forEach(function (btn) {
            btn.style.display = 'block';
          });

          MicroModal.show('modal-language-detection', {
            disableFocus: true,
            closeTrigger: 'data-micromodal-close',
            onClose: () => {
              setLangCookie();
            }
          });

          document.querySelectorAll('.btn-lang-all').forEach(function (btn) {
            btn.addEventListener('click', function () {
              setLangCookie();
            });
          });
        }
      }
    }
  };
})(Drupal, once);
