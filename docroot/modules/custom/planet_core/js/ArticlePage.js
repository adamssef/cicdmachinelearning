(function ($, Drupal) {
    Drupal.behaviors.customScript = {
        attach: function (context, settings) {

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
        }
    };
})(jQuery, Drupal);
