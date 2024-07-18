<?php

namespace Drupal\planet_core\Service\PlanetCoreNodeTranslationsService;

use Drupal\node\NodeInterface;

interface PlanetCoreNodeTranslationsServiceInterface {

  /**
   * A helper function builds an array of translations for a node.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The node to build translations for.
   *
   * @return array
   *   An array of translations for the node.
   */
  public function buildTranslationArrayForNode(NodeInterface $node): array;

}
