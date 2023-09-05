/**
 * @file
 * File customMainScript.js.
 */

(function ($, cookies, Drupal) {
  Drupal.behaviors.planet_sitestudio_customMainScript = {
    attach: function () {
      $(document).ready(function () {

        // document.getElementById("search-icon").onclick = function() {searchResource()};
        // function searchResource() {
          var userLang = navigator.language || navigator.userLanguage; 
          console.log ("The language is: " + userLang);
          var siteLang = document.documentElement.lang;
          console.log ("Site language is: " + siteLang);
          // Get cookies for do not show again option and show only once.
          var hide_modal_cookie = cookies.get('hide_modal_id_homepage_language_modal');
          // Verify don't show again and show only once options.
          
          if( (userLang == 'en-US' || userLang == 'es' || userLang == 'fr' || userLang == 'it' || userLang == 'de' ) && (siteLang == 'en' || siteLang == 'es' || siteLang == 'fr' || siteLang == 'it' || siteLang == 'de' ) ){
            if (hide_modal_cookie) {
              return;
            }else{
              jQuery('#js-modal-page-show-modal').modal('show');
            }
            
          }
          
          jQuery('#js-modal-page-show-modal').on('hide.bs.modal', function () {
            console.log('tesing');
            cookies.set('hide_modal_id_hide_modal_id_homepage_language_modal', true, { expires: 365 * 20, path: '/' });
          });
          
          var userLangbutton = '';
          var url = window.location.origin;
          if(userLang == 'es' || userLang == 'fr' || userLang == 'it' || userLang == 'de' ){
            var userLangbutton = '<a href="'+url+'/'+userLang+'">'+userLang+'</a>';
          }
          jQuery('.homepage-language-modal').find('.modal-body').find('.lang-btn-wrap').html(userLangbutton+'<a class="default_language_sel btn" href="'+url+'">Stay In English</a>');

          jQuery(document).on('click', '.default_language_sel', function(e){
            var siteLang = document.documentElement.lang;
            jQuery('.homepage-language-modal').find('.js-modal-page-ok-button').click();
            if(siteLang == 'en'){
              e.preventDefault();
            }else{
              window.location.replace(window.location.origin);
            }
          });

          

          
      });
    },
  };
})(jQuery, window.Cookies, Drupal);
