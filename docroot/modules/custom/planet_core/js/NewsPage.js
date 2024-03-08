(function ($, Drupal) {
    Drupal.behaviors.customScript = {
        attach: function (context, settings) {

            let offset = 0;
            let limit = 9;
            let isTagFiltered = false;
            const lang = $('html')[0].lang;

            async function fetch_articles(limit = 9, offset = 0, lang = "en", category = false, year = false) {
                $(".article-js-wrapper").empty();
                $(".loader").show();
                try {
                    const url = new URL(`/planet_core/news_articles/${limit}/${offset}/${lang}`, window.location.origin);
                    // Add optional query parameters if provided
                    if (category) {
                        url.searchParams.append('category', category);
                    }
                    if (year) {
                        url.searchParams.append('year', year);
                    }
                    // Fetch data using the built URL
                    const response = await fetch(url);
                    
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

            $('.planet-news-select-years > .select-items > div').on('click', async function() {
                const val = $(this).attr("data-value");
                const category = $('.planet-news-select-category > .select-items > div.selected').attr("data-value");
                let data = await fetch_articles(limit, offset, lang, category, val);
                render_articles(data);
            });
            $('.planet-news-select-category > .select-items > div').on('click', async function() {
                const val = $(this).attr("data-value");
                const year = $('.planet-news-select-years > .select-items > div.selected').attr("data-value");
                let data = await fetch_articles(limit, offset, lang, val, year);
                render_articles(data);
            });

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

            function render_no_articles() {
                $(".loader").hide();
                $(".article-js-wrapper").empty();
                $(".no-articles").show();
            }

            function render_articles(data) {

                let articles = data.articles;
                if (!articles.length) {
                    render_no_articles();
                    return;
                }

                $(".no-articles").hide();
                $(".article-js-wrapper").empty();

                // if (data.articles_count > 9) {
                //     $("#load-more-button").show();

                // }

                if (data.articles_finished == false) {
                    $("#load-more-button").show();
                } else {
                    $("#load-more-button").hide();
                }
                $(".loader").hide();
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


            $(".custom-select").on("click", function() {
                $(this).children(".select-items").toggleClass("select-hide");
            });
            $(".custom-select .select-items > div").on("click", function() {
                let val = $(this).attr("data-value");
                let txt = $(this).text();
                $(this).parent().parent().children(".select-selected").text(txt);
                $(this).parent().children("div").removeClass("selected");
                $(this).addClass("selected");
            })




        }
    };
})(jQuery, Drupal);
