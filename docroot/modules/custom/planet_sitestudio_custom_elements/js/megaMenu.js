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
          $(".menu-li-active").children("a").click();
        })
      });
    }
  };
})(jQuery, Drupal);
