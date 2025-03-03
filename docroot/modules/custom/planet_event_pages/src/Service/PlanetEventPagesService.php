<?php

namespace Drupal\planet_event_pages\Service;

use Drupal\planet_core\Service\PlanetCoreTaxonomyService;
use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;

class PlanetEventPagesService {

  /**
   * The node translation service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface
   */
  public PlanetCoreTaxonomyServiceInterface $planetCoreTaxonomyService;

  /**
   * Constructs a new PlanetEventPagesService object.
   *
   * @param PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service
   *   The taxonomy service.
   */
  public function __construct(PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service) {
    $this->planetCoreTaxonomyService = $planet_core_taxonomy_service;
  }
  
  /**
   * Get the hero label for the event page.
   *
   * @param string $term_id
   *   The term id.
   *
   * @return string
   *   The hero label.
   */
  public function getHeroLabel(string $term_id) {
    return 'EVENT - ' . strtoupper($this->planetCoreTaxonomyService->getTermNameById($term_id));
  }

}