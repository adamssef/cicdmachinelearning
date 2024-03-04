(function ($, Drupal) {
    Drupal.behaviors.customScript = {
        attach: function (context, settings) {

            let offset = 0;
            let limit = 9;
            let isTagFiltered = false;
            const lang = $('html')[0].lang;

            async function fetch_articles(limit = 9, offset = 0, lang = "en") {


                try {
                    const response = await fetch('/planet_core/news_articles/' + limit + "/" + offset + "/" + lang);
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
                    let data = await fetch_articles(limit, offset, lang);
                    render_articles(data);
                    limit = limit + 3;
                } catch (error) {
                    // Handle errors here, if necessary.
                    console.error('Error:', error);
                }

                const urlParams = new URLSearchParams(window.location.search);
                const tagParam = urlParams.get('tag');
        
                if (tagParam && !isTagFiltered) {
                    // Find the tag with the matching data-tagid value
                    filterByTagId(tagParam);
                    isTagFiltered = true;
                }
            });


            $('#load-more-button').click(async function () {
                try {
                    limit = limit + 9;
                    let data = await fetch_articles(limit, offset, lang);
                    render_articles(data);
                } catch (error) {
                    // Handle errors here, if necessary.
                    console.error('Error:', error);
                }
            });


            function filterByTagId(tagid) {
                $(".main-pill").removeClass('selected');
                $(".main-pill[data-tagid=" + tagid + "]").addClass('selected');
            
                $('.article-wrapper').hide();
            
                if (tagid == "all") {
                    $('.article-wrapper').show();
                } else {
                    $('.article-wrapper').each(function () {
                        var columnTags = $(this).data('tagid'); // Get the data-tagid array

                        if (columnTags.includes(parseInt(tagid))) {
                            $(this).show();
                        }
                    });
                }
            }

            $(document).on("click", ".main-pill[data-tagid]", function () {
                filterByTagId($(this).data('tagid'))
            });

            $(document).on("click", ".article-tags span[data-tagid]", function () {
                var tagId = $(this).data('tagid');
                filterByTagId(tagId);
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
                let tags = data.tags;

                if (!articles) {
                    render_no_articles();
                    return;
                }

                $(".article-js-wrapper").empty();
                if (data.articles_finished == false) {
                    $("#load-more-button").show();
                } else {
                    $("#load-more-button").hide();
                }

                render_tags(tags);

                articles.forEach(function (article) {
                    render_article_card(article);
                });
            }

            function render_article_card(article) {
                const articleCardTemplate = `
                    <div data-tagid="[${article.tags.map(tag => tag.id).join(', ')}]" class="news-box-wrapper article-wrapper coh-column coh-visible-sm coh-col-sm-6 coh-col-xs-12 coh-visible-xl coh-col-xl-4 coh-col-lg-4 coh-col-md-6">
                    <div class="article-card news-card">
                        <div class="article-bg-image-wrapper">
                        <div class="article-bg-image" style="background-image:url(${article.background_image})"></div>
                        </div>
                        <div class="article-card-content">
                        <div>
                        <div class="article-tags tags-pills">
                        ${article.tags.map(tag => `<span data-tagid="${tag.id}">${tag.name}</span>`).join('')}
                        </div>
                        <div class="article-title">
                            <a href="${article.url}">${article.title}</a>
                        </div>
                        <div class="tags-and-author">
                            <div class="article-author-and-date">
                            <div class="article-date">${article.creation_date}</div>
                            </div>
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
