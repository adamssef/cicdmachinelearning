/**
 * @file
 * File formFlagIcon.js.
 */

(function ($) {
  document.addEventListener("DOMContentLoaded", (event) => {
    function errorClasses(className) {
      return className == "error" || className == "valid";
    }

    function callback(mutationsList) {
      mutationsList.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          // Getting all classes from "Phone Number" (field)
          let classesNames = mutation.target.classList;

          // Filtering error classes
          let errors = [... classesNames].filter(errorClasses);

          // Valid error (when the user has not filled in the entire field)
          if (errors.length == 2) {
            $('.js-form-type-webform-telephone .iti__selected-flag').css("bottom", "4px");
          } 
          // Error (when trying to submit the form with an empty phone field)
          else if (errors[0] == "error") {
            $('.js-form-type-webform-telephone .iti__selected-flag').css("bottom", "11px");
          } 
          // None of the cases
          else {
            $('.js-form-type-webform-telephone .iti__selected-flag').css("bottom", "1px");
          }
        }
      })
    }

    const mutationObserver = new MutationObserver(callback)

    mutationObserver.observe(
      document.getElementById('edit-phone-intl-phone'), {
        attributes: true
      }
    )
  });
})(jQuery);
