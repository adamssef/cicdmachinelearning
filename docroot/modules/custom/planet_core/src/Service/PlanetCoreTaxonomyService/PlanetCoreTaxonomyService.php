<?php

namespace Drupal\planet_core\Service\PlanetCoreTaxonomyService;

use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;
use Drupal\taxonomy\Entity\Term;

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
   * The entity repository.
   *
   * @var \Drupal\Core\Entity\EntityRepositoryInterface
   */
  public $entityRepository;

  /**
   * PlanetPaymentMethodsService constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service
   *   The node translation service.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   * The entity repository.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service, EntityRepositoryInterface $entity_repository) {
    $this->entityTypeManager = $entity_type_manager;
    $this->planetCoreNodeTranslationsService = $planet_core_node_translations_service;
    $this->entityRepository = $entity_repository;
  }

  /**
   * {@inheritDoc}
   */
  public function getTaxonomyTermsArray(string $taxonomy_vocabulary_name): ?array {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')->loadTree($taxonomy_vocabulary_name);
    $curr_langcode = \Drupal::languageManager()->getCurrentLanguage()->getId();

    foreach ($terms as $key=>$term) {
      $term = Term::load($term->tid);
      $taxonomy_term_trans = $this->entityRepository->getTranslationFromContext($term, $curr_langcode);

      if ($taxonomy_term_trans) {
        $term_data[$key] = $taxonomy_term_trans->getName();
      }
      else {
        $term_data[$key] = $term->name;
      }
    }

    return $term_data;
  }

  /**
   * {@inheritDoc}
   */
  public function getNthLevelTaxonomyTermsArray(string $taxonomy_vocabulary_name, int $level = NULL): ?array {
    $terms = $this->entityTypeManager
      ->getStorage('taxonomy_term')->loadTree($taxonomy_vocabulary_name);

    foreach ($terms as $key=>$term) {
      if ($level === NULL) {
        $term_data[$key] = $term->name;
      }
      else {
        if ($term->depth === $level) {
          $term_data[$key] = $term->name;
        }
      }

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
    $terms = $this->entityTypeManager
      ->getStorage('taxonomy_term')
      ->loadByProperties([
        'name' => $term_name,
        'vid' => $vocabulary,
      ]);
    if (!$terms) {
      $translated_string = $this->planetCoreNodeTranslationsService->t2($term_name, [], 'en'); // Specify context if needed

      $terms = $this->entityTypeManager
        ->getStorage('taxonomy_term')
        ->loadByProperties([
          'name' => $translated_string,
          'vid' => $vocabulary,
        ]);
    }

    if (!$terms) {
      // Trying term translation for the current language.
      $curr_langcode = $this->planetCoreNodeTranslationsService->determineTheLangId();
      $terms = $this->entityTypeManager
        ->getStorage('taxonomy_term')
        ->loadByProperties([
          'vid' => $vocabulary,
        ]);

      foreach ($terms as $term) {
        // We are checking here if there are translated versions of a term that matches.
        // This makes this method more robust as it not only relies on current language version.
        $term = Term::load($term->id());
        $translated_term = $this->entityRepository->getTranslationFromContext($term, $curr_langcode);

        if ($translated_term->getName() === $term_name) {
          return $term->id();
        }
      }

      $terms = [];
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
    $term = $this->entityTypeManager
      ->getStorage('taxonomy_term')
      ->load($term_id);

    return $term->getName();
  }

  /**
   * {@inheritDoc}
   */
  function getTermNamesByIdList(array $term_objects): ?array {
    $terms_ids = [];

    foreach ($term_objects as $term) {
      $terms_ids[] = $term->id();
    }

    $terms = $this->entityTypeManager
      ->getStorage('taxonomy_term')
      ->loadMultiple($terms_ids);

    if (empty($terms) || $terms === NULL) {
      return NULL;
    }

    $term_names = [];

    $current_langcode = $this->planetCoreNodeTranslationsService->determineTheLangId();

    if ($current_langcode !== 'en') {
      foreach ($terms as $term) {
        $term = Term::load($term->id());
        $translated_term = $this->entityRepository->getTranslationFromContext($term, $current_langcode);
        $term_names[] = $translated_term->getName();
      }

      return $term_names;
    }
    else {
      foreach ($terms as $term) {
        $term_names[] = $term->getName();
      }
    }

    return $term_names;
  }

}
