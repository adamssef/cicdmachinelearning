/**
 * @file
 * File customMainScript.js.
 */

(function ($, cookies, Drupal) {
  Drupal.behaviors.planet_sitestudio_customMainScript = {
    attach: function () {
      $(document).ready(function () {
        // setInterval(function () {

        // }, 1000);
        jQuery(document).on('keypress',function(e) {
          if(e.which == 13) {
            if(jQuery('.search-wrap').find('input').val()){
              jQuery('#custom-search-resource').click();
            }
          }
        });
        jQuery('#custom-search-resource').on('click', function(){
          jQuery('.search-result-head').remove();
          var keyword = jQuery(this).parent().find('input').val();
          jQuery('#views-exposed-form-planet-resources-block-1 input[name="combine"]').delay(1000 ).attr('keyword', keyword).val(keyword);
          jQuery("<div class='search-result-head'><h3>Search results for: "+keyword+"</h3></div>").insertBefore("#block-views-block-planet-resources-block-1");
          jQuery('#views-exposed-form-planet-resources-block-1 .form-submit').delay(1000 ).click();
          // if(jQuery('#views-exposed-form-planet-resources-block-1 .cards-grid').text().length == 0) {
          //   var message = '<p>Sorry, we couldnt find any matches for your search. Feel free to reach out to our support team for assistance!</p>';
          //   jQuery(".search-result-head").append(message);
          // }else{
          //   jQuery(".search-result-head").remove();
          // }
        });
        // show more/less for product listing in product detailing + overview page

        jQuery('.item-list-products ul').each(function(){
          var liLength = jQuery(this).find('li').length;
          var toggleMore = jQuery(this).find('.toggle-more').length;
          if(liLength > 7 && !toggleMore){
            jQuery('li', this).eq(6).nextAll().hide().addClass('toggleable');
            jQuery(this).append('<li class="toggle-more more"><img src="/modules/custom/planet_sitestudio_custom_elements/images/arrow-down.png"><span>See more</span></li>');
          }
        });

        jQuery('.item-list-products ul').on('click','.more', function(){
          if(jQuery(this).find('span').hasClass('less') ){
            jQuery(this).find('span').text('See more').removeClass('less');
          }else{
            jQuery(this).find('span').text('See less').addClass('less');
          }
          jQuery(this).siblings('li.toggleable').slideToggle();
        });
        
        jQuery('.btn-wrap .btn-row').each(function(index, value){
          jQuery(this).find('a').addClass('index-'+index);
            if(jQuery(this).find('a').attr('href').length == 0){
            jQuery(this).parent().remove();
          }
        });

        // Ajax call from left sidebar categories for resources listing page
        jQuery('.planet-cat-filter li a').click(function(e){
          var target = jQuery(this).attr('data');
          jQuery('.planet-cat-filter li a').removeClass('active');
          // var target = target.replace('resource-target-', '');
          if(target == 'all'){
            jQuery('select[name="field_resource_category_target_id"]').val('All');
            jQuery(this).addClass('active');
            jQuery('.search-result-head').html('');
            jQuery('.search-wrap').find('input').val('');
            jQuery('#views-exposed-form-planet-resources-block-1 input[name="combine"]').val('');
          }else{
            jQuery('select[name="field_resource_category_target_id"]').val(target);
            jQuery(this).addClass('active');
          }
          jQuery('select[name="field_resource_category_target_id"]').val(target);
          jQuery('#views-exposed-form-planet-resources-block-1 .form-submit').click();
          e.preventDefault();
        });

        if(jQuery('.technical-doc-wrap').find('div').length < 1){
          jQuery('.technical-doc-wrap').find('h4').hide();
        }
        if(jQuery('.training-path-wrap').find('div').length < 1){
          jQuery('.training-path-wrap').find('h4').hide();
        }
        // document.getElementById("search-icon").onclick = function() {searchResource()};
        // function searchResource() {
          var userLang = navigator.language || navigator.userLanguage;
          console.log ("userLang language is: " + userLang);
          var siteLang = document.documentElement.lang;
          console.log ("Site language is: " + siteLang);
          // Get cookies for do not show again option and show only once.
          var hide_modal_cookie = cookies.get('hide_modal_id_homepage_language_modal');
          // Verify don't show again and show only once options.

          if( (userLang == 'en-US' || userLang == 'es' || userLang == 'fr' || userLang == 'it' || userLang == 'de' ) && (siteLang == 'en' || siteLang == 'es' || siteLang == 'fr' || siteLang == 'it' || siteLang == 'de' ) ){
            if (hide_modal_cookie) {
              return;
            }else{
              if (siteLang == 'en' && userLang == 'en-US'){
                // console.log('off modal');
              }else{
                jQuery('#js-modal-page-show-modal').modal('show');
              }
            }

          }

          jQuery('#js-modal-page-show-modal .modal-buttons').on('click', function(){
            jQuery('#js-modal-page-show-modal').modal('hide');
          });
          jQuery('#js-modal-page-show-modal').on('hide.bs.modal', function () {
            cookies.set('hide_modal_id_hide_modal_id_homepage_language_modal', true, { expires: 365 * 20, path: '/' });
          });

          var userLangbutton = '';
          var url = window.location.origin;
          if(userLang == 'es' || userLang == 'fr' || userLang == 'it' || userLang == 'de' ){
            const languageName = new Intl.DisplayNames([userLang], {
              type: 'language'
            });
            var LangName = languageName.of(userLang);
            var userLangbutton = '<a class="btn-black lang-'+userLang+'" href="'+url+'/'+userLang+'">Switch to '+LangName+'</a>';
            // var userLangbutton = '<a href="'+url+'/'+userLang+'">'+userLang+'</a>';
          }
          jQuery('.homepage-language-modal').find('.modal-body').find('.lang-btn-wrap').html(userLangbutton+'<a class="default_language_sel btn" href="'+url+'">Stay In English</a>');

          jQuery(document).on('click', '.default_language_sel', function(e){
            var siteLang = document.documentElement.lang;
            jQuery('.homepage-language-modal').find('.js-modal-page-ok-button').click();
            if(siteLang == 'en'){
              jQuery('.modal-buttons').trigger('click');
              e.preventDefault();
            }else{
              window.location.replace(window.location.origin);
            }
          });




      });
    },
  };
})(jQuery, window.Cookies, Drupal);
