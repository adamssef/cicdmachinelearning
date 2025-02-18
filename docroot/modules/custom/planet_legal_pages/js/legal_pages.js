(function ($, Drupal) {
  Drupal.behaviors.legalPages = {
    attach: function (context) {

      /**
       * Scrolls smoothly to the target element.
       */
      function scrollToTarget(targetElement) {
        if (targetElement) {
          console.log('scroll to target triggered');
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
                behavior: 'smooth',
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
          console.log('click in legal menu')
          const href = element.getAttribute('href');
          const targetId = href.split('#')[1];
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            console.log('target element found')
            event.preventDefault();
            scrollToTarget(targetElement);
          }
        });
      });

      /**
       * Handles anchor link clicks.
       */
      once('legal-menu-sublinks-click', '.child', context).forEach(function (element) {
        element.addEventListener('click', function (event) {
         console.log('click in legal menu sublinks');
          document.querySelectorAll('.child').forEach((el) => {
            el.classList.remove('text-[#4F46E5]');
            el.classList.add('text-black');
            console.log('removing text-[#4F46E5] and adding text-black');
          });
          event.target.classList.remove('text-black');
          event.target.classList.add('text-[#4F46E5]');
          console.log('removing text-black and adding text-[#4F46E5]');
        });
      });

      /**
       * Handles anchor link clicks.
       */
      once('menu-visibility', '#menu-visibility-arrow', context).forEach(function (element) {
        element.addEventListener('click', function (event) {
          document.querySelector('.legal-menu').classList.toggle('hidden');
          document.querySelector('#menu-visibility-arrow').classList.toggle('rotate-180');
        });
      });

      /**
       * Handles anchor link clicks.
       */
      window.addEventListener('resize', function (event) {
        if (window.innerWidth > 1180) {
          document.querySelector('.legal-menu').classList.remove('hidden');
        }
      });

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
    },
  };
})(jQuery, Drupal);
