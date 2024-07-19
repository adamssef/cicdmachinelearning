<?php

namespace Drupal\planet_core\Service\PlanetCoreMenuService;

use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\path_alias\AliasManagerInterface;

/**
 * Provides useful methods for working with programmatically created blocks.
 */
class PlanetCoreMenuService implements PlanetCoreMenuServiceInterface {


  /**
   * The menu tree service.
   *
   * @var \Drupal\Core\Menu\MenuLinkTreeInterface
   */
  public MenuLinkTreeInterface $menuTree;

  /**
   * The path alias manager.
   *
   * @var \Drupal\path_alias\AliasManagerInterface
   */
  protected $pathAliasManager;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  public $languageManager;


  /**
   * PlanetHeaderBlockService constructor.
   *
   * @param \Drupal\Core\Menu\MenuLinkTreeInterface $menu_tree
   *   The menu tree service.
   * @param \Drupal\path_alias\AliasManagerInterface $path_alias_manager
   *   The path alias manager.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   */
  public function __construct(MenuLinkTreeInterface $menu_tree, AliasManagerInterface $path_alias_manager, LanguageManagerInterface $language_manager) {
    $this->menuTree= $menu_tree;
    $this->pathAliasManager = $path_alias_manager;
    $this->languageManager = $language_manager;
  }

  /**
   * {@inheritDoc}
   */
  public function getMenuContentArray($menu_machine_name, $menu_link_titles_to_skip = []): array {
    $parameters = $this->menuTree->getCurrentRouteMenuTreeParameters($menu_machine_name);
    $tree = $this->menuTree->load($menu_machine_name, $parameters);

    if (empty($tree)) {
      return [];
    }

    $menu_link_content_array = [];

    foreach ($tree as $item) {
      $menu_link_content = $item->link;

      if (in_array($menu_link_content->getTitle(), $menu_link_titles_to_skip)) {
        continue;
      }

      $menu_link_content_array[] = [
        'title' => $menu_link_content->getTitle(),
        'url' => $menu_link_content->getUrlObject()->toString(),
        'weight' => $menu_link_content->getWeight(),
      ];

    }

    if (!empty($menu_link_content_array)) {
      usort($menu_link_content_array, function ($a, $b) {
        return $a['weight'] <=> $b['weight'];
      });
    }

    return $menu_link_content_array;
  }

  /**
   * {@inheritDoc}
   */
  public function getNodeFromUrl(string $url): ?NodeInterface {
    if (
      preg_match('/node\/(\d+)/', $url, $matches) ||
      preg_match('/node\/([a-zA-Z]{2})\/(\d+)/', $url, $matches)
    ) {
      return Node::load($matches[1]);
    }

    return NULL;
  }

}
