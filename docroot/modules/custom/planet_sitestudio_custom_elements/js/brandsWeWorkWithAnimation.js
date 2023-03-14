/**
 * @file
 * File brandsWeWorkWithAnimation.js.
 */


(function ($, Drupal) {
    Drupal.behaviors.planet_sitestudio_brandsWeWorkWithAnimation = {
        attach: function () {
            $(document).ready(function () {
                let alreadyRun = 0;

                var slides = document.querySelectorAll(".slide-track");
                var slider_direction, timing;

                const iteration = Infinity;

                if (alreadyRun === 0) {
                    slides.forEach(slide => {
                        if (slide.dataset.enabled == "1"
                            && slide.dataset.speed != ""
                            && slide.dataset.direction != "") {

                            // In the component we have a custom style just for animated class.
                            slide.parentNode.classList.add("animated");
                            slide.classList.add("animated");;
                            //
                            /**
                             * Multiplicate the content, makes the animation smother,
                             * and helps in case of feel content (you can't loop only 3 cards).
                             */
                            slide.innerHTML += slide.innerHTML;

                            // Getting the speed of the animation.
                            if (slide.dataset.speed == "slow") {
                                timing = {
                                    duration: 300000,
                                    iterations: iteration,
                                };
                            }

                            if (slide.dataset.speed == "medium") {
                                timing = {
                                    duration: 180000,
                                    iterations: iteration,
                                };
                            }

                            if (slide.dataset.speed == "fast") {
                                timing = {
                                    duration: 100000,
                                    iterations: iteration,
                                };
                            }

                            // Getting the direction of the animation.
                            if (slide.dataset.direction == "right") {
                                slider_direction = [
                                    { transform: "translateX(-15%)" },
                                    { transform: "translateX(-60%)" },
                                ];
                            }

                            if (slide.dataset.direction == "left") {
                                slider_direction = [
                                    { transform: "translateX(-60%)" },
                                    { transform: "translateX(-15%)" },
                                ];
                            }

                            // Plays the animation.
                            slide.animate(slider_direction, timing);

                        }
                    });
                }

                alreadyRun = 1;
            });
        }
    };
})(jQuery, Drupal);
