(function ($, Drupal) {
    class PartnerArticlesManager {
        constructor() {
            this.offset = 0;
            this.limit = 9;
            this.searchKey = '';
            this.lang = $('html')[0].lang;

            $(document).ready(async () => {
                await this.fetchInitialArticles();
                this.attachEvents();
            });
        }

        async fetchArticles({ featured = false, type = false, product = false, industry = false, region = false, search = false } = {}) {
            this.toggleLoader(true);
            try {
                const url = new URL(`/planet_partners_pages/partners/`, window.location.origin);
                const params = { limit: this.limit, offset: this.offset, lang: this.lang, type, product, industry, region, featured, search };
        
                Object.entries(params).forEach(([key, value]) => {
                    if (value) url.searchParams.append(key, value);
                });
        
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
        
                return await response.json();
            } catch (error) {
                console.error('Error loading articles:', error);
                throw error;
            }
        }

        renderArticleCards(data, wrapperSelector = ".normal-js-wrapper") {
            const wrapper = $(wrapperSelector);
            wrapper.empty();

            if (!data.articles.length) {
                this.renderNoArticles();
                return;
            }
            
            // Hide loader and use setTimeout to ensure UI updates before rendering
            this.toggleLoader(false);
            
            // Small delay to ensure the loader is hidden in the UI before rendering cards
            setTimeout(() => {
                data.articles.forEach(article => this.renderArticleCard(article, wrapper));
                $("#load-more-button").toggle(!data.articles_finished);
            }, 50);
        }

        renderArticleCard(article, wrapper, className = "") {
            const tags = article.tags.map(tag => `<span data-tagid="${tag.id}">${tag.name}</span>`).join('');
            const newTag = article.is_new ? '<div class="planet-tag-pill new-tag">New</div>' : '';
            const comingSoonTag = article.is_coming_soon ? '<div class="planet-tag-pill coming-soon-tag">Coming soon</div>' : '';

            const template = `
                <div data-tagid="[${article.tags.map(tag => tag.id).join(', ')}]" class="news-box-wrapper article-wrapper coh-column coh-visible-sm coh-col-sm-12 coh-col-xs-12 coh-visible-xl coh-col-xl-4 coh-col-lg-4 coh-col-md-4">
                    <div class="article-card partners-card news-card">
                        <div class="article-bg-image-wrapper ${className}">
                            <div class="article-bg-image" style="background-image:url(${article.logo});background-color:${article.bg_color}"></div>
                            <div class="planet-tag-pill-wrapper">${newTag} ${comingSoonTag}</div>
                        </div>
                        <div class="article-card-content">
                            <div>
                                <div>
                                    <div class="article-tags tags-pills">${tags}</div>
                                    <div class="article-title"><a href="${article.url}">${article.title}</a></div>
                                </div>
                                <div class="tags-and-author">
                                    <div class="article-author-and-date">
                                        <div class="article-date">${article.body}</div>
                                    </div>
                                </div>
                                <a href="${article.url}"><div class="arrow-right"><img src="/resources/icons/card-arrow-right.svg"></div></a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            wrapper.append(template);
        }

        renderNoArticles() {
            // Show the "not found" message
            $(".js-notfound").show();
            
            // Hide loader when showing no articles message
            $(".loader").hide();
            $(".article-js-wrapper").empty();
            $(".no-articles").hide(); // Hide the old no-articles message if it exists
        }

        toggleLoader(status = true) {
            $(".loader").toggle(status);
            $(".load-more-wrapper, .no-articles, .js-notfound").hide();
        }

        initializeFilteredView() {
            $(".featured-partners-wrapper, .planet-h3.center").hide();
            $(".normal-js-wrapper, .reset-filters").show();
        }

        getSelectValues() {
            return {
                type: $('.planet-partners-select-type > .select-items > div.selected').data("value"),
                product: $('.planet-partners-select-product > .select-items > div.selected').data("value"),
                industry: $('.planet-partners-select-industry > .select-items > div.selected').data("value"),
                region: $('.planet-partners-select-region > .select-items > div.selected').data("value"),
                search: $('.planet-search-bar input.search-input').val()
            };
        }

        async fetchInitialArticles() {
            try {
                const featured = await this.fetchArticles({ featured: true });
                // Don't toggle loader here - will be handled in renderArticleCards
                this.renderArticleCards(featured, ".featured-js-wrapper");

                const normal = await this.fetchArticles({ featured: false });
                // Don't toggle loader here - will be handled in renderArticleCards
                this.renderArticleCards(normal, ".normal-js-wrapper");

                $(".reset-filters").hide();
                $(".planet-h3.center").show();
            } catch (error) {
                this.toggleLoader(false); // Make sure to hide loader on error
                console.error('Initial article fetch failed:', error);
            }
        }

        attachEvents() {
            this.bindDropdownFilters();
            this.bindDropdownSelections();
            this.bindSearch();
            this.bindResetFilters();
            this.bindLoadMore();
        }

        bindDropdownFilters() {
            const selectors = [
                ["type", ".planet-partners-select-type > .select-items > div"],
                ["product", ".planet-partners-select-product > .select-items > div"],
                ["industry", ".planet-partners-select-industry > .select-items > div"],
                ["region", ".planet-partners-select-region > .select-items > div"]
            ];

            selectors.forEach(([key, selector]) => {
                $(selector).on("click", async () => {
                    this.initializeFilteredView();
                    const filters = this.getSelectValues();
                    filters[key] = $(event.target).data("value");
                    const data = await this.fetchArticles(filters);
                    // Don't toggle loader here - will be handled in renderArticleCards
                    this.renderArticleCards(data);
                });
            });
        }

        bindDropdownSelections() {
            $(".custom-select").on("click", function () {
                $(this).toggleClass("selected").siblings().removeClass("selected");
            });

            $(".custom-select .select-items > div").on("click", function () {
                const txt = $(this).text();
                const parent = $(this).closest(".custom-select");
                parent.children(".select-selected").text(txt);
                $(this).addClass("selected").siblings().removeClass("selected");
            });
        }

        bindSearch() {
            $(".planet-search-bar input.search-input").on("focusin focusout", function () {
                $(this).closest('.planet-search-bar').toggleClass('input-focused', $(this).is(":focus"));
            });

            $(".search-icon").on("click", async () => await this.searchByKeyword());
            $(".partners-search-form").on("submit", async (e) => {
                e.preventDefault();
                await this.searchByKeyword();
            });
        }

        async searchByKeyword(reset = false) {
            const search = $(".planet-search-bar input.search-input").val();

            if (search.length < 3 || search === this.searchKey) return;
            this.searchKey = search;

            $(".article-js-wrapper").empty();
            this.initializeFilteredView();

            const filters = this.getSelectValues();
            const data = await this.fetchArticles(reset ? { ...filters, search: false } : filters);
            // Don't toggle loader here - will be handled in renderArticleCards
            this.renderArticleCards(data);
        }

        async resetFilters() {
            $(".partners-search-form .search-input").val('');
            $(".article-js-wrapper").empty();
            $(".featured-partners-wrapper, .more-partners-wrapper").show();

            $(".custom-select").each(function () {
                const firstOptionText = $(this).find(".select-items > div:first-child").text();
                $(this).children(".select-selected").text(firstOptionText);
            });

            await this.fetchInitialArticles();
        }

        bindResetFilters() {
            $(".reset-filters").on("click", async () => await this.resetFilters());
        }

        bindLoadMore() {
            $("#load-more-button").on("click", async () => {
                try {
                    this.limit += 9;
                    const filters = this.getSelectValues();
                    const data = await this.fetchArticles(filters);
                    // Don't toggle loader here - will be handled in renderArticleCards
                    this.renderArticleCards(data);
                } catch (error) {
                    this.toggleLoader(false); // Make sure to hide loader on error
                    console.error('Load more error:', error);
                }
            });
        }
    }

    Drupal.behaviors.customScript = {
        attach: function (context, settings) {
            if (!context._partnerArticlesManagerInitialized) {
                context._partnerArticlesManagerInitialized = true;
                new PartnerArticlesManager();
            }
        }
    };
})(jQuery, Drupal);