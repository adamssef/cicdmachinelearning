<?php

namespace Drupal\planet_core\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\node\NodeInterface;

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
   * Constructs a new PlanetCorePageService object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager
  ) {
    $this->entityTypeManager = $entity_type_manager;
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

    $paragraphs = $node->field_product_page_layout->referencedEntities();
    $paragraph_data = [];

    if (!empty($paragraphs)) {
      foreach ($paragraphs as $paragraph) {
        $fields = $paragraph->getFields();
        $field_data = [];

        foreach ($fields as $field_name => $field) {
          $field_data[$field_name] = $field->getValue();
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