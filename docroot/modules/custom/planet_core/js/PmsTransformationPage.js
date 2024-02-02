(function ($, Drupal) {
  Drupal.behaviors.customScript = {
    attach: function (context, settings) {
      var windowWidth = $(window).width();

      if (windowWidth < 768) {
        $('#cloud-vision-image').attr('src', '/sites/default/files/2024-02/Cloudvision_Mobile.svg');
      } else {
        $('#cloud-vision-image').attr('src', '/sites/default/files/2024-02/Cloudvision_DesktopTablet.svg');
      }


      $(window).resize(function () {
        windowWidth = $(window).width();

        if (windowWidth < 768) {
          $('#cloud-vision-image').attr('src', '/sites/default/files/2024-02/Cloudvision_Mobile.svg');
        } else {
          $('#cloud-vision-image').attr('src', '/sites/default/files/2024-02/Cloudvision_DesktopTablet.svg');
        }
      });
    }
  };
})(jQuery, Drupal);
