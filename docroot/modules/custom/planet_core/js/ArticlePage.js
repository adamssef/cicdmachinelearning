(function ($, Drupal) {
    Drupal.behaviors.customScript = {
        attach: function (context, settings) {

            var hasRun = 0;

            async function copyTextToClipboard(textToCopy) {
                try {
                  if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(textToCopy);
                  }
                } catch (err) {
                  console.error(err);
                }
              }

            $('.copy-btn').click(function() {
                const toCopy = $(this).data("url");
                copyTextToClipboard(toCopy);

                $(".share-url").addClass('url-copied');
                setTimeout(function() {
                    $('.share-url').removeClass('url-copied');
                }, 1000);
            });
            

            $(".share-button").on("click", function() {
                MicroModal.show('share-article-modal', {
                    disableFocus: true,
                    closeTrigger: 'data-micromodal-close',
                    onClose: () => {
                        //
                    }
                });
            })

            
// Iterate over each .index-list container.
$(".index-list").each(function() {
    var $indexList = $(this);
    var targetElements = [];

    $indexList.empty();

    // Find all .coh-style-h500 headings inside .article-content-wrapper.
    $(".article-content-wrapper .coh-wysiwyg .coh-style-h500").each(function(index, heading) {
        // Store the target offset and the corresponding heading element.
        var targetOffset = $(heading).offset().top - 200;
        targetElements.push({ offset: targetOffset, element: heading });

        // Create an index item for each heading.
        var indexItem = $("<a>").attr("href", "#").text($(heading).text());

        // Add a click event to scroll to the corresponding heading.
        indexItem.click(function(event) {
            event.preventDefault();
            var targetOffset = $(heading).offset().top - 200;
            $("html, body").animate({
                scrollTop: targetOffset
            }, 800);
        });

        // Append the index item to the current .index-list container.
        $indexList.append(indexItem);
    });

    $(".index-title").show();


    // Add a scroll event listener to the window for the current .index-list container.
    $(window).scroll(function() {
        // Get the current scroll position.
        var scrollPosition = $(window).scrollTop();

        // if(targetElements.length) {
        //     $(".dynamic-index-wrapper").show();
        // }
        // Iterate over target elements and update the 'active' class based on scroll position.
        $.each(targetElements, function(index, targetElement) {
            // Check if the current scroll position is past the target offset.
            if (scrollPosition >= targetElement.offset) {
                // Remove the 'active' class from all index items within the current .index-list container.
                $indexList.find("a").removeClass("active");
    
                // Add the 'active' class to the current index item.
                var $currentElement = $indexList.find("a").eq(index);
                $currentElement.addClass("active");
    
                // Set the title of the currently viewed paragraph inside .index-title.
                var paragraphTitle = $currentElement.text();
                $(".dynamic-index-wrapper.mobile-version .index-title").text(paragraphTitle);
            } else {
                $indexList.find("a").eq(index).removeClass("active");
            }
        });
    });
    
});

$(window).scroll(function() {
    if ($(this).scrollTop() > 200) { //use `this`, not `document`
        $(".header-container.white-bg").css({
            'display': 'none'
        });
        $(".dynamic-index-wrapper.mobile-version").addClass("top-0");
    } else {
        $(".header-container.white-bg").css({
            'display': 'flex'
        });
        $(".dynamic-index-wrapper.mobile-version").removeClass("top-0");
    }
});


$(".dynamic-index-wrapper.mobile-version .index-title-wrapper").click(function() {
    $(".dynamic-index-wrapper.mobile-version .index-list").toggle();
    $(".dynamic-index-wrapper.mobile-version .index-title-wrapper").toggleClass("expanded");
})




        }
    };
})(jQuery, Drupal);
