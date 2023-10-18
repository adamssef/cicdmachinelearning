(function ($, Drupal) {
    Drupal.behaviors.customScript = {
        attach: function (context, settings) {

            const authorId = $("#load-more-button").data("author-id");
            let offset = 0;
            let limit = 9;

            async function fetch_articles(authorId, limit = 9, offset = 0) {
                try {
                    const response = await fetch('/planet_core/author_articles/' + authorId + "/" + limit + "/" + offset);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    return data; // Access the 'articles' property of the JSON object.
                } catch (error) {
                    console.error('Error loading more articles:', error);
                    throw error; // Rethrow the error to handle it outside this function if necessary.
                }
            }

            $(document).ready(async function () {
                try {
                    let data = await fetch_articles(authorId, limit, offset);
                    render_articles(data);
                    limit = limit + 3;
                } catch (error) {
                    // Handle errors here, if necessary.
                    console.error('Error:', error);
                }
            });


            $('#load-more-button').click(async function () {
                try {
                    let data = await fetch_articles(authorId, limit, offset);
                    render_articles(data);
                    limit = limit + 3;
                } catch (error) {
                    // Handle errors here, if necessary.
                    console.error('Error:', error);
                }
            });
            

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

            $(document).on("click", ".main-pill[data-tagid]", function(){
                $(".main-pill").removeClass('selected');
                $(this).addClass('selected');
                filterByTagId($(this).data('tagid'))
              });

            $(document).on("click", ".article-tags span[data-tagid]", function(){
                var tagId = $(this).data('tagid');
                filterByTagId(tagId);
                $(".main-pill").removeClass('selected');
                // $(".main-pills .main-pill:not(.all-pill)").removeClass("visible");
                $(".main-pills .main-pill[data-tagid=" + tagId + "]").addClass(["selected"]);
            });

            function render_no_articles() {
                $(".no-articles").show();
            }

            function render_tags(tags) {
                if (tags) {
                    $(".external-main-tags").empty();
                    tags.forEach(function (tag) {
                        $(".external-main-tags").append("<span class='main-pill visible' data-tagid='" + tag.id + "'>" + tag.name + "</span>");
                    });
                    $(".main-pills, .tags-pills").show();
                }
            }

            function render_articles(data) {

                let articles = data.articles;
                let author = data.author;
                let tags = data.tags;

                if (!articles) {
                    render_no_articles();
                    return;
                }

                $(".article-js-wrapper").empty();
                if(data.articles_finished == false) {
                    $("#load-more-button").show();
                } else {
                    $("#load-more-button").hide();
                }

                render_tags(tags);

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
                $(".article-js-wrapper").append(articleCardTemplate);
            }
        }
    };
})(jQuery, Drupal);
