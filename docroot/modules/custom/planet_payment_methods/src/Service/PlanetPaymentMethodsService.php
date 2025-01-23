<?php

namespace Drupal\planet_payment_methods\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;
use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;

class PlanetPaymentMethodsService {

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
   * The taxonomy service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface
   */
  public $planetCoreTaxonomyService;

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  public $entityTypeManager;

  /**
   * The path alias manager.
   *
   * @var \Drupal\path_alias\AliasManagerInterface
   */
  protected $pathAliasManager;

  /**
   * The media service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface
   */
  protected $planetCoreMediaService;

  /**
   * PlanetPaymentMethodsService constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface
   *   $planet_core_node_translations_service
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service
   *   The planet core taxonomy service.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service,
    LanguageManagerInterface $language_manager,
    PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service,
    AliasManagerInterface $path_alias_manager,
    PlanetCoreMediaServiceInterface $planet_core_media_service
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->planetCoreNodeTranslationsService = $planet_core_node_translations_service;
    $this->languageManager = $language_manager;
    $this->planetCoreTaxonomyService = $planet_core_taxonomy_service;
    $this->pathAliasManager = $path_alias_manager;
    $this->planetCoreMediaService = $planet_core_media_service;
  }

  /**
   * Get the payment method types.
   *
   * @return array
   *   The array containing the payment method types.
   */
  public function getPaymentMethodTypes() {
    return $this->planetCoreTaxonomyService->getTaxonomyTermsArray('payment_methods');
  }

  /**
   * Get the channel types.
   *
   * @return int
   *   The number payment methods for given channel and method.
   */
  public function getTotalPaymentMethodsCount($payment_method, $channel) {
    $payment_method = trim($this->processPaymentMethodString($payment_method));
    if ($channel === "false") {
      $channel = 'all';
    }

    if ($channel !== 'all') {
      $channel = $this->planetCoreNodeTranslationsService->t2($channel, [], 'en');
      $channel_tid = strtolower($channel) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($channel, 'channels') : NULL;
    }
    else {
      $channel_tid = NULL;
    }

    $payment_method_tid = strtolower($payment_method) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($payment_method, 'payment_methods') : NULL;
    $current_language = $this->languageManager->getCurrentLanguage()->getId();

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'payment_methods')
      ->condition('langcode', $current_language, '=')
      ->condition('status', TRUE)
      ->accessCheck(FALSE); // Sorting by creation date, adjust as needed

    if ($channel_tid !== NULL) {
      $query->condition('field_payment_channels', $channel_tid);
    }

    if ($payment_method_tid !== NULL) {
      $query->condition('field_payment_method', $payment_method_tid);
    }

