<?php

namespace Drupal\planet_core\Service\PlanetCoreNodeTranslationsService;

use Drupal\node\NodeInterface;

class PlanetCoreNodeTranslationsService implements PlanetCoreNodeTranslationsServiceInterface {


  /**
   * {@inheritDoc}
   */
  public function buildTranslationArrayForNode(NodeInterface $node): array {
    $node_translations_url = [];

    if ($node) {
      $node_translations = $node->getTranslationLanguages();

      foreach ($node_translations as $langcode => $translation) {
        $node_translations_url[$langcode] = $node->getTranslation($langcode)->toUrl()->toString();
      }
    }

    return $node_translations_url;
  }
}
