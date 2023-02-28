/**
 * @file
 * File tagsCaseStudies.js.
 */

(function ($) {
  document.addEventListener("DOMContentLoaded", (event) => {

    var tags = $(".tags-container .coh-blockquote");

    tags.html(tags.first().html().replaceAll(", ", ""));
    tags.html(tags.first().find("a").removeAttr("href"));

  });
})(jQuery);
