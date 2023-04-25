/**
 * @file
 * File fullCaseStudyPage.js.
 */

(function ($, Drupal) {
  Drupal.behaviors.planet_sitestudio_fullCaseStudyPage = {
    attach: function () {
      $(document).ready(function () {

        var tags = $(".tags-container .coh-blockquote");
        var sections = $(".reading-section");

        // Remove the comma and link from the taxonomy tags.
        tags.html(tags.first().html().replaceAll(", ", ""));
        tags.html(tags.first().find("a").removeAttr("href"));

        //Adds Read More button and truncate the reading sections.
        sections.once("reading-sections-sorted").each(function() {

          const readMoreButton = '<button class="coh-style-t100 read-more-button">Read More...</button>';

          let elem = $(this);
          // Sets the cut part from the first <br> tag.
          let slicedLength = elem.html().split("<br>")[0].length;

          if (elem.html().length > slicedLength) {
            let firstSection, readMoreSection;

            firstSection = elem.html().substring(0, slicedLength);
            // Select the second and hidden part for the text.
            readMoreSection = `<span class="read-more-part">${elem.html().substring(slicedLength)}</span>`;

            // Sorts the text to add the button and the hidden part.
            elem.html(
              firstSection
              + readMoreSection
              + readMoreButton
            );

            // Removes the button it self and the hidden from text.
            elem.children(".read-more-button").on("click", function() {
              elem.children(".read-more-part").css("display", "inline");
              $(this).remove();
            });
          }

        });

      });
    }
  }
})(jQuery, Drupal);
