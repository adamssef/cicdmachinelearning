/**
 * @file
 * Dropdown language switcher JS.
 */

(function ($, Drupal) {
  'use strict';

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setLangCookie() {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const cookieOptions = {
      expires: expiryDate.toUTCString(),
      path: '/',
      secure: true, // Secure attribute (requires HTTPS)
      sameSite: 'Strict' // SameSite attribute (or 'Lax' or 'None' depending on your use case)
    };
    document.cookie = `modal-lang-detection=true; expires=${cookieOptions.expires}; path=${cookieOptions.path}; secure=${cookieOptions.secure}; SameSite=${cookieOptions.sameSite}`;
  }

  Drupal.behaviors.languageSwitcher = {
    attach: function (context, settings) {
      once('block-language-switcher', '#block-language-switcher', context).forEach(element => {
        let $el = $(element);
        let $selectMenu = $(".language-switcher__select-menu", $el);
        let $selectButton = $(".language-switcher__button", $el);
        let $dropdown = $(".language-switcher__drop-down", $el);

        $selectButton.click(function (event) {
          event.stopPropagation();
          $dropdown.show();
          $selectMenu.attr("aria-expanded", "true");
          $selectMenu.addClass("is-expanded");
        });

        $("body, .language-switcher__select-menu").click(function () {
          $dropdown.hide();
          $selectMenu.attr("aria-expanded", "false");
          $selectMenu.removeClass("is-expanded");
        });
      });

      const browserLanguage = navigator.language || navigator.userLanguage;
      const browserLanguageCode = browserLanguage.substr(0, 2);

      // Check if the 'modal-language-detection' div element and cookie are not set
      const modalElement = document.getElementById('modal-language-detection');
      const hasLanguage = $("#modal-language-detection").hasClass("lang-" + browserLanguageCode);
      const isEnglish = $("#modal-language-detection").hasClass("en");

      if (modalElement && isEnglish && hasLanguage && !getCookie('modal-lang-detection')) {

        $(".btn-lang-all").hide();
        $(".btn-lang-" + browserLanguageCode).show();

        // Show the corresponding language button based on the browser language code
        MicroModal.show('modal-language-detection', {
          disableFocus: true,
          closeTrigger: 'data-micromodal-close',
          onClose: () => {
            setLangCookie();
          }
        });
        $(".btn-lang-all").click(function() {
          setLangCookie();
        })
      }

    }
  }

})(jQuery, Drupal);
