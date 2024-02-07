(function ($, Drupal) {
  Drupal.behaviors.customScript = {
    attach: function (context, settings) {
      function scrollToElement() {
        document.getElementById("form-50-50").scrollIntoView({ behavior: 'smooth' });
      }

      let formLabelsRequired = $('.js-form-required');

      formLabelsRequired.each(function () {
        let label = $(this).text();

        if (label.slice(-1) === '*') {
         $(this).html(label.slice(0, -1) + '<span class="required" style="color:red">*</span>');
        }
      });

      var windowWidth = $(window).width();

      if (windowWidth < 768) {
        $('#cloud-vision-image').attr('src', '/resources/images/Cloudvision_Mobile.svg');
      } else {
        $('#cloud-vision-image').attr('src', '/resource/images/Cloudvision_DesktopTablet.svg');
      }


      $(window).resize(function () {
        windowWidth = $(window).width();

        if (windowWidth < 768) {
          $('#cloud-vision-image').attr('src', '/resources/images/Cloudvision_Mobile.svg');
        } else {
          $('#cloud-vision-image').attr('src', '/resources/images/Cloudvision_DesktopTablet.svg');
        }
      });
    }
  };
})(jQuery, Drupal);
