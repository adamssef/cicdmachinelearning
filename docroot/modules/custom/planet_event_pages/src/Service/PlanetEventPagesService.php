<?php

namespace Drupal\planet_event_pages\Service;

use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;
use Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaService;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;

class PlanetEventPagesService {

  public PlanetCoreTaxonomyServiceInterface $planetCoreTaxonomyService;
  public PlanetCoreMediaService $planetCoreMediaService;

  public function __construct(
    PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service,
    PlanetCoreMediaService $planet_core_media_service
  ) {
    $this->planetCoreTaxonomyService = $planet_core_taxonomy_service;
    $this->planetCoreMediaService = $planet_core_media_service;
  }

  public function getHeroLabel(string $term_id): string {
    return 'EVENT - ' . strtoupper($this->planetCoreTaxonomyService->getTermNameById($term_id));
  }

  public function getFeaturedEvent(): array {
    $entityTypeManager = \Drupal::entityTypeManager();
  
    $query = $entityTypeManager->getStorage('node')->getQuery();
  
    $query->accessCheck(TRUE)
      ->condition('type', 'events')
      ->condition('status', 1)
      ->condition('field_is_event_featured', 1)
      ->sort('created', 'DESC')
      ->range(0, 1);
  
    $nids = $query->execute();
  
    if (!empty($nids)) {
      $nodes = $entityTypeManager->getStorage('node')->loadMultiple($nids);
      $node = reset($nodes); // Get the first node from the array
      return $this->getEventData($node);
    }
  
    return [];
  }
  
  public function getAllEvents(int $page = 0, int $pageSize = 10): array {
    $entityTypeManager = \Drupal::entityTypeManager();

    $query = $entityTypeManager->getStorage('node')->getQuery();
    
    $query->accessCheck(TRUE)
      ->condition('type', 'events')
      ->condition('status', 1)
      ->sort('created', 'DESC');
    
    // Create an OR condition group
    $orGroup = $query->orConditionGroup()
      ->notExists('field_is_event_featured')
      ->condition('field_is_event_featured', '0');
    
    // Attach the condition group to the query
    $query->condition($orGroup);
    
    $nids = $query->execute();
    
    $events = [];
  
    if (!empty($nids)) {
      $nodes = $entityTypeManager->getStorage('node')->loadMultiple($nids);
  
      // Loop through each node and push its event data to the array.
      foreach ($nodes as $node) {
        $events[] = $this->getEventData($node);
      }
    }
  
    return $events;
  }

  public function getEventData($node): array {
    if (!$node instanceof NodeInterface) {
      return [];
    }
  
    $start_date_raw = $node->get('field_event_start_date')->value;
    $end_date_raw = $node->get('field_event_end_date')->value;
  
    $date_range = $this->formatDateRange($start_date_raw, $end_date_raw);
  
    $image = $node->get('field_event_image')?->target_id;
    if($image) {
      $image = $this->planetCoreMediaService->getStyledImageUrl($image, 'large');
    } else {
      $image = "";
    }
    return [
      'title' => $node->label(),
      'url' => $node->toUrl()->toString(),
      'start_date' => $start_date_raw,
      'end_date' => $end_date_raw,
      'image' => $image,
      'start_date_formatted' => $date_range['start_date_formatted'],
      'end_date_formatted' => $date_range['end_date_formatted'],
      'date_range' => $date_range['range_display'],
      'event_type' => $this->getTaxonomyTermNames($node, 'field_event_type'),
      'event_industry' => $this->getTaxonomyTermNames($node, 'field_event_category'),
      'event_location' => $this->getTaxonomyTermNames($node, 'field_event_location'),
      'is_featured' => (bool) $node->get('field_is_event_featured')->value,
    ];
  }
  

  /**
   * Build the event date range display string.
   *
   * @param string|null $start_date_raw
   *   Start date in raw Y-m-d format.
   * @param string|null $end_date_raw
   *   End date in raw Y-m-d format.
   *
   * @return array
   *   Contains start_date_formatted, end_date_formatted, and range_display.
   */

 
  protected function formatDateRange(?string $start_date_raw, ?string $end_date_raw): array {
    if (empty($start_date_raw)) {
      return [
        'start_date_formatted' => '',
        'end_date_formatted' => '',
        'range_display' => '',
      ];
    }

    // Convert raw dates to timestamps.
    $start_date_ts = strtotime($start_date_raw);
    $end_date_ts = $end_date_raw ? strtotime($end_date_raw) : false;

    // Format start and end dates in the desired style.
    $start_day = date('j', $start_date_ts);
    $start_month = date('F', $start_date_ts);
    $start_year = date('Y', $start_date_ts);

    $end_day = $end_date_ts ? date('j', $end_date_ts) : null;
    $end_month = $end_date_ts ? date('F', $end_date_ts) : null;
    $end_year = $end_date_ts ? date('Y', $end_date_ts) : null;

    // Single date (no end date).
    if (!$end_date_ts || $start_date_raw === $end_date_raw) {
      return [
        'start_date_formatted' => "{$start_day} {$start_month} {$start_year}",
        'end_date_formatted' => '',
        'range_display' => "{$start_day} {$start_month} {$start_year}",
      ];
    }

    // Same month and year.
    if ($start_month === $end_month && $start_year === $end_year) {
      return [
        'start_date_formatted' => "{$start_day} {$start_month} {$start_year}",
        'end_date_formatted' => "{$end_day} {$end_month} {$end_year}",
        'range_display' => "{$start_day}-{$end_day} {$start_month} {$start_year}",
      ];
    }

    // Different month or year.
    return [
      'start_date_formatted' => "{$start_day} {$start_month} {$start_year}",
      'end_date_formatted' => "{$end_day} {$end_month} {$end_year}",
      'range_display' => "{$start_day} {$start_month} - {$end_day} {$end_month} {$end_year}",
    ];
  }

  protected function getTaxonomyTermNames(NodeInterface $node, string $field_name): array {
    $term_names = [];

    $term_refs = $node->get($field_name)->referencedEntities();

    foreach ($term_refs as $term) {
      if ($term instanceof Term) {
        $term_names[] = $term->label();
      }
    }

    return $term_names;
  }

}
