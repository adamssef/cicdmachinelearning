/**
 * Text and Video Component.
 * @file
 * File textVideo.js.
 */

(function ($, Drupal) {
  let alreadyRun = 0;
  Drupal.behaviors.planet_sitestudio_textVideo = {
    attach: function () {
      $(document).ready(function () {
        if (alreadyRun === 0) {

          if ($('script[src="https://www.youtube.com/iframe_api"]').length > 0) {
            // Api already initiated.
            return;
          }

          // Create youtube api element.
          let tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var a = tag.setAttribute('data-ot-ignore','');
          let firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          //console.log(tag);
          let playerInfoList = [];

          $(".tabTeamYoutube, .textAndVideoYoutube").each(function (index) {

            // Create a random player id.
            window['player'] = 'player' + Math.random().toString(36).substr(2, 6);

            // Get the video ID from component.
            let video_youtube_id = $('.video_youtube', this);

            // Add specific attribute to player.
            $('#video_youtube_player', this).attr("id", "video_youtube_player_" + player);

            let video_thumbnail = $('.video_thumbnail', this);
            let video_youtube = $('.video_youtube', this);

            // Create array with elements.
            playerInfoList.push({
              'player_id': window['player'],
              'video_id': video_youtube_id.attr('id'),
              'element_id': $('.video_play_button', this),
              'video_thumbnail': video_thumbnail,
              'video_youtube': video_youtube
            });
          });

          // Set api video.
          function onYouTubeIframeAPIReady() {
            if (typeof playerInfoList === 'undefined')
              return;

            for (let i = 0; i < playerInfoList.length; i++) {
              let curplayer = createPlayer(playerInfoList[i]);

              // Add thumbnail button functionality.
              playerInfoList[i].element_id.on('click', function (e) {
                playerInfoList[i].video_thumbnail.hide();
                playerInfoList[i].video_youtube.show();
                curplayer.playVideo();

                // Pause video on mouseout.
                playerInfoList[i].video_youtube.mouseout(function () {
                  curplayer.pauseVideo();
                });

                // Send data to GA.
                let video_title = curplayer.getVideoData().title;
                if (typeof video_title !== 'undefined' && typeof gtag === typeof Function) {
                  gtag('event', 'Text and Video', {
                    'event_category': 'Content',
                    'event_label': 'Video: ' + video_title,
                    'event_value': 1
                  });
                }
              });
            }
          }

          // Create youtube player.
          function createPlayer(playerInfo) {
            return new YT.Player("video_youtube_player_" + playerInfo.player_id, {
              height: '100%',
              width: '100%',
              videoId: playerInfo.video_id,
              playerVars: {'autoplay': 1, 'playsinline': 1, 'rel': 0},
              events: {
                'onReady': onPlayerReady
              }
            });
          }

          window.onYouTubeIframeAPIReady = function () {
            setTimeout(onYouTubeIframeAPIReady, 10);
          }

          function onPlayerReady(event) {
            //event.target.mute();
            //event.target.playVideo();
            event.target.pauseVideo();
          }

          alreadyRun = 1;
        }
      });
    }
  };
})(jQuery, Drupal);
