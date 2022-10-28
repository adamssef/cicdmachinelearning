/**
 * Text and Video Component.
 * @file
 * File textVideo.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_textVideo = {
    attach: function () {
      // $("coh-youtube-embed-item").ready(function (){
      //   // do something once the iframe is loaded
      //   console.log("pronto");
      // });


      $(document).ready(function () {
        if (alreadyRun === 0) {

          //$(".video_youtube").show();
          //video_play_button

          $(".video_youtube").each(function (index) {


            $("coh-youtube-embed-item").ready(function (){
              // do something once the iframe is loaded
              //$("coh-youtube-embed-item").attr('src', $(".frameVideo").attr('src') + '?autoplay=1');

              $(".coh-youtube-embed-item").attr("allow","autoplay");
              //$('.coh-youtube-embed-item').attr("src", function() { return $(this).attr("src") + "&mute=1&" });

              //$(".coh-youtube-embed-item").attr('src', '//www.youtube.com/embed/hABD7YAuwc8' + '?autoplay=1&mute=1');




              console.log("play");

              // //find iframe
              // let iframe = $('coh-youtube-embed-item');
              //
              // //find button inside iframe
              // let button = iframe.contents().find('.ytp-large-play-button-red-bg');
              //
              // button.remove();

              $(".video_youtube").show();

              //$(".ytp-large-play-button-red-bg", this).trigger('click');





              //trigger button click
              //button.trigger("click");

              //console.log(button);

              //$(".ytp-large-play-button .ytp-button .ytp-large-play-button-red-bg", this).trigger('click');


              //$(".frameVideo").attr('src', $(".frameVideo").attr('src') + '?autoplay=1');

            });

            //$(".ytp-large-play-button .ytp-button .ytp-large-play-button-red-bg", this).trigger('click');
            //console.log($(".ytp-large-play-button .ytp-button .ytp-large-play-button-red-bg", this));
          });


          //
          // let youtubePlayButton = $(".video_youtube").find(".ytp-large-play-button .ytp-button .ytp-large-play-button-red-bg");
          // console.log(youtubePlayButton);
          // youtubePlayButton.trigger('click');


          $('.video_play_button', this).on('click', function (e) {

            $(".video_thumbnail").hide();
            $(".video_youtube").show();



            // gtag('event', 'Texts Button Cards', {
            //   'event_category': 'Get in touch',
            //   'event_label': $(this).html(),
            //   'event_value': 1
            // });
          });

          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
