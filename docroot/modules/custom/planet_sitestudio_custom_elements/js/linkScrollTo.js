(function ($, Drupal) {
  Drupal.behaviors.linkScrollTo = {
    attach: function (context, settings) {
      $('a.coh-js-scroll-to', context).on('click', (e) => {
        e.preventDefault();
        const targetSelector = $(e.currentTarget).attr('data-coh-scroll-to');
        const target = $(targetSelector);
        const targetOffset = target.offset().top;

        // Create new Intersection Observer with threshold set to 0.
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              $('html, body').animate({
                scrollTop: targetOffset
              }, {
                duration: 600,
                easing: 'linear',
                step: (now, fx) => {
                  window.requestAnimationFrame(() => {
                    const newOffset = target.offset().top;
                    if (fx.end !== newOffset) fx.end = newOffset;
                  });
                },
                passive: true
              });
            }
          });
        }, { threshold: 0 });

        // Observe the target element.
        observer.observe(target.get(0));
      });
    }
  };
})(jQuery, Drupal);
