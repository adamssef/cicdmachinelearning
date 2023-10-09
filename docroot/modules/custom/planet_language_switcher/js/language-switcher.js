
/**
 * @file
 * Dropdown language switcher JS.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.languageSwitcher = {
    attach: function (context, settings) {

      $('#load-more-button').click(function () {
        const authorId = $(this).data("author-id");

        // Make an asynchronous request to load more articles.
        fetch('/planet_language_switcher/author_articles/' + authorId)
          .then(function (response) {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(function (data) {
            // Handle the JSON data received from the server.
            render_articles(data); // Access the 'articles' property of the JSON object.
          })
          .catch(function (error) {
            console.error('Error loading more articles:', error);
          });



        $('#block-language-switcher', context).once('block-language-switcher').each(function () {
          let $el = $(this);
          let $selectMenu = $(".language-switcher__select-menu", $el);
          let $selectButton = $(".language-switcher__button", $el);
          let $dropdown = $(".language-switcher__drop-down", $el)

          $selectButton.click(function (event) {
            event.stopPropagation();

            $dropdown.show();

            $selectMenu.attr("aria-expanded", "true");
            $selectMenu.addClass("is-expanded");
          });

          $("body, .language-switcher__select-menu").click(function () {
            $dropdown.hide();
            $selectMenu.attr("aria-expanded", "false");
            $selectMenu.removeClass("is-expanded");
          });
        });

      });

    }
  }
  function filterByTagId(tagid) {
    $('.article-wrapper').hide();

    if (tagid == "all") {
      $('.article-wrapper').show();
    } else {
      $('.article-wrapper').each(function () {
        var columnTags = $(this).data('tagid'); // Get the data-tagid array
        if ($.inArray(tagid, columnTags) !== -1) {
          $(this).show();
        }
      });
    }
  }

  // Click on main tag pills
  $(".main-pill[data-tagid]").click(function () {
    if ($(this).data('tagid') == "all") {
      $(".main-pills .main-pill").addClass("visible");
    }
    $(".main-pill").removeClass('selected');
    $(this).addClass('selected');
    filterByTagId($(this).data('tagid'))
  });

  // Click on tag pills within the article
  $(".article-tags span[data-tagid]").click(function () {
    var tagId = $(this).data('tagid');
    filterByTagId(tagId);
    $(".main-pill").removeClass('selected');
    $(".main-pills .main-pill:not(.all-pill)").removeClass("visible");
    $(".main-pills .main-pill[data-tagid=" + tagId + "]").addClass(["visible", "selected"]);
  });

  function render_articles(data) {

    let articles = data.articles;
    let author = data.author;
    
    articles.forEach(function (article) {
      render_article_card(article, author);
    });
  }

  function render_article_card(article, author) {
    const articleCardTemplate = `
    <div data-tagid="[${article.tags.map(tag => tag.id).join(', ')}]" class="article-wrapper coh-column coh-visible-sm coh-col-sm-12 coh-visible-xl coh-col-xl-4">
      <div class="article-card">
        <div class="article-bg-image-wrapper">
          <div class="article-bg-image" style="background-image:url(${article.background_image})"></div>
        </div>
        <div class="article-card-content">
          <div class="article-title">
            <a href="${article.url}">${article.title}</a>
          </div>
          <div class="tags-and-author">
            <div class="article-tags tags-pills">
              ${article.tags.map(tag => `<span data-tagid="${tag.id}">${tag.name}</span>`).join('')}
            </div>
            <div class="article-author-and-date">
              <div class="article-author">
                <div class="author-photo" style="background-image:url(${author.profile_picture})"></div>
                <div class="author-name"><span>${author.full_name}</span></div>
              </div>
              <div class="vertical-divider">|</div>
              <div class="article-date">${article.creation_date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    $(".article-cards-wrapper .coh-row-inner").append(articleCardTemplate);
  }

})(jQuery, Drupal);