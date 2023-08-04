/**
 * @file
 * File megaMenu.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_megaMenu = {
    attach: function () {
      $(document).ready(function () {
        $(".coh-paragraph-items").html(function(index, html) {
          return html.replace(",", "");
        });
        $(".menu-level-1-li").click(function(){
          $(".menu-level-1-li").removeClass("menu-li-active");
          if($(this).hasClass("is-expanded")){
            $(this).addClass("menu-li-active");
          }
        })
        $(".coh-button-back").click(function(){
          $(".menu-level-1-ul > li").removeClass("is-expanded");
        })
        $(".coh-button-close").click(function(){
          $(".coh-button-back").click();
          $(".mobile-menu-button, .header-container, .menu-container").removeClass("menu-visible");
          $("body").css("overflow","");
        })
        $(".menu-level-1-li").hover(function(){
          $("body").css("overflow-y","scroll");
        }, function() {
          $("body").css("position","relative"); 
        })
        $(".right-side-mega-menu__link div div").each(function(){
          $(this).attr('tabindex', '0');
        });
      });
    }
  };
})(jQuery, Drupal);
