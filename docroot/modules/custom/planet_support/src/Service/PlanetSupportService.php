<?php

namespace Drupal\planet_support\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;
use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;

class PlanetSupportService {

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

  public function getRegions() {
    $regions = $this->planetCoreTaxonomyService->getNthLevelTaxonomyTermsArray('phone_number_terms', 0);
    uasort($regions, function ($a, $b) {
      return strcmp($a, $b); // Compare the `name` field.
    });

    return $regions;
  }

  public function getCompanies() {
    $regions = $this->planetCoreTaxonomyService->getNthLevelTaxonomyTermsArray('email_contacts_terms', 0);
    uasort($regions, function ($a, $b) {
      return strcmp($a, $b); // Compare the `name` field.
    });

    return $regions;
  }


  public function getAllCountries() {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadByProperties(['vid' => 'phone_number_terms']);
    $countries = [];

    foreach ($terms as $term) {
      $is_top_level = $term->get('parent')->getValue()[0]['target_id'] === '0';

      if (!$is_top_level) {
        $countries[$term->label()] = [
          'id' => $term->id(),
          'name' => $term->label(),
          'phone' => $term->get('field_enter_phone_number')->value,
          'region' => $this->planetCoreTaxonomyService->getTermNameById($term->get('parent')->getValue()[0]['target_id']),
        ];
      }
    }

    ksort($countries);

    return $countries;
  }

  public function getAllEmails() {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadByProperties(['vid' => 'email_contacts_terms']);
    $countries = [];

    foreach ($terms as $term) {
      $is_top_level = $term->get('parent')->getValue()[0]['target_id'] === '0';

      if (!$is_top_level) {
        $countries[$term->label()] = [
          'id' => $term->id(),
          'name' => $term->label(),
          'email' => $term->get('field_email')->value,
          'company' => $this->planetCoreTaxonomyService->getTermNameById($term->get('parent')->getValue()[0]['target_id']),
        ];
      }
    }

    ksort($countries);

    return $countries;
  }

  public function getAllCountriesForRegion(string $region = NULL) {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadByProperties(['vid' => 'phone_number_terms']);
    $countries = [];

    $shortToLongRegionNameMap = [
      'africa' => 'Africa',
      'americas' => 'Americas',
      'asia' => 'Asia',
      'c_eurupe' => 'Central Europe',
      'e_eurupe' => 'Eastern Europe',
      'n_eurupe' => 'Nordic Europe',
    ];

    $region = $shortToLongRegionNameMap[$region] ?? $region;

    foreach ($terms as $term) {
      $is_top_level = $term->get('parent')->getValue()[0]['target_id'] === '0';

      if (!$is_top_level) {
        $term_region = $this->planetCoreTaxonomyService->getTermNameById($term->get('parent')->getValue()[0]['target_id']);

        if ($region !== NULL) {
          if ($region === $term_region) {
            $countries[$term->label()] = [
              'id' => $term->id(),
              'name' => $term->label(),
              'phone' => $term->get('field_enter_phone_number')->value,
              'region' => $term_region,
            ];
          }
        }
        else {
          $countries[$term->label()] = [
            'id' => $term->id(),
            'name' => $term->label(),
            'phone' => $term->get('field_enter_phone_number')->value,
            'region' => $this->planetCoreTaxonomyService->getTermNameById($term->get('parent')->getValue()[0]['target_id']),
          ];
        }
      }
    }

    ksort($countries);

    return $countries;
  }

    public function getAllEmailsForCompany(string $company = NULL) {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadByProperties(['vid' => 'email_contacts_terms']);
    $companies = [];

    $shortToLongCompanyNameMap = [
      'datatrans' => 'Datatrans',
      'hoist' => 'Hoist Group',
      'hoist_pms' => 'Hoist PMS Products',
      'payments_and_taxfree' => 'Payments and Tax Free (Technical)',
      'unified_commers' => 'Planet Unified Commerce',
      'protel' => 'Protel',
      'tax_free' => 'Tax Free (General)',
    ];

    $company = $shortToLongCompanyNameMap[$company] ?? $company;

    foreach ($terms as $term) {
      $is_top_level = $term->get('parent')->getValue()[0]['target_id'] === '0';

      if (!$is_top_level) {
        $term_company = $this->planetCoreTaxonomyService->getTermNameById($term->get('parent')->getValue()[0]['target_id']);

        if ($company !== NULL) {
          if ($company === $term_company) {
            $companies[$term->label()] = [
              'id' => $term->id(),
              'name' => $term->label(),
              'email' => $term->get('field_email')->value,
              'company' => $term_company,
            ];
          }
        }
        else {
          $companies[$term->label()] = [
            'id' => $term->id(),
            'name' => $term->label(),
            'email' => $term->get('field_email')->value,
            'company' => $this->planetCoreTaxonomyService->getTermNameById($term->get('parent')->getValue()[0]['target_id']),
          ];
        }
      }
    }

    ksort($companies);

    return $companies;
  }

  /**
   * Prepare data for location requests.
   *
   * @param array $nids
   *   The location node IDs.
   *
   * @return array
   *   The array containing the data.
   */
  private function prepareLocationsData(array $nids) {
    $locations = $this->entityTypeManager->getStorage('node')->loadMultiple($nids);
    $locations_data = [];
    $langcode  = $this->planetCoreNodeTranslationsService->determineTheLangId();

    foreach ($locations as $location) {
      $location = $location->getTranslation($langcode);
      $address = $location->get('field_address')->getValue();
      $phone = $location->get('field_phone')->getValue();
      $region = $location->get('field_region')->getValue();

      $location_data = [
        'title' => $location->getTitle(),
        'address' => $address,
        'phone' => $phone,
        '$region' => $region,
      ];

      $locations_data[] = $location_data;
    }

    return $locations_data;
  }

}
