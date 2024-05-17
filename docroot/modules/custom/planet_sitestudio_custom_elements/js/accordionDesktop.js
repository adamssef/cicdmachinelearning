(function ($, Drupal) {
    let alreadyRun = 0;

    Drupal.behaviors.planet_sitestudio_accordionDesktop = {
        attach: function (context, settings) {
            if (context.nodeName === '#document') {
                let button = $(".whychooseplanetbutton")
                switch (settings.language) {
                    case 'en':
                        button.addClass("opened-en")
                        break;
                    case 'it':
                        button.addClass("opened-it")
                        break;
                    case 'fr':
                        button.addClass("opened-fr")
                        break;
                    case 'es':
                        button.addClass("opened-es")
                        break;
                    case 'de':
                        button.addClass("opened-de")
                        break;
                    default:
                        button.addClass("opened-en")
                        break;
                }
                once('planet_sitestudio_accordionDesktop', '.whychooseplanetbutton', context).forEach(function (element) {
                    element.addEventListener('click', function () {
                        let button = $(".whychooseplanetbutton")
                        switch (true) {
                            case button.hasClass("opened-en"):
                                button.removeClass("opened-en").addClass("closed-en");
                                break;
                            case button.hasClass("closed-en"):
                                button.removeClass("closed-en").addClass("opened-en");
                                break;
                            case button.hasClass("opened-it"):
                                button.removeClass("opened-it").addClass("closed-it");
                                break;
                            case button.hasClass("closed-it"):
                                button.removeClass("closed-it").addClass("opened-it");
                                break;
                            case button.hasClass("opened-fr"):
                                button.removeClass("opened-fr").addClass("closed-fr");
                                break;
                            case button.hasClass("closed-fr"):
                                button.removeClass("closed-fr").addClass("opened-fr");
                                break;
                            case button.hasClass("opened-es"):
                                button.removeClass("opened-es").addClass("closed-es");
                                break;
                            case button.hasClass("closed-es"):
                                button.removeClass("closed-es").addClass("opened-es");
                                break;
                            case button.hasClass("opened-de"):
                                button.removeClass("opened-de").addClass("closed-de");
                                break;
                            case button.hasClass("closed-de"):
                                button.removeClass("closed-de").addClass("opened-de");
                                break;
                            default:
                                break;
                        }
                    });
                });
            }

            if ($(window).width() >= 768 && alreadyRun === 0) {
                $(".whychooseplanetcontent").addClass("open");
                $(".whychooseplanetbutton").addClass("open");
                alreadyRun = 1;
            }
        }
    };
})(jQuery, Drupal);