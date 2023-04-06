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
                var slider_direction, slide_endpoint, timing;

                const iteration = Infinity;
                const window_width = window.innerWidth;

                if (alreadyRun === 0) {
                    slides.forEach(slide => {

                        // Check if it is set to work in mobile, and/or in desktop.
                        if (!(slide.dataset.desktop == "1" || slide.dataset.mobile == "1")) {
                            return;
                        }

                        // To work on desktop.
                        if (slide.dataset.desktop != "1" && window_width >= 1024) {
                            return;
                        }

                        // To work on mobile.
                        if (slide.dataset.mobile != "1" && window_width < 1024) {
                            return;
                        }

                        if (slide.dataset.speed != "" && slide.dataset.direction != "") {
                            // In the component we have a custom style just for animated class.
                            slide.parentNode.classList.add("animated");
                            slide.classList.add("animated");

                            /**
                             * Multiplicate the content, makes the animation smother,
                             * and helps in case of feel content (you can't loop only 3 cards).
                             */
                            slide.innerHTML = slide.innerHTML + slide.innerHTML + slide.innerHTML + slide.innerHTML;

                            // Set's the point where the animation will end.
                            slide_endpoint = (62 + slide.offsetWidth / 2) + "px";

                            // Getting the speed of the animation.
                            if (slide.dataset.speed == "slow") {
                                timing = {
                                    duration: 360000,
                                    iterations: iteration,
                                };
                            }

                            if (slide.dataset.speed == "medium") {
                                timing = {
                                    duration: 260000,
                                    iterations: iteration,
                                };
                            }

                            if (slide.dataset.speed == "fast") {
                                timing = {
                                    duration: 160000,
                                    iterations: iteration,
                                };
                            }

                            // Getting the direction of the animation.
                            if (slide.dataset.direction == "left") {
                                slider_direction = [
                                    { transform: "translateX(0)" },
                                    { transform: "translateX(-" + slide_endpoint + ")" },
                                ];
                            }

                            if (slide.dataset.direction == "right") {
                                slider_direction = [
                                    { transform: "translateX(-" + slide_endpoint + ")" },
                                    { transform: "translateX(0)" },
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
