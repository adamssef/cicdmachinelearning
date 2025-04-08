jQuery(document).ready(function () {
  const $container = jQuery('.js-events');
  const $notFoundMessage = jQuery('.js-events-notfound');
  const $loader = jQuery('.js-events-loader');
  const $totalCountMessage = jQuery('.js-total-events-count');
  const $loadMoreButton = jQuery('.js-load-more-events');
  const $searchButton = jQuery('.planet-events-search-btn');
  const $searchInput = jQuery('.planet-events-search');
  const lang = jQuery('html')[0].lang;

  const $translations = jQuery('.events-translated-labels');
    const viewDetailsText = $translations.data('view-details');
    const searchTooShortText = $translations.data('search-too-short');
    const alreadySearchedText = $translations.data('already-searched');
  
  const limit = 9; // Limit of events to load
  let offset = 0; // Initial offset value
  let selectedLocation = null;
  let selectedTag = null;
  let lastSearchTerm = "";  // Track last search term
  let isSearching = false;  // Prevent multiple searches

  // Fetch events with optional filters
  function fetchEvents(limit, offset, location = null, tag = null, searchTerm = null) {
      $loader.show();
      $notFoundMessage.hide();
      $container.show();

      const queryParams = new URLSearchParams({
          limit: limit,
          offset: offset,
          langcode: lang
      });

      if (location && location !== 'default') {
        queryParams.append('locations', location);
    }

    if (tag && tag !== 'default') {
        queryParams.append('categories', tag);
    }

    if (searchTerm && searchTerm.length > 2) {
      queryParams.append('search', searchTerm);
    }

    jQuery.ajax({
          url: `/planet-events/all?${queryParams.toString()}`,
          type: 'GET',
          dataType: 'json',
          success: function (response) {
              $loader.hide();

              if (!response || !response.events || response.events.length === 0) {
                  $notFoundMessage.show();
                  $container.hide();
                  return;
              }

              $notFoundMessage.hide();
              $container.show();

              if (response.total_count) {
                  $totalCountMessage.text(`Total events: ${response.total_count}`);
              }

              response.events.forEach(event => {
                  $container.append(createEventCard(event));
              });

              offset += limit;

              $loadMoreButton.data('offset', offset);

              $loadMoreButton.toggle(response.total_count > offset);
          },
          error: function (xhr, status, error) {
              console.error('Error fetching events:', error);
              $loader.hide();
              $notFoundMessage.show();
              $container.hide();
          }
      });
  }

  function createEventCard(event) {
      const industries = event.event_industry.map(industry => 
          `<span class="bg-white/10 text-zinc-50 text-base px-2 py-1 rounded">${industry}</span>`
      ).join('');

      const location = Array.isArray(event.event_location) 
          ? event.event_location.join(', ') 
          : event.event_location;

          return jQuery(`
            <a href="${event.url}" class="bg-[#202020] rounded-lg overflow-hidden border border-[#d1d1d1] border-solid group">
                <div class="relative">
                    <div class="m-2 mb-0 group-hover:m-0 transition-all">
                        <div style="background-image: url('${event.image}')" class="relative p-2 transition-all rounded h-52 group-hover:h-[216px] w-full bg-cover bg-no-repeat bg-center">
                            <div class="absolute inset-0 bg-black/20">
                                <div class="absolute top-0 left-0 pl-2 pt-2">
                                    <div class="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                        <span class="ml-1 text-base font-semibold">${event.date_range}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <div class="p-4">
                        <h3 class="text-2xl text-zinc-50 font-bold leading-8">${event.title}</h3>
                        <div class="flex items-center text-base font-light text-zinc-50 py-4">
                            <span>${location}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 mb-4">${industries}</div>
                        <span class="inline-flex text-base items-center font-semibold text-zinc-50 hover:text-white">
                            <span class="group-hover:underline">${viewDetailsText}</span>
                            <img class="transition-all group-hover:ml-6 ml-5 h-8 w-auto" src="/resources/icons/all/navigation-forward-dark.svg" alt="${viewDetailsText}">
                        </span>
                    </div>
                </div>
            </a>
        `);
        
  }

  // Filter location handler
  jQuery('.planet-events-filter-location > li').on('click', function () {
      const $this = jQuery(this);
      const locationId = $this.data('id');
      if ($this.hasClass('active')) return;

      jQuery('.planet-events-filter-location > li').removeClass("active");
      $this.toggleClass('active');
      selectedLocation = $this.hasClass('active') ? locationId : null;

      offset = 0;
      $container.empty();
      fetchEvents(limit, offset, selectedLocation, selectedTag);
  });

  // Filter tag handler
  jQuery('.planet-events-filter-tags > li').on('click', function () {
      const $this = jQuery(this);
      const tagId = $this.data('id');
      if ($this.hasClass('active')) return;

      jQuery('.planet-events-filter-tags > li').removeClass("active");
      $this.toggleClass('active');
      selectedTag = $this.hasClass('active') ? tagId : null;

      offset = 0;
      $container.empty();
      fetchEvents(limit, offset, selectedLocation, selectedTag);
  });

  // Load more events
  $loadMoreButton.on('click', function () {
      const currentOffset = $loadMoreButton.data('offset');
      $loader.show();
      fetchEvents(limit, currentOffset, selectedLocation, selectedTag);
  });

  // Search button handler
  $searchButton.on('click', function () {
    const searchTerm = $searchInput.val().trim();

    // Only search if the term is more than 2 characters and not the same as last search term
    if (searchTerm.length > 2 && searchTerm !== lastSearchTerm) {
      lastSearchTerm = searchTerm;  // Set the last search term
      $loader.show();
      offset = 0;
      $container.empty();
      fetchEvents(limit, offset, selectedLocation, selectedTag, searchTerm);
    } else if (searchTerm.length <= 2) {
      alert(searchTooShortText);
    } else if (searchTerm === lastSearchTerm) {
      alert(alreadySearchedText);
    }
  });

  fetchEvents(limit, offset);
});
