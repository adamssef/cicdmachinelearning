<?php

namespace Drupal\planet_core\Service\PlanetCoreNodeService;

interface PlanetCoreNodeServiceInterface {

  /**
   * Load content by title.
   *
   * @param string $title
   *   The title of the content.
   * @param string $content_type
   *   The content type of the content.
   *
   * @return int
   *   The node ID of the content.
   */
  public function getNodeIdByTitleAndContentType($title, $content_type): int;

}