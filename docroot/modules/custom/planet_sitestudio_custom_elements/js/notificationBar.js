/**
 * @file
 * File notificationBar.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_tabProductsPanel = {
    attach: function () {
      $(document).ready(function () {
        let navBarButton = $('.notification-bar-button');

        if (getCookie('Drupal.visitor.notification_bar_container') != '1') {
          $('.notification-bar-container').addClass('notification-shown');
        }

        navBarButton.click(function () {
          createCookie('Drupal.visitor.notification_bar_container', 1, 1);
          $('.notification-bar-container').removeClass('notification-shown');

        });
      });
    }
  };

  function createCookie(name, value, days) {
    let expires = '';
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

})(jQuery, Drupal);
