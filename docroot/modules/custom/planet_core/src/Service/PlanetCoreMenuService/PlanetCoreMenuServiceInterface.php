<?php

namespace Drupal\planet_core\Service\PlanetCoreMenuService;

use Drupal\node\NodeInterface;

interface PlanetCoreMenuServiceInterface {

  /**
   * Prepares an array of menu content for a given menu.
   *
   * @param $menu_machine_name
   *   The machine name of the menu.
   * @param $menu_link_titles_to_skip
   *   An array of menu link titles to skip.
   *
   * @return array
   *   An array of menu content.
   */
  public function getMenuContentArray($menu_machine_name, $menu_link_titles_to_skip = []): array;

  /**
   * Get a node from a given URL.
   *
   * @param string $url
   *   The URL.
   *
   * @return \Drupal\node\NodeInterface|null
   *   The node object or NULL if the node does not exist.
   */
  public function getNodeFromUrl(string $url): ?NodeInterface;
  }