(function ($, Drupal) {
    Drupal.behaviors.customScript = {
        attach: function (context, settings) {

            let offset = 0;
            let limit = 9;
            let isTagFiltered = false;
            const lang = $('html')[0].lang;

            async function fetch_articles(limit = 9, offset = 0, lang = "en", category = false) {

                is_loading(true)

                try {
                    const url = new URL(`/planet_core/blog_articles/${limit}/${offset}/${lang}`, window.location.origin);
                    if (category) {
                        url.searchParams.append('category', category);
                    }
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

            $(document).ready(async function () {

                const status = fetch_articles_status();
                try {
                    let data = await fetch_articles(status[0], status[1], lang);
                    render_articles(data);
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
                    const status = fetch_articles_status();
                    let data = await fetch_articles(status[0], status[1], lang, status[2]);
                    render_articles(data);
                } catch (error) {
                    // Handle errors here, if necessary.
                    console.error('Error:', error);
                }
            });


            async function filterByTagId(tagid) {
                if(tagid == $(".article-js-wrapper").attr("data-category")) {
                    return; //prevent clicking on same tag
                }
                $(".main-pill").removeClass('selected');
                $(".main-pill[data-tagid=" + tagid + "]").addClass('selected');
                $(".article-js-wrapper").empty();
                is_loading(true);
                reset_article_limit();
                reset_article_offset();
                reset_article_count();
                switch_article_category(tagid);
                const status = fetch_articles_status();
                let data = await fetch_articles(status[0], status[1], lang, status[2]);
                is_loading(false);
                render_articles(data);
            }

            $(document).on("click", ".main-pill[data-tagid]", async function () {
                await filterByTagId($(this).data('tagid'));
            });

            function fetch_articles_status() {
                const limit = $(".article-js-wrapper").attr("data-limit");
                const offset = $(".article-js-wrapper").attr("data-offset");
                const category = $(".article-js-wrapper").attr("data-category");
                return [limit, offset, category];
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


            function render_no_articles() {
                is_loading(false);
                $(".no-articles").show();
            }

            function handle_load_more(articles_count) {
                let shown_count = $(".article-js-wrapper").attr("data-total");
                console.log(articles_count > parseInt(shown_count));
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
                    <div data-tagid="[${article.tags.map(tag => tag.id).join(', ')}]" class="article-wrapper coh-column coh-visible-sm coh-col-sm-12 coh-col-xs-12 coh-visible-xl coh-col-xl-4 coh-col-lg-4 coh-col-md-4">
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
                                <div class="author-photo" style="background-image:url(${article.author.profile_picture})"></div>
                                <div class="author-name"><span>${article.author.full_name}</span></div>
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
