<?php

namespace Drupal\planet_core\Service\PlanetCoreMenuService;

use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\Core\Path\CurrentPathStack;
use Drupal\node\Entity\Node;
use Drupal\menu_item_extras\Entity\MenuItemExtrasMenuLinkContentInterface;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;

class PlanetCoreLegalPagesMenuService extends PlanetCoreMenuService {

  /**
   * The current path.
   *
   * @var \Drupal\Core\Path\CurrentPathStack
   */
  private $currentPath;


  /**
   * PlanetHeaderBlockService constructor.
   *
   * @param \Drupal\Core\Menu\MenuLinkTreeInterface $menu_tree
   *   The menu tree service.
   * @param \Drupal\path_alias\AliasManagerInterface $path_alias_manager
   *   The path alias manager.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service
   *  The node translation service.
   * @param \Drupal\Core\Path\CurrentPathStack $current_path
   *  The current path.
   */
  public function __construct(MenuLinkTreeInterface $menu_tree, AliasManagerInterface $path_alias_manager, LanguageManagerInterface $language_manager, PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service, CurrentPathStack $current_path) {
    parent::__construct($menu_tree, $path_alias_manager, $language_manager, $planet_core_node_translations_service);
    $this->currentPath = $current_path;
  }

  /**
   * {@inheritdoc}
   */
  function getMenuLinkData(MenuItemExtrasMenuLinkContentInterface $entity): array {
    $current_path = $this->currentPath->getPath();
    $current_path_alias = $this->pathAliasManager->getAliasByPath($current_path);

    return [
      'title' => $entity->getTitle(),
      'id' => strtolower(str_replace(' ', '-', $entity->getTitle())),
      'url' => $translation_array ?? $entity->getUrlObject()->toString(),
      'weight' => $entity->getWeight(),
      '_blank' => str_starts_with($entity->getUrlObject()->toString(), 'http'),
      'active' => $current_path_alias === $entity->getUrlObject()->toString()
    ];
  }

  public function getMenuData($menu_machine_name, $menu_link_titles_to_skip = []): array {
    $parameters = $this->menuTree->getCurrentRouteMenuTreeParameters($menu_machine_name);
    $tree = $this->menuTree->load($menu_machine_name, $parameters);

    if (empty($tree)) {
      return [];
    }

    $menu_array = [];

    foreach ($tree as $item) {
      $menu_link_content = $item->link;

      if (in_array($menu_link_content->getTitle(), $menu_link_titles_to_skip)) {
        continue;
      }

      $uuid = $menu_link_content->getDerivativeId();
      $entity = \Drupal::service('entity.repository')
        ->loadEntityByUuid('menu_link_content', $uuid);

      $children_ids = $this->getChildrenIds($entity);
      $children = [];

      if (count($children_ids) > 0) {
        foreach($children_ids as $children_id) {
          $item = $this->entityTypeManager->getStorage('menu_link_content')->loadByProperties(
            ['id' => $children_id->id]
          );

          $children[] = $this->getMenuLinkData(array_shift($item));
        }
      }

      $menu_link_array = $this->getMenuLinkData($entity);

      if (count($children) > 0) {
        $menu_link_array['children'] = $children;
      }

      $menu_array[strtolower(str_replace(' ', '-', $entity->getTitle()))] = $menu_link_array;
    }

    if (!empty($menu_array)) {
      usort($menu_array, function ($a, $b) {
        return $a['weight'] <=> $b['weight'];
      });
    }

    return $menu_array;
  }

}