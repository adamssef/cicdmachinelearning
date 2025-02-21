(function ($, Drupal) {
    Drupal.behaviors.customScript = {
        attach: function (context, settings) {
            // Initial settings
            let offset = 0;
            let limit = 9;
            let search_key = "";
            const lang = $('html')[0].lang;

            // Fetch articles from the server
            async function fetchArticles(limit, offset, lang, featured, type = false, product = false, industry = false, region = false, search = false) {
                is_loading(true);
                try {
                    const url = new URL(`/planet_partners_pages/partners/`, window.location.origin);
                    const params = { limit, offset, lang, type, product, industry, region, featured, search };
                    Object.keys(params).forEach(key => {
                        if (params[key]) {
                            url.searchParams.append(key, params[key]);
                        }
                    });
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    is_loading(false);
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error loading articles:', error);
                    throw error;
                }
            }

            // Render article cards
            function renderArticleCards(data, wrapper = ".normal-js-wrapper") {
                const articles = data.articles;
                const articleWrapper = $(wrapper);

                articleWrapper.empty();
                if (!articles.length) {
                    renderNoArticles();
                    return;
                }
                articles.forEach(article => {
                    renderArticleCard(article, articleWrapper);
                });
                if (!data.articles_finished) {
                    $("#load-more-button").show();
                } else {
                    $("#load-more-button").hide();
                }
                is_loading(false);
            }

            // Render individual article card
            function renderArticleCard(article, wrapper, className = "") {
                const tags = article.tags.map(tag => `<span data-tagid="${tag.id}">${tag.name}</span>`).join('');
                const isNewTag = article.is_new ? '<div class="planet-tag-pill new-tag">New</div>' : ''; // Add New tag if article is new
                const isComingSoon = article.is_coming_soon ? '<div class="planet-tag-pill coming-soon-tag">Coming soon</div>' : ''; // Add New tag if article is new
                const articleCardTemplate = `
                    <div data-tagid="[${article.tags.map(tag => tag.id).join(', ')}]" class="news-box-wrapper article-wrapper coh-column coh-visible-sm coh-col-sm-12 coh-col-xs-12 coh-visible-xl coh-col-xl-4 coh-col-lg-4 coh-col-md-4">
                        <div class="article-card partners-card news-card">
                            <div class="article-bg-image-wrapper ${className}">
                                <div class="article-bg-image">
                                <div class="article-bg-image" style="background-image:url(${article.logo});background-color:${article.bg_color}">
                                </div>
                                <div class="planet-tag-pill-wrapper">${isNewTag} ${isComingSoon}</div>
                                </div>
                            </div>
                            <div class="article-card-content">
                                <div>
                                    <div>
                                        <div class="article-tags tags-pills">${tags}</div>
                                        <div class="article-title">
                                            <a href="${article.url}">${article.title}</a>
                                        </div>
                                    </div>
                                    <div class="tags-and-author">
                                        <div class="article-author-and-date">
                                            <div class="article-date">${article.body}</div>
                                        </div>
                                    </div>
                                    <a href="${article.url}">
                                    <div class="arrow-right"><img src="/resources/icons/card-arrow-right.svg"></div>
                                </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                wrapper.append(articleCardTemplate);
            }


            // Render message for no articles
            function renderNoArticles() {
                $(".loader").hide();
                $(".article-js-wrapper").empty();
                $(".no-articles").show();
            }

            async function resetFilters() {
                $(".partners-search-form .search-input").val('');
                $(".article-js-wrapper").empty();
                $(".featured-partners-wrapper, .more-partners-wrapper").show();
                $(".custom-select").each(function() {
                    let text = $(this).children(".select-items").children("div:first-child").text();
                    $(this).children(".select-selected").text(text);
                })
                await fetchInitialArticles();
            }

            // Handle select dropdown click event
            function handleSelectClick(key, selector, callback) {
                $(selector).on('click', async function () {
                    $(".article-js-wrapper").empty();
                    initialize_filtered_view();
                    const val = $(this).attr("data-value");
                    let otherVals = getSelectValues();
                    otherVals[key] = val;
                    const data = await fetchArticles(limit, offset, lang, false, otherVals.type, otherVals.product, otherVals.industry, otherVals.region);
                    callback(data);
                });
            }

            // Get selected values from dropdowns
            function getSelectValues() {
                return {
                    type: $('.planet-partners-select-type > .select-items > div.selected').attr("data-value"),
                    product: $('.planet-partners-select-product > .select-items > div.selected').attr("data-value"),
                    industry: $('.planet-partners-select-industry > .select-items > div.selected').attr("data-value"),
                    region: $('.planet-partners-select-region > .select-items > div.selected').attr("data-value"),
                    search: $('.planet-search-bar input.search-input').val()
                };
            }

            // Load initial articles
            $(document).ready(async function () {
                await fetchInitialArticles();
            });

            async function fetchInitialArticles() {
                try {
                    const featuredPartners = await fetchArticles(limit, offset, lang, true);
                    renderArticleCards(featuredPartners, ".featured-js-wrapper");

                    const normalPartners = await fetchArticles(limit, offset, lang, false);
                    renderArticleCards(normalPartners, ".normal-js-wrapper");

                    $(".reset-filters").hide();
                    $(".planet-h3.center").show();
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            function initialize_filtered_view() {
                $(".featured-partners-wrapper").hide();
                $(".planet-h3.center").hide();
                $(".normal-js-wrapper").show();
                $(".reset-filters").show();
            }

            function is_loading(status = true) {
                if (!status) {
                    $(".loader").hide();
                } else {
                    $(".loader").show();
                }
                $(".load-more-wrapper").hide();
                $(".no-articles").hide();
                return;
            }

            // Load more articles
            $('#load-more-button').click(async function () {
                try {
                    limit += 9;
                    const data = await fetchArticles(limit, offset, lang);
                    renderArticleCards(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            // Attach click events for select dropdowns
            handleSelectClick("type", '.planet-partners-select-type > .select-items > div', renderArticleCards);
            handleSelectClick("product", '.planet-partners-select-product > .select-items > div', renderArticleCards);
            handleSelectClick("industry", '.planet-partners-select-industry > .select-items > div', renderArticleCards);
            handleSelectClick("region", '.planet-partners-select-region > .select-items > div', renderArticleCards);

            // Toggle select dropdown
            $(".custom-select").on("click", function () {
                $(this).toggleClass("selected").siblings().removeClass("selected");
            });

            // Update selected dropdown value
            $(".custom-select .select-items > div").on("click", function () {
                const val = $(this).attr("data-value");
                const txt = $(this).text();
                const parent = $(this).parent().parent();
                parent.children(".select-selected").text(txt);
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");
            });

            // Add focus styles to search input
            $(".planet-search-bar input.search-input").on('focusin focusout', function () {
                $(this).parent().parent().toggleClass('input-focused', $(this).is(':focus'));
            });

            $(".search-icon").on("click", async function (e) {
                await searchByKeyword();
            });

            $(".reset-filters").on("click", async function() {
                await resetFilters();
            })

            $(".partners-search-form").on('submit', async function (e) {
                e.preventDefault();
                await searchByKeyword();
            });

            //user is "finished typing," do something
            async function searchByKeyword(reset = false) {
                let search = $(".planet-search-bar input.search-input").val();
                if (search < 3 || search == search_key) {
                    return;
                }
                search_key = search;
                $(".article-js-wrapper").empty();
                initialize_filtered_view();
                let otherVals = getSelectValues();
                let data = [];
                if (reset) {
                    data = await fetchArticles(limit, offset, lang, false, otherVals.type, otherVals.product, otherVals.industry, otherVals.region);
                } else {
                    data = await fetchArticles(limit, offset, lang, false, otherVals.type, otherVals.product, otherVals.industry, otherVals.region, otherVals.search);
                }
                renderArticleCards(data);
            }
        }
    };
})(jQuery, Drupal);