/**
 * @file
 * Brands We Work With Script.
 */

(function (Drupal, once) {
  Drupal.behaviors.brandsWeWorkWithScript = {
    attach: function (context, settings) {
      // Select elements with the class 'brands-we-work-with-container' that have not been processed yet.
      const elements = once('brandsWeWorkWithSolo', '.brands-we-work-with-container', context);

      elements.forEach(function (element) {
        const totalWidth = element.scrollWidth;
        const speed = 0.2;
        const logoWidth = element.children[0].offsetWidth;
        const resetThreshold = logoWidth * 10;

        function animate() {
          Array.from(element.children).forEach(function (child) {
            const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(child).transform).m41;
            let newX = currentTransform - speed;

            if (Math.abs(newX) >= totalWidth - resetThreshold) {
              newX = 0; // Reset position back to the beginning.
            }

            child.style.transform = `translateX(${newX}px)`;
          });

          requestAnimationFrame(animate);
        }

        animate();
      });
    }
  };
})(Drupal, once);
