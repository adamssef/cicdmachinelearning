/**
 * @file
 * File notificationBar.js.
 */

 (function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_tabProductsPanel = {
    attach: function () {
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
      })
    }
  };
  })(jQuery, Drupal);