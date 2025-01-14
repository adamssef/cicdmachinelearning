<?php

namespace Drupal\planet_case_studies\Plugin\EntityReferenceSelection;

use Drupal\Core\Entity\Plugin\EntityReferenceSelection\DefaultSelection;
use Drupal\Component\Utility\Html;

/**
 * Provides custom entity reference selection functionality.
 *
 * @EntityReferenceSelection(
 *   id = "custom",
 *   label = @Translation("Planet Improved Reference Method"),
 *   group = "custom",
 *   weight = 1
 * )
 */
class DefaultSelectionImproved extends DefaultSelection {

  /**
   * {@inheritdoc}
   */
  public function getReferenceableEntities($match = NULL, $match_operator = 'CONTAINS', $limit = 0) {
    $target_type = $this->getConfiguration()['target_type'];

    // Initialize query to build conditions for title or nid matches.
    $query = $this->buildEntityQuery();

    if ($match !== NULL) {
      $entity_type = $this->entityTypeManager->getDefinition($target_type);
      $label_key = $entity_type->getKey('label');
      $id_key = $entity_type->getKey('id');

      // If the match is numeric, add a condition for nid.
      if (is_numeric($match)) {
        $query->condition($id_key, $match, '=');
      } else {
        // Otherwise, match against the title.
        if ($label_key) {
          $query->condition($label_key, $match, $match_operator);
        }
      }
    }

    if ($limit > 0) {
      $query->range(0, $limit);
    }

    $result = $query->execute();

    if (empty($result)) {
      return [];
    }

    $options = [];
    $entities = $this->entityTypeManager->getStorage($target_type)->loadMultiple($result);
    foreach ($entities as $entity_id => $entity) {
      $label = Html::escape($this->entityRepository->getTranslationFromContext($entity)->label() ?? '');
      $options[$entity->bundle()][$entity_id] = $label . ' (' . $entity_id . ')';
    }

    return $options;
  }

}
