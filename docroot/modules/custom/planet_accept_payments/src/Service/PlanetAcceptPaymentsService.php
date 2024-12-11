<?php

namespace Drupal\planet_accept_payments\Service;

use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreTranslationInterface;

class PlanetAcceptPaymentsService {

  /**
   * The node translation service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface
   */
  public $planetCoreNodeTranslationsService;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * PlanetAcceptPaymentsService constructor.
   *
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   *
   * @param \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service
   *  The node translation service.
   *
   */
  public function __construct(
    PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service,
    LanguageManagerInterface $language_manager
  ) {
    $this->planetCoreNodeTranslationsService = $planet_core_node_translations_service;
    $this->languageManager = $language_manager;
  }

  /**
   * Get the channel cards for Accept Payments page.
   *
   *
   * @return array
   */
  function getCards(): array {
    $aliases = [
      "Learn more" => "online-payments",
      "Website" => "in-app-payments",
      "Pay by link" => "pay-by-link",
      "In person" => "in-person-payments",
      "Countertop" => "terminals-countertop",
      "On the move" => "mobile-payment-terminals",
      "Unattended" => "terminals-unattended",
    ];

    $nodes = [];

    foreach ($aliases as $key => $alias) {
      $nodes[$key] = $this->planetCoreNodeTranslationsService->getNodeByPathAlias($alias);
    }

    $current_language_prefix = $this->languageManager->getCurrentLanguage()->getId();


    $final_arr = [
      "online" => [
        "is_main" => TRUE,
        "img_path" => "/resources/images/accept_payments_online.jpg",
        "title" => "Online",
        "url" => $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Learn more"])[$current_language_prefix] ?? $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Learn more"])['en'],
        "class" => "online",
        "children" => [
          "website" => [
            "title" => "In-app",
            "url" => $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Website"])[$current_language_prefix] ?? $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Website"])['en'],
          ],
          "pay_by_link" => [
            "title" => "Pay by link",
            "url" => $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Pay by link"])[$current_language_prefix] ?? $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Pay by link"])['en'],
          ],
        ],
      ],
      "in_person" => [
        "is_main" => TRUE,
        "img_path" => "/resources/images/accept_payments_inperson.jpg",
        "title" => "In Person",
        "class" => "inperson",
        "url" => $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["In person"])[$current_language_prefix] ?? $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["In person"])['en'],
        "children" => [
          "countertop" => [
            "title" => "Countertop",
            "url" => $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Countertop"])[$current_language_prefix] ?? $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Countertop"])['en'],
          ],
          "on_the_move" => [
            "title" => "On the move",
            "url" => $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["On the move"])[$current_language_prefix] ?? $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["On the move"])['en'],
          ],
        ],
      ],
      "unattended" => [
        "is_main" => TRUE,
        "img_path" => "/resources/images/accept_payments_unattended.jpg",
        "title" => "Unattended",
        "class" => "unattended",
        "url" => $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Unattended"])[$current_language_prefix] ?? $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes["Unattended"])['en'],
        "children" => [
          "ending_machine" => [
            "title" => "Vending machine",
            "url" => NULL,
          ],
          "parking" => [
            "title" => "Parking",
            "url" => NULL,
          ],
          "kiosk_or_ticket" => [
            "title" => "Kiosk or ticketing",
            "url" => NULL,
          ]
        ]
      ],
    ];

    return $final_arr;
  }

  public function getBrandsWeWorkWith() {
    // Make the shit for Bvlgari, Europcar, Hyatt, Ihg, Mandarin oriental, nh, pret, printemps, selfridges, tui

    return [
      [
        'name' => 'Bvlgari',
        'src' => '/resources/logos/accept_payments/bvlgari.svg',
      ],
      [
        'name' => 'Europcar',
        'src' => '/resources/logos/accept_payments/europcar.svg',
      ],
      [
        'name' => 'Hyatt',
        'src' => '/resources/logos/accept_payments/hyatt.svg',
      ],
      [
        'name' => 'IHG',
        'src' => '/resources/logos/accept_payments/ihg.svg',
      ],
      [
        'name' => 'Mandarin Oriental',
        'src' => '/resources/logos/accept_payments/mandarin_oriental.svg',
      ],
      [
        'name' => 'NH',
        'src' => '/resources/logos/accept_payments/nh.svg',
      ],
      [
        'name' => 'Pret',
        'src' => '/resources/logos/accept_payments/pret.svg',
      ],
      [
        'name' => 'Printemps',
        'src' => '/resources/logos/accept_payments/printemps.svg',
      ],
      [
        'name' => 'Selfridges',
        'src' => '/resources/logos/accept_payments/selfridges.svg',
      ],
      [
        'name' => 'TUI',
        'src' => '/resources/logos/accept_payments/tui.svg',
      ],
    ];
  }

}
