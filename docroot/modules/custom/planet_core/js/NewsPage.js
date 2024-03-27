(function ($, Drupal) {
    Drupal.behaviors.customScript = {
        attach: function (context, settings) {

            let offset = 0;
            let limit = 9;
            const lang = $('html')[0].lang;

            async function fetch_articles(limit = 9, offset = 0, lang = "en", category = false, year = false) {
                
                is_loading(true);
                
                try {
                    const url = new URL(`/planet_core/news_articles/${limit}/${offset}/${lang}`, window.location.origin);
                    if (category) {
                        url.searchParams.append('category', category);
                    }
                    if (year) {
                        url.searchParams.append('year', year);
                    }
                    if(year || category) {
                        url.searchParams.append('filtered', true);
                    }
                    url.searchParams.append('include_featured', true);

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

            $('.planet-news-select-years > .select-items > div').on('click', async function () {
                const year = $(this).attr("data-value");
                let category = $('.planet-news-select-category > .select-items > div.selected').attr("data-value");
                if(!category) {
                    category = "all";
                }
                await refresh_articles(category, year);
            });
            $('.planet-news-select-category > .select-items > div').on('click', async function () {
                const category = $(this).attr("data-value");
                let year = $('.planet-news-select-years > .select-items > div.selected').attr("data-value") || "all";
                if(!year) {
                    year = "all";
                }
                await refresh_articles(category, year);
            });

            $(document).ready(async function () {
                const status = fetch_articles_status();
                try {
                    let data = await fetch_articles(status[0], status[1], lang, status[2], status[3]);
                    render_articles(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            $('#load-more-button').click(async function () {
                try {
                    const status = fetch_articles_status();
                    let data = await fetch_articles(status[0], status[1], lang, status[2], status[3]);
                    render_articles(data);
                } catch (error) {
                    // Handle errors here, if necessary.
                    console.error('Error:', error);
                }
            });
            async function refresh_articles(category, year) {
                $(".article-js-wrapper").empty();
                is_loading(true);
                reset_article_limit();
                reset_article_offset();
                reset_article_count();
                switch_article_category(category);
                switch_article_year(year);
                const status = fetch_articles_status();
                let data = await fetch_articles(status[0], status[1], lang, status[2], status[3]);
                is_loading(false);
                render_articles(data);
            }


            function fetch_articles_status() {
                const limit = $(".article-js-wrapper").attr("data-limit");
                const offset = $(".article-js-wrapper").attr("data-offset");
                const category = $(".article-js-wrapper").attr("data-category");
                const year = $(".article-js-wrapper").attr("data-year");
                return [limit, offset, category, year];
            }

            function reset_article_limit() {
                $(".article-js-wrapper").attr("data-limit", "9");
            }
            function reset_article_offset() {
                $(".article-js-wrapper").attr("data-offset", "0");
            }
            function reset_article_count() {
                $(".article-js-wrapper").attr("data-total", "0");
            }
          

            function increase_article_limit() {
                $(".article-js-wrapper").attr("data-limit", "9");
            }

            function increase_article_offset() {
                const offset = $(".article-js-wrapper").attr("data-offset");
                const newValue = parseInt(offset) + 9
                $(".article-js-wrapper").attr('data-offset', newValue.toString());
            }
             function increase_article_count(amount) {
                let count = $(".article-js-wrapper").attr("data-total");
                let newValue = parseInt(count) + parseInt(amount);
                $(".article-js-wrapper").attr('data-total', newValue.toString());

            }

            function switch_article_category(category) {
                $(".article-js-wrapper").attr('data-category', category);
            }
            function switch_article_year(year) {
                $(".article-js-wrapper").attr('data-year', year);
            }


            function render_no_articles() {
                is_loading(false);
                $(".no-articles").show();
            }

            function handle_load_more(articles_count) {
                let shown_count = $(".article-js-wrapper").attr("data-total");
                if(articles_count > parseInt(shown_count)) {
                    $(".load-more-wrapper").show();
                } else {
                    $(".load-more-wrapper").hide();
                }
            }

            function is_loading(status = true) {
                if(!status) {
                    $(".loader").hide();
                } else {
                    $(".loader").show();
                }
                $(".load-more-wrapper").hide();
                $(".no-articles").hide();
                return;
            }

            function render_articles(data) {

                let articles = data.articles;

                if (!articles.length) {
                    render_no_articles();
                    return;
                }

                is_loading(false)

                increase_article_limit()
                increase_article_offset()
                increase_article_count(articles.length)
                
                articles.forEach(function (article) {
                    render_article_card(article);
                });

                handle_load_more(data.articles_count)
            }

            function render_article_card(article) {
                const articleCardTemplate = `
                    <div data-tagid="[${article.tags.map(tag => tag.id).join(', ')}]" class="news-box-wrapper article-wrapper coh-column coh-visible-sm coh-col-sm-12 coh-col-xs-12 coh-visible-xl coh-col-xl-4 coh-col-lg-4 coh-col-md-4">
                    <div class="article-card news-card">
                        <div class="article-bg-image-wrapper">
                        <div class="article-bg-image" style="background-image:url(${article.background_image})"></div>
                        </div>
                        <div class="article-card-content">
                        <div>
                        <div>
                        ${article.tags.length > 0 ? `
                            <div class="article-tags tags-pills">
                                <span>${article.tags.map(tag => tag.name).join(' · ')}</span>
                            </div>
                        ` : ''}
                        <div class="article-title">
                            <a href="${article.url}">${article.title}</a>
                        </div>
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


            $(".custom-select").on("click", function () {
                if ($(this).hasClass("selected")) {
                    $(".custom-select").removeClass("selected");
                } else {
                    $(".custom-select").removeClass("selected");
                    $(this).addClass("selected");
                }
            });
            $(".custom-select .select-items > div").on("click", function () {
                let val = $(this).attr("data-value");
                let txt = $(this).text();
                $(this).parent().parent().children(".select-selected").text(txt);
                $(this).parent().children("div").removeClass("selected");
                $(this).addClass("selected");
            })
        }
    };
})(jQuery, Drupal);
