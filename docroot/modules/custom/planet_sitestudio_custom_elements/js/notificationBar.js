/**
 * @file
 * File notificationBar.js.
 */

 (function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_tabProductsPanel = {
    attach: function () {
      if (alreadyRun === 0) {
        let position = jQuery(window).scrollTop();
        if ($(window).width() < 1023) {
          $(window).on('load', function() {
            if(position == 0) {
              $('header').addClass('white-bg');
            }
          })
        }
        $('.notification-bar-button').click(function(){
          $('.notification-bar-container').addClass('closed');

          createCookie('Drupal.visitor.notification_bar_container', 1, 1);
        })
        $(document).ready(function () {
          if($('body').find('.notification-bar-container')) {
            if ($(window).width() < 1023) {
              $(".notification-bar-button").click(function(){
                if (!$('header').hasClass('white-bg-fixed')) {
                  $('header').removeClass('white-bg');
                }
              })
            }
            $(window).on('scroll', function(){
              if(position == 0) {
                $('header').addClass('white-bg');
              }
            })
          }

          if (getCookie('Drupal.visitor.notification_bar_container') === '1') {
            $('.notification-bar-button').click();
            return false;
          }

        })

        alreadyRun=1;
      }
    }
  };

  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    }
    else {
      var expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  })(jQuery, Drupal);
