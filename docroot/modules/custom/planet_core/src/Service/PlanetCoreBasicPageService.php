<?php
namespace Drupal\planet_core\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\NodeInterface;
use Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface;

/**
 * Class PlanetCoreBasicPageService - a helper class for page-related functionalities.
 */
class PlanetCoreBasicPageService {

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The media service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface
   */
  public $planetCoreMediaService;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * Constructs a new PlanetCorePageService object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   * @param \Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface $planet_core_media_service
   *   The media service.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager service.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    PlanetCoreMediaServiceInterface $planet_core_media_service,
    LanguageManagerInterface $language_manager
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->planetCoreMediaService = $planet_core_media_service;
    $this->languageManager = $language_manager;
  }

  /**
   * Retrieves paragraph fields data from a page node.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The node object of the page.
   *
   * @return array
   *   An array of paragraph field data.
   */
  public function getPageParagraphData(NodeInterface $node) {
    if ($node->getType() !== 'page') {
      return [];
    }

    $langcode = $this->languageManager->getCurrentLanguage()->getId();
    $node = $node->hasTranslation($langcode) ? $node->getTranslation($langcode) : $node;
    
    $paragraphs = $node->field_product_page_layout->referencedEntities();
    $paragraph_data = [];

    if (!empty($paragraphs)) {
      foreach ($paragraphs as $paragraph) {
        // Get translated version of paragraph if available
        if ($paragraph->hasTranslation($langcode)) {
          $paragraph = $paragraph->getTranslation($langcode);
        }

        $fields = $paragraph->getFields();
        $field_data = [];

        // Process each field in the paragraph
        foreach ($fields as $field_name => $field) {
          $field_data[$field_name] = $field->getValue();

          // Check if this is the hero image field and add the styled URL
          if ($field_name === 'field_hero_image' && !empty($field_data[$field_name][0]['target_id'])) {
            $media_id = $field_data[$field_name][0]['target_id'];
            $field_data['hero_image_url'] = $this->planetCoreMediaService->getStyledImageUrl($media_id, 'max_1300x1300');
          }
        }

        $paragraph_data[] = [
          'type' => $paragraph->bundle(),
          'fields' => $field_data,
        ];
      }
    }

    return $paragraph_data;
  }
}