<?php

namespace Drupal\planet_core\Service\PlanetCoreTaxonomyService;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;

class PlanetCoreTaxonomyService implements PlanetCoreTaxonomyServiceInterface {

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The node translation service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface
   */
  public $planetCoreNodeTranslationsService;

  /**
   * PlanetPaymentMethodsService constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service
   *   The node translation service.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service) {
    $this->entityTypeManager = $entity_type_manager;
    $this->planetCoreNodeTranslationsService = $planet_core_node_translations_service;
  }

  /**
   * {@inheritDoc}
   */
  public function getTaxonomyTermsArray(string $taxonomy_vocabulary_name): ?array {
    $terms =\Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($taxonomy_vocabulary_name);

    foreach ($terms as $key=>$term) {
      $term_data[$key] = $term->name;
    }

    return $term_data;
  }

  /**
   * Retrieves the taxonomy term ID by its name and vocabulary.
   *
   * @param string $term_name The name of the taxonomy term.
   * @param string $vocabulary The machine name of the vocabulary.
   *
   * @return int|null The taxonomy term ID, or NULL if not found.
   */
  function getTermIdByTermName($term_name, $vocabulary):?int {
    $terms = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties([
        'name' => $term_name,
        'vid' => $vocabulary,
      ]);

    if (!$terms) {
      $translated_string = $this->planetCoreNodeTranslationsService->t2($term_name, [], 'en'); // Specify context if needed

      $terms = \Drupal::entityTypeManager()
        ->getStorage('taxonomy_term')
        ->loadByProperties([
          'name' => $translated_string,
          'vid' => $vocabulary,
        ]);
    }


    // If there are any terms, return the first one's ID.
    if ($terms) {
      $term = reset($terms);
      return $term->id();
    }

    return NULL;
  }

  /**
   * Get the term name by its ID.
   *
   * @param int $term_id
   *   The term ID.
   *
   * @return ?string
   *   The term name, null otherwise.
   */
  function getTermNameById($term_id):?string {
    $term = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->load($term_id);

    return $term->getName();
  }

}
