(function ($, Drupal) {
  Drupal.behaviors.customScript = {
    attach: function (context, settings) {
      let formLabelsRequired = $('.js-form-required');

      formLabelsRequired.each(function () {
        let label = $(this).text();

        if (label.slice(-1) === '*') {
         $(this).html(label.slice(0, -1) + '<span class="required" style="color:red">*</span>');
        }
      });
    }
  };
})(jQuery, Drupal);
