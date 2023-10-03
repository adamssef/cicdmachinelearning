
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



  var $tagPills = $('span[data-tagid]');
// Tag filtering functionality
$tagPills.click(function() {
  // Remove active class from all tag pills
  $tagPills.removeClass('selected');
  // Add active class to the clicked tag pill
  $(this).addClass('selected');
  
  // Get the selected tag ID
  var selectedTagId = $(this).data('tagid');
  
  // Hide all .article-wrapper elements
  $('.article-wrapper').hide();

  if(selectedTagId == "all") {
    $('.article-wrapper').show();
  } else {
  
  // Show .article-wrapper elements with the selected tag
  $('.article-wrapper').each(function() {
      var columnTags = $(this).data('tagid'); // Get the data-tagid array
      
      // Check if selectedTagId is in the columnTags array
      if ($.inArray(selectedTagId, columnTags) !== -1) {
          $(this).show();
      }
  });
}
});


})(jQuery, Drupal);