<?php

namespace Drupal\planet_event_pages\Service;

use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;
use Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaService;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Language\LanguageManagerInterface;

class PlanetEventPagesService {

  public PlanetCoreTaxonomyServiceInterface $planetCoreTaxonomyService;
  public PlanetCoreMediaService $planetCoreMediaService;
  protected LanguageManagerInterface $languageManager;

  public function __construct(
    PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service,
    PlanetCoreMediaService $planet_core_media_service,
    LanguageManagerInterface $language_manager
  ) {
    $this->planetCoreTaxonomyService = $planet_core_taxonomy_service;
    $this->planetCoreMediaService = $planet_core_media_service;
    $this->languageManager = $language_manager;
  }

  public function getHeroLabel(string $term_id): string {
    return 'EVENT - ' . strtoupper($this->planetCoreTaxonomyService->getTermNameById($term_id));
  }

  /**
   * Get a list of all Event Locations taxonomy terms.
   *
   * @return array
   *   An array of terms with id and name.
   */
  public function getEventLocations(): array {
    return $this->getTermsByVocabulary('event_location');
  }

  /**
   * Get a list of all Event Categories taxonomy terms.
   *
   * @return array
   *   An array of terms with id and name.
   */
  public function getEventCategories(): array {
    return $this->getTermsByVocabulary('event_categories');
  }

