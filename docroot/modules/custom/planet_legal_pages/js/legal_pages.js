(function ($, Drupal) {
  Drupal.behaviors.megaMenu = {
    attach: function (context) {
      /**
       * Scrolls smoothly to the target element.
       */
      function scrollToTarget(targetElement) {
        if (targetElement) {
          requestAnimationFrame(() => {
            const targetRect = targetElement.getBoundingClientRect();
            const scrollOffset = window.scrollY || window.pageYOffset;
            const finalPosition = targetRect.top + scrollOffset;

            const isElementVisible = () => {
              const rect = targetElement.getBoundingClientRect();
              return rect.top >= 0 && rect.bottom <= window.innerHeight;
            };

            if (!isElementVisible()) {
              window.scrollTo({
                top: finalPosition - 100,
                behavior: 'smooth'
              });

              setTimeout(() => {
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
              }, 500);

              window.history.pushState(null, null, `#${targetElement.id}`);
            }
          });
        }
      }

      /**
       * Handles anchor link clicks.
       */
      once('legal-menu-links', '.legal-menu a[href*="#"]', context).forEach(function (element) {
        element.addEventListener('click', function (event) {
          const href = element.getAttribute('href');
          const targetId = href.split('#')[1];
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            event.preventDefault();
            scrollToTarget(targetElement);
          }
        });
      });

      /**
       * Handles page load with hash.
       */
      /**
       * Handles page load with hash.
       */
      /**
       * Handles page load with hash.
       */
      window.addEventListener('load', function () {
        if (window.location.hash) {
          const targetId = window.location.hash.substring(1);
          console.log(window.location.hash.substring(1));
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // Give the browser a moment to settle before adjusting
            setTimeout(() => {
              const targetRect = targetElement.getBoundingClientRect();
              const scrollOffset = window.scrollY || window.pageYOffset;
              const finalPosition = targetRect.top + scrollOffset;

              window.scrollTo({
                top: finalPosition - 200, // Adjust position after browser jump
                behavior: 'smooth',
              });
            }, 10); // Minimal delay to allow default behavior first
          }
        }
      });
;
    },
  };
})(jQuery, Drupal);
