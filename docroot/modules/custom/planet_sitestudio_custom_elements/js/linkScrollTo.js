(function ($, Drupal) {
  Drupal.behaviors.linkScrollTo = {
    attach: function () {
      $('a.coh-js-scroll-to').on('click', (e) => {
        const targetSelector = $(e.currentTarget).attr('data-coh-scroll-to');
        const target = $(targetSelector);
        const targetOffset = target.offset().top;

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
      });
    }
  };
})(jQuery, Drupal);