    return $query->count()->execute();
  }

  /**
   * Process input payment method string into a desired output string.
   *
   * @param string $payment_method_string
   *   The channel string.
   *
   * @return string
   *   The processed channel string.
   */
  public function processPaymentMethodString($payment_method_string) {
    if (strtolower($payment_method_string) === 'e-banking') {
      $payment_method_string = 'E-banking/bank transfer';
    }

    $payment_method_string = $this->planetCoreNodeTranslationsService->t2($payment_method_string, [], 'en');

    if ($payment_method_string === 'Select payment method') {
      $payment_method_string = 'all';
    }

    return $payment_method_string;
  }

  /**
   * Process input channel string into a desired output string.
   *
   * @param string $channel_string
   *   The channel string.
   *
   * @return string
   *   The processed channel string.
   */
  public function processChannelString($channel_string) {
    $channel_string = $this->planetCoreNodeTranslationsService->t2($channel_string, [], 'en');

    if ($channel_string === 'All channels' || $channel_string === 'false') {
      $channel_string = 'all';
    }

    return $channel_string;
  }

  public function getPaymentMethods($payment_method, $channel, int $offset, $limit): ?array {
    $channel = $this->processChannelString($channel);
    $current_lang = $this->planetCoreNodeTranslationsService->determineTheLangId();

    // Initially set to NULL.
    $payment_option_tid = NULL;

    if ($payment_method === 'E-banking') {
      $payment_method = 'E-banking/bank transfer';
    }

    if ($payment_method === 'Select payment method') {
      $payment_method = 'all';
    }

    if ($payment_method !== 'all') {

      $all_payment_method_types = $this->planetCoreTaxonomyService->getTaxonomyTermsArray('payment_methods');
      $payment_method = trim($payment_method);

      if (!in_array($payment_method, $all_payment_method_types)) {
        // Check if there are any translated terms that corresponds to this name.
        $term_id = $this->planetCoreTaxonomyService->getTermIdByTermName($payment_method, 'payment_methods');
        if ($term_id) {
          $payment_option_tid = $term_id;
        }
        else {
          return NULL;
        }
      }
      else {
        $payment_option_tid = strtolower($payment_method) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($payment_method, 'payment_methods') : NULL;
      }
    }

    $channel_option_tid = strtolower($channel) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($channel, 'channels') : NULL;

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'payment_methods')
      ->range($offset, $limit)
      ->condition('langcode', $current_lang, '=')
      ->condition('status', TRUE)
      ->accessCheck(FALSE); // Sorting by creation date, adjust as needed

    if ($channel_option_tid !== NULL) {
      $query->condition('field_payment_channels', $channel_option_tid);
    }

    if ($payment_option_tid !== NULL) {
      $query->condition('field_payment_method', $payment_option_tid);
    }

    $nids = $query->execute();

    return $this->preparePaymentMethodsData($nids);
  }

  /**
   * Prepare data for payment methods
   *
   * @param array $nids
   *   The case study node IDs.
   *
   * @return array
   *   The array containing the data.
   */
  private function preparePaymentMethodsData(array $nids, ?int $threshold = NULL) {
    $payment_methods = $this->entityTypeManager->getStorage('node')->loadMultiple($nids);

    if ($threshold !== NULL) {
      while (count($payment_methods) < 21) {
        $payment_methods = array_merge($payment_methods, $payment_methods);
      }
    }

    $payment_methods_data = [];
    $langcode  = $this->planetCoreNodeTranslationsService->determineTheLangId();

    foreach ($payment_methods as $payment_method) {
      $payment_method = $payment_method->getTranslation($langcode);
      $alias = $this->pathAliasManager->getAliasByPath("/node/" . $payment_method->id(), $langcode);
      $media_id_logo = $payment_method->get('field_logo_media')?->target_id;

      $logo_url = $this->planetCoreMediaService->getImageUrl($media_id_logo, 'field_media_svg');

      if ($logo_url === NULL) {
        $logo_url = $this->planetCoreMediaService->getImageUrl($media_id_logo, 'field_media_image');
      }

      $terms = $payment_method->get('field_payment_method')->referencedEntities();
      $channels = $payment_method->get('field_payment_channels')->referencedEntities();
      $options = $this->planetCoreTaxonomyService->getTermNamesByIdList($terms);
      $channels = $this->planetCoreTaxonomyService->getTermNamesByIdList($channels);

      $payment_method_data = [
        'title' => $payment_method->getTitle(),
        'url' =>  $langcode === 'en' ? $alias : "/$langcode" . $alias,
        'logo_url' => $logo_url,
        'payment_options' => $options,
        'channels' => $channels
      ];

      $payment_methods_data[] = $payment_method_data;
    }

    return $payment_methods_data;
  }

  /**
   * Get the channel cards for Accept Payments page.
   *
   *
   * @return array
   */
  function getCards(): array {
    $aliases = [
      'dcc' => 'dcc',
      'online_payments' => 'online-payments',
      'in_person_payments' => 'in-person-payments',
    ];

    $nodes = [];

    foreach ($aliases as $key => $alias) {
      $nodes[$key] = $this->planetCoreNodeTranslationsService->getNodeByPathAlias($alias);
    }

    $links = $this->getCardLinks($nodes);

    $final_arr = [
      'dcc' => [
        'is_main' => TRUE,
        'img_path' => '/resources/images/payment_methods/payment_in_cafe.png',
        'title' => 'Currency solutions (DCC)',
        'url' => NULL,
        'class' => 'dcc',
        'children' => [
          'dcc' => [
            'title' => 'Learn more',
            'url' => $links['link_dcc'],
          ],
        ],
      ],
      'online_payments' => [
        'is_main' => TRUE,
        'img_path' => '/resources/images/payment_methods/accept_payments_inperson.jpg',
        'title' => 'Accept payments Online',
        'class' => 'online',
        'url' => NULL,
        'children' => [
          'online_payments' => [
            'title' => 'Learn more',
            'url' => $links['link_online_payments'],
          ],
        ],
      ],
      'in_person_payments' => [
        'is_main' => TRUE,
        'img_path' => '/resources/images/payment_methods/accept_payments_unattended.jpg',
        'title' => 'Accept payments In-person',
        'class' => 'inperson',
        'url' => NULL,
        'children' => [
          'in_person_payments' => [
            'title' => 'Learn More',
            'url' => $links['link_in_person_payments'],
          ],
        ]
      ],

    ];

    return $final_arr;
  }

  private function getCardLinks(array $nodes): array {
    $current_language_prefix = $this->languageManager->getCurrentLanguage()->getId();
    $link_dcc = ($current_language_prefix !== 'en') ? "/$current_language_prefix" . $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes['dcc'])[$current_language_prefix] : $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes['dcc'])[$current_language_prefix];
    $link_online_payments = ($current_language_prefix !== 'en') ? "/$current_language_prefix" . $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes['online_payments'])[$current_language_prefix] : $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes['online_payments'])[$current_language_prefix];
    $link_in_person_payments = ($current_language_prefix !== 'en') ? "/$current_language_prefix" . $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes['in_person_payments'])[$current_language_prefix] : $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($nodes['in_person_payments'])[$current_language_prefix];

    return [
      'link_dcc' => $link_dcc,
      'link_online_payments' => $link_online_payments,
      'link_in_person_payments' => $link_in_person_payments,
    ];
  }

}
