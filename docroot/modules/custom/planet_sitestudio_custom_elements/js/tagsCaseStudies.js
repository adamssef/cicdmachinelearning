/**
 * @file
 * File tagsCaseStudies.js.
 */

(function ($) {
  document.addEventListener("DOMContentLoaded", (event) => {
    const text = $(".tags-container .coh-blockquote").text();
    const tags = text.split(", ");

    $(".tags-container .coh-blockquote").css("display", "none");

    tags.map((tag) => {
      var tagElement = document.createElement("div");
      tagElement.innerHTML = tag;
      tagElement.classList.add("tag-item");
      document.querySelector(".tags-container").appendChild(tagElement);
    })
  });
})(jQuery);