<?php

namespace Drupal\planet_customer_resources_library\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsService;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;
use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;

class PlanetCustomerResourcesLibraryService {

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  public $entityTypeManager;

  /**
   * The taxonomy service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface
   */
  public $coreTaxonomyService;

  /**
   * The node translations service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface
   */
  public $coreNodeTranslationsService;

  /**
   * PlanetCustomerResourcesLibraryService constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface $core_taxonomy_service
   *   The core taxonomy service.
   * @param \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service
   *  The node translations service.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    PlanetCoreTaxonomyServiceInterface $core_taxonomy_service,
    PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->coreTaxonomyService = $core_taxonomy_service;
    $this->coreNodeTranslationsService = $planet_core_node_translations_service;
  }

  /**
   * Prepare the data array for the resources.
   *
   * @param array $node_ids
   *  The node ids.
   *
   * @return array
   *   The array of resources.
   */
  public function getResourcesDataArray(array $node_ids) {
    $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($node_ids);
    $final_arr = [];

    $map = [
      'LINK' => '/resources/icons/customer_resources_library/arrow.png',
      'DOCUMENTATION' => '/resources/icons/customer_resources_library/gears.png',
      'TRAINING' => '/resources/icons/customer_resources_library/tutorial.png',
      'GUIDE' => '/resources/icons/customer_resources_library/gears.png',
      'USER GUIDE' => '/resources/icons/customer_resources_library/gears.png',
    ];

    foreach ($nodes as $node) {
      $subheading = $node->get('field_sub_heading')->value;
      $download_link = $node->get('field_download_link')->value;

      if ($download_link) {
        $link_explode = explode('/', $download_link);
        $filename = $link_explode[array_key_last($link_explode)];
      } else {
        $filename = NULL;
      }

      $final_arr[$node->id()] = [
        'sub_heading' => $subheading,
        'icon' => $map[$subheading],
        'title' => $node->getTitle(),
        'resource_category' => $this->coreTaxonomyService->getTermNameById($node->get('field_planet_resource_category')->target_id),
        'resource_type' => $this->coreTaxonomyService->getTermNameById($node->get('field_planet_resource_type')->target_id),
        'link' => $node->get('field_link')->uri,
        'description' => $node->get('body')->value,
        'download_link' => $node->get('field_download_link')->value,
        'filename' => $filename,
      ];
    }

    // Sort by title
    uasort($final_arr, function($a, $b) {
      return strcasecmp($a['title'], $b['title']);
    });

    $final_arr = array_values($final_arr);

    return $final_arr;
  }

  /**
   * Retrieves resources by a given category.
   *
   * @param string $category
   *   The category to filter by.
   *
   * @return array
   *   An array of resources.
   */
  public function getResourcesByCategory($category) {
    $category_map = [
      'training' => 'Training on Planet eCampus',
      'terminaldocs' => 'Terminal Documentation',
      'portaldocs' => 'Portal Documentation',
      'links' => 'Useful links',
      'productdocs' => 'Product Documentation',
      'taxfree' => 'Tax Free',
    ];

    $category_tid = strtolower($category) !== "all" ? $this->coreTaxonomyService->getTermIdByTermName($category_map[$category], 'resources_categories') : NULL;
    $current_lang = $this->coreNodeTranslationsService->determineTheLangId();

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'planet_resources')
      ->sort('title', 'ASC')
      ->condition('langcode', $current_lang, '=')
      ->condition('status', TRUE)
      ->accessCheck(FALSE); // Sorting by creation date, adjust as needed

    if ($category_tid !== NULL) {
      $query->condition('field_planet_resource_category', $category_tid);
    }

    $nids = $query->execute();

    return $this->getResourcesDataArray($nids);
  }

  /**
   * Retrieves resources by a given category and text.
   *
   * @param string $category
   *   The category to filter by.
   * @param string $text
   *   The text to filter by.
   *
   * @return array
   *   An array of resources.
   */
  public function getResourcesByCategoryWithText($category, $text) {
    $category_map = [
      'training' => 'Training on Planet eCampus',
      'terminaldocs' => 'Terminal Documentation',
      'portaldocs' => 'Portal Documentation',
      'links' => 'Useful links',
      'productdocs' => 'Product Documentation',
      'taxfree' => 'Tax Free',
    ];

    $category_tid = strtolower($category) !== "all" ? $this->coreTaxonomyService->getTermIdByTermName($category_map[$category], 'resources_categories') : NULL;
    $current_lang = $this->coreNodeTranslationsService->determineTheLangId();

    // Query for title matches
    $title_query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'planet_resources')
      ->condition('langcode', $current_lang, '=')
      ->condition('status', TRUE)
      ->condition('title', '%' . strtolower($text) . '%', 'LIKE')
      ->sort('title', 'ASC')
      ->accessCheck(FALSE);

    // Query for description matches
    $desc_query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'planet_resources')
      ->condition('langcode', $current_lang, '=')
      ->condition('status', TRUE)
      ->condition('body', '%' . strtolower($text) . '%', 'LIKE')
      ->sort('title', 'ASC')
      ->accessCheck(FALSE);

    if ($category_tid !== NULL) {
      $title_query->condition('field_planet_resource_category', $category_tid);
      $desc_query->condition('field_planet_resource_category', $category_tid);
    }

    $title_nids = $title_query->execute();
    $desc_nids = $desc_query->execute();

    // Remove duplicates and preserve order (title matches first)
    $all_nids = array_unique(array_merge($title_nids, $desc_nids));

    return $this->getResourcesDataArray($all_nids);
  }
}
