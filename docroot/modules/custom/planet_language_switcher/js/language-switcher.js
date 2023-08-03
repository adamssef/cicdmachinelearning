
/**
 * @file
 * Dropdown language switcher JS.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.languageSwitcher = {
    attach: function (context, settings) {
      $('#block-language-switcher', context).once('block-language-switcher').each(function () {
        let $el = $(this);
        let $selectMenu = $(".language-switcher__select-menu", $el);
        let $selectButton = $(".language-switcher__button", $el);
        let $dropdown = $(".language-switcher__drop-down", $el)

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
    }
  };

})(jQuery, Drupal);