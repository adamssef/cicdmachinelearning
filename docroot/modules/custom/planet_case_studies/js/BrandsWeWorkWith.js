(function ($, Drupal) {
  Drupal.behaviors.brandsWeWorkWithScript = {
    attach: function (context, settings) {
      once('brandsWeWorkWithSolo', '.brands-we-work-with-container', context).forEach(function (element) {
        var container = $(element);
        var totalWidth = container[0].scrollWidth;
        var speed = 0.2;
        var logoWidth = container.children().first().outerWidth(true);
        var resetThreshold = logoWidth * 10;

        function animate() {
          container.children().each(function(index) {
            let currentTransform = new WebKitCSSMatrix(window.getComputedStyle(this).transform).m41;
            let newX = currentTransform - speed;

            if (Math.abs(newX) >= totalWidth - resetThreshold) {
              newX = 0; // Reset position back to the beginning.
            }

            this.style.transform = `translateX(${newX}px)`;
          });

          requestAnimationFrame(animate);
        }

        animate();
      });
    }
  };
})(jQuery, Drupal);
