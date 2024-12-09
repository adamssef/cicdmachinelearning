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
  public function buildTranslationArrayForNode(NodeInterface $node): ?array;

  public function getNodeByPathAlias(string $alias): ?NodeInterface;

  /**
   * A function that can translate a string to a given language.
   *
   * @param string $string
   *   String to be translated.
   *
   * @return ?string
   *   The translated string null otherwise
   */
  public function t2(string $string, array $args = [], string $langcode = 'en'): string;

  /**
   * A function that can determine the language id.
   *
   * @return string
   *   The language id.
   */
  public function determineTheLangId(): string;
}