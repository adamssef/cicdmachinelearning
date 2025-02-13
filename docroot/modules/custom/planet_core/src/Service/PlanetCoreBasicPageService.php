<?php
namespace Drupal\planet_core\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\NodeInterface;
use Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsService;
use Drupal\path_alias\AliasManagerInterface;

class PlanetCoreBasicPageService {

  protected $entityTypeManager;
  public $planetCoreMediaService;
  protected $languageManager;
  protected $pathAliasManager;
  public $nodeTranslationService;

  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    PlanetCoreMediaServiceInterface $planet_core_media_service,
    LanguageManagerInterface $language_manager,
    AliasManagerInterface $path_alias_manager,
    PlanetCoreNodeTranslationsService $nodeTranslationsService
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->planetCoreMediaService = $planet_core_media_service;
    $this->languageManager = $language_manager;
    $this->pathAliasManager = $path_alias_manager;
    $this->nodeTranslationService = $nodeTranslationsService;
  }

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
            $paragraph_data[] = $this->extractParagraphData($paragraph, $langcode);
        }
    }

    return $paragraph_data;
}

/**
 * Extracts data from a paragraph entity, including translations, media URLs, buttons, and nested paragraphs.
 */
private function extractParagraphData($paragraph, $langcode) {
    if ($paragraph->hasTranslation($langcode)) {
        $paragraph = $paragraph->getTranslation($langcode);
    }

    $fields = $paragraph->getFields();
    $field_data = [];

    foreach ($fields as $field_name => $field) {
        $field_data[$field_name] = $field->getValue();

        // Process Hero Image
        if ($field_name === 'field_hero_image' && !empty($field_data[$field_name][0]['target_id'])) {
            $media_id = $field_data[$field_name][0]['target_id'];
            $field_data['hero_image_url'] = $this->planetCoreMediaService->getStyledImageUrl($media_id, 'max_1300x1300');
        }

        // Process Brands Carousel
        if ($field_name === 'field_brands_carousel' && !empty($field_data[$field_name][0]['value'])) {
            $field_data[$field_name] = explode(' ', trim($field_data[$field_name][0]['value']));
        }

        // Process Hero Form
        if ($field_name === 'field_hero_form' && !$paragraph->get('field_hero_form')->isEmpty()) {
            $webform_id = $paragraph->get('field_hero_form')->target_id;
            $form = \Drupal::entityTypeManager()
                ->getStorage('webform')
                ->load($webform_id)
                ->getSubmissionForm();
            $field_data[$field_name] = $form;
        }

        if (in_array($field_name, ['field_button_1_link', 'field_button_2_link', 'field_button_url']) && !empty($field_data[$field_name][0]['uri'])) {
          $uri = $field_data[$field_name][0]['uri'];
      
          if (strpos($uri, 'entity:node/') === 0) {
              // Convert internal node paths to proper aliases
              $node_id = str_replace('entity:node/', '', $uri);
              $linked_node = $this->entityTypeManager->getStorage('node')->load($node_id);
              if ($linked_node) {
                  $aliases = $this->nodeTranslationService->buildTranslationArrayForNode($linked_node);
                  $field_data[$field_name][0]['alias'] = $aliases[$langcode] ?? $uri;
              }
          } else {
              // Ensure the path starts with a slash before resolving aliases
              $internal_path = '/' . ltrim($uri, '/');
              $field_data[$field_name][0]['alias'] = $this->pathAliasManager->getAliasByPath($internal_path, $langcode);
          }
      }
      

        // Process Nested Benefit Boxes
        if ($field_name === 'field_benefit_box' && !$paragraph->get('field_benefit_box')->isEmpty()) {
            $child_paragraphs = $paragraph->get('field_benefit_box')->referencedEntities();
            $child_data = [];

            foreach ($child_paragraphs as $child_paragraph) {
                $child_data[] = $this->extractParagraphData($child_paragraph, $langcode);
            }

            $field_data['field_benefit_box'] = $child_data;
        }
    }

    return [
        'type' => $paragraph->bundle(),
        'fields' => $field_data,
    ];
}

  
}