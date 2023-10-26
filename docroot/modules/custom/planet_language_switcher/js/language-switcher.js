
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

            // Check if the 'modal-language-detection' div element and cookie are not set
            const modalElement = document.getElementById('modal-language-detection');
            if (modalElement && !getCookie('modal-lang-detection')) {
                // Run initialization code
                // MicroModal.init({
                //     disableFocus: true
                // });
                MicroModal.show('modal-language-detection', {
                    disableFocus: true,
                    closeTrigger: 'data-micromodal-close',
                    onClose: () => {
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
                });
            }

        }
    }

})(jQuery, Drupal);