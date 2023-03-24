/**
 * @file
 * File brandsWeWorkWithAnimation.js.
 */


(function ($, Drupal) {
    Drupal.planet = Drupal.planet || {};

    Drupal.behaviors.planet_sitestudio_brandsWeWorkWithAnimation = {
        attach: function () {
            let slideStrackDiv = $('.slide-track');

            slideStrackDiv.once('slide-track-action').each(function () {
                let slider_direction, slide_endpoint, timing;
                const iteration = Infinity;

                if (this.dataset.enabled == "1"
                    && this.dataset.speed != ""
                    && this.dataset.direction != "") {

                    // In the component we have a custom style just for animated class.
                    this.parentNode.classList.add("animated");
                    this.classList.add("animated");

                    /**
                     * Multiplicate the content, makes the animation smother,
                     * and helps in case of feel content (you can't loop only 3 cards).
                     */
                    this.innerHTML = this.innerHTML + this.innerHTML + this.innerHTML + this.innerHTML + this.innerHTML;

                    // Set's the point where the animation will end.
                    slide_endpoint = (62 + this.offsetWidth / 2) + "px";

                    // Getting the speed of the animation.
                    if (this.dataset.speed == "slow") {
                        timing = {
                            duration: 45000,
                            iterations: iteration,
                        };
                    }

                    if (this.dataset.speed == "medium") {
                        timing = {
                            duration: 35000,
                            iterations: iteration,
                        };
                    }

                    if (this.dataset.speed == "fast") {
                        timing = {
                            duration: 25000,
                            iterations: iteration,
                        };
                    }

                    // Getting the direction of the animation.
                    if (this.dataset.direction == "left") {
                        slider_direction = [
                            { transform: "translateX(0)" },
                            { transform: "translateX(-" + slide_endpoint + ")" },
                        ];
                    }

                    if (this.dataset.direction == "right") {
                        slider_direction = [
                            { transform: "translateX(-" + slide_endpoint + ")" },
                            { transform: "translateX(0)" },
                        ];
                    }

                    // Plays the animation.
                    this.animate(slider_direction, timing);
                }
            });
        }
    };
})(jQuery, Drupal);