  /**
   * Helper function to get terms from a vocabulary.
   *
   * @param string $vocabulary_id
   *   The machine name of the vocabulary.
   *
   * @return array
   *   An array of terms with id and name.
   */
  protected function getTermsByVocabulary(string $vocabulary_id): array {
    $langcode = $this->languageManager->getCurrentLanguage()->getId();
    $terms = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadTree($vocabulary_id);

    $term_list = [];

    foreach ($terms as $term) {
      // Load full term entity to check for translation
      $term_entity = Term::load($term->tid);
      if ($term_entity && $term_entity->hasTranslation($langcode)) {
        $translated_term = $term_entity->getTranslation($langcode);
        $term_list[] = [
          'id' => $term->tid,
          'name' => $translated_term->getName(),
        ];
      }
      else {
        $term_list[] = [
          'id' => $term->tid,
          'name' => $term->name,
        ];
      }
    }

    return $term_list;
  }
  public function getFeaturedEvent(): array {
    $entityTypeManager = \Drupal::entityTypeManager();
    $langcode = $this->languageManager->getCurrentLanguage()->getId();
    
    $query = $entityTypeManager->getStorage('node')->getQuery();
    
    $query->accessCheck(TRUE)
      ->condition('type', 'events')
      ->condition('status', 1)
      ->condition('field_is_event_featured', 1)
      ->condition('langcode', $langcode)
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
  
 /**
 * Get all events with optional language filtering.
 *
 * @param int $limit
 *   Page size (number of events per page).
 * @param int $offset
 *   Page number.
 * @param array $locationIds
 *   Array of location term IDs to filter by.
 * @param array $categoryIds
 *   Array of category term IDs to filter by.
 * @param string $searchTerm
 *   Text to search in event titles.
 * @param string|null $langcode
 *   Optional language code to filter events by. Default is current language.
 *
 * @return array
 *   Array containing event data and total count.
 */
public function getAllEvents(
  int $limit = 9,
  int $offset = 0,
  array $locationIds = [],
  array $categoryIds = [],
  string $searchTerm = '',
  string $langcode = NULL
): array {
  $entityTypeManager = \Drupal::entityTypeManager();
  
  if ($langcode === NULL) {
    $langcode = $this->languageManager->getCurrentLanguage()->getId();
  }

  // Create the query to get the events (main query with pagination).
  $query = $entityTypeManager->getStorage('node')->getQuery();

  $query->accessCheck(TRUE)
      ->condition('type', 'events')
      ->condition('status', 1)
      ->condition('langcode', $langcode)
      ->sort('created', 'DESC')
      ->pager($limit, $offset);  // Using pager() for pagination

  // Exclude featured events.
  $orGroup = $query->orConditionGroup()
      ->notExists('field_is_event_featured')
      ->condition('field_is_event_featured', '0');
  $query->condition($orGroup);

  if (!empty($locationIds)) {
      $query->condition('field_event_location.target_id', $locationIds, 'IN');
  }

  if (!empty($categoryIds)) {
      $query->condition('field_event_category.target_id', $categoryIds, 'IN');
  }

  // Add search term condition (on title field).
  if (!empty($searchTerm)) {
      $query->condition('title', '%' . \Drupal::database()->escapeLike($searchTerm) . '%', 'LIKE');
  }

  // Execute the query to get the event node ids.
  $nids = $query->execute();

  $events = [];
  $totalCount = 0;

  if (!empty($nids)) {
      $nodes = $entityTypeManager->getStorage('node')->loadMultiple($nids);

      foreach ($nodes as $node) {
          // Pass the language code to getEventData to ensure consistent language usage
          $events[] = $this->getEventData($node, $langcode);
      }

      // Get the total count of matching events (without pagination, just count).
      $totalQuery = $entityTypeManager->getStorage('node')->getQuery();

      $totalQuery->accessCheck(TRUE)
          ->condition('type', 'events')
          ->condition('status', 1)
          ->condition('langcode', $langcode);

      // Exclude featured events in the total count query as well.
      $orGroup = $totalQuery->orConditionGroup()
          ->notExists('field_is_event_featured')
          ->condition('field_is_event_featured', '0');
      $totalQuery->condition($orGroup);

      if (!empty($locationIds)) {
          $totalQuery->condition('field_event_location.target_id', $locationIds, 'IN');
      }

      if (!empty($categoryIds)) {
          $totalQuery->condition('field_event_category.target_id', $categoryIds, 'IN');
      }

      // Apply the search term filter to the total query.
      if (!empty($searchTerm)) {
          $totalQuery->condition('title', '%' . \Drupal::database()->escapeLike($searchTerm) . '%', 'LIKE');
      }

      // Get the total count (without pagination).
      $totalCount = $totalQuery->count()->execute();
  }

  return [
      'events' => $events,
      'total_count' => $totalCount,
      'langcode' => $langcode
  ];
}
  
  /**
 * Get formatted event data from a node with specific language support.
 *
 * @param \Drupal\node\NodeInterface $node
 *   The event node to extract data from.
 * @param string|null $langcode
 *   Optional language code to use for this event data.
 *
 * @return array
 *   Structured array of event data.
 */
public function getEventData($node, string $langcode = NULL): array {
  if (!$node instanceof NodeInterface) {
    return [];
  }
  
  // Use provided language code or fall back to current language
  if ($langcode === NULL) {
    $langcode = $this->languageManager->getCurrentLanguage()->getId();
  }
  
  // Get translation if available
  $node = $node->hasTranslation($langcode) ? $node->getTranslation($langcode) : $node;

  $start_date_raw = $node->get('field_event_start_date')->value;
  $end_date_raw = $node->get('field_event_end_date')->value;

  $date_range = $this->formatDateRange($start_date_raw, $end_date_raw, $langcode);

  $image = $node->get('field_event_image')?->target_id;
  if($image) {
    $image = $this->planetCoreMediaService->getStyledImageUrl($image, 'max_1300x1300');
  } else {
    $image = "";
  }

  $is_featured_event = false;
  if($node->get('field_is_event_featured')) {
    $is_featured_event = (bool) $node->get('field_is_event_featured')->value;
  } 

  return [
    'title' => $node->label() ?? '',
    'url' => $node->toUrl()?->toString() ?? '',
    'start_date' => $start_date_raw ?? '',
    'end_date' => $end_date_raw ?? '',
    'image' => $image ?? '',
    'start_date_formatted' => $date_range['start_date_formatted'] ?? '',
    'end_date_formatted' => $date_range['end_date_formatted'] ?? '',
    'date_range' => $date_range['range_display'] ?? '',
    'event_type' => $this->getTaxonomyTermNames($node, 'field_event_type', $langcode) ?? [],
    'event_industry' => $this->getTaxonomyTermNames($node, 'field_event_category', $langcode) ?? [],
    'event_location' => $this->getTaxonomyTermNames($node, 'field_event_location', $langcode) ?? [],
    'is_featured' => $is_featured_event,
    'langcode' => $langcode ?? '',
  ];
}
  
  /**
   * Build the event date range display string with language support.
   *
   * @param string|null $start_date_raw
   *   Start date in raw Y-m-d format.
   * @param string|null $end_date_raw
   *   End date in raw Y-m-d format.
   * @param string $langcode
   *   The language code to use for date formatting.
   *
   * @return array
   *   Contains start_date_formatted, end_date_formatted, and range_display.
   */
  protected function formatDateRange(?string $start_date_raw, ?string $end_date_raw, string $langcode = NULL): array {
    if (empty($start_date_raw)) {
      return [
        'start_date_formatted' => '',
        'end_date_formatted' => '',
        'range_display' => '',
      ];
    }
  
    if ($langcode === NULL) {
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
    }
  
    $start_date_ts = strtotime($start_date_raw);
    $end_date_ts = $end_date_raw ? strtotime($end_date_raw) : FALSE;
  
    $intl_available = class_exists('\IntlDateFormatter');
  
    if ($intl_available) {
      // Use IntlDateFormatter (full month version)
      $formatter_day = new \IntlDateFormatter(
        $langcode,
        \IntlDateFormatter::NONE,
        \IntlDateFormatter::NONE,
        NULL,
        NULL,
        'd'
      );
  
      $formatter_month = new \IntlDateFormatter(
        $langcode,
        \IntlDateFormatter::NONE,
        \IntlDateFormatter::NONE,
        NULL,
        NULL,
        'MMMM'
      );
  
      $formatter_year = new \IntlDateFormatter(
        $langcode,
        \IntlDateFormatter::NONE,
        \IntlDateFormatter::NONE,
        NULL,
        NULL,
        'yyyy'
      );
  
      $start_day = $formatter_day->format($start_date_ts);
      $start_month = mb_convert_case($formatter_month->format($start_date_ts), MB_CASE_TITLE, 'UTF-8');
      $start_year = $formatter_year->format($start_date_ts);
  
      $end_day = $end_date_ts ? $formatter_day->format($end_date_ts) : NULL;
      $end_month = $end_date_ts ? mb_convert_case($formatter_month->format($end_date_ts), MB_CASE_TITLE, 'UTF-8') : NULL;
      $end_year = $end_date_ts ? $formatter_year->format($end_date_ts) : NULL;
  
    } else {
      // Fallback to PHP date() with English only
      // You can add your own manual translations here if you need to support multiple languages.
      $start_day = date('d', $start_date_ts);
      $start_month = date('F', $start_date_ts); // Full month in English
      $start_year = date('Y', $start_date_ts);
  
      $end_day = $end_date_ts ? date('d', $end_date_ts) : NULL;
      $end_month = $end_date_ts ? date('F', $end_date_ts) : NULL;
      $end_year = $end_date_ts ? date('Y', $end_date_ts) : NULL;
    }
  
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
  

  protected function getTaxonomyTermNames(NodeInterface $node, string $field_name, string $langcode = NULL): array {
    $term_names = [];
    
    // Use provided language code or fall back to current language
    if ($langcode === NULL) {
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
    }
  
    $term_refs = $node->get($field_name)->referencedEntities();
  
    foreach ($term_refs as $term) {
      if ($term instanceof Term) {
        // Use translated term if available
        if ($term->hasTranslation($langcode)) {
          $translated_term = $term->getTranslation($langcode);
          $term_names[] = $translated_term->label();
        }
        else {
          $term_names[] = $term->label();
        }
      }
    }
  
    return $term_names;
  }
}