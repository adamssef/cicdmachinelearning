<?php

namespace Drupal\planet_footer\Service;

use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\node\Entity\Node;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\planet_core\Service\PlanetCoreMenuService\PlanetCoreMenuServiceInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsService;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;
use Drupal\salesforce\Exception;

/**
 * Provides useful methods for working with programmatically created blocks.
 */
class PlanetFooterBlockService implements PlanetFooterBlockServiceInterface {

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
   * The node translation service.
   *
   * @var PlanetCoreNodeTranslationsService
   */
  public $nodeTranslationService;

  /**
   * The menu service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreMenuService\PlanetCoreMenuServiceInterface
   */
  public $menuService;

  /**
   * PlanetFooterBlockService constructor.
   *
   * @param MenuLinkTreeInterface $menu_tree
   *   The menu tree service.
   * @param AliasManagerInterface $path_alias_manager
   *   The path alias manager.
   * @param LanguageManagerInterface $language_manager
   *   The language manager.
   * @param PlanetCoreNodeTranslationsServiceInterface $node_translation_service
   *  The node translation service.
   * @param \Drupal\planet_core\Service\PlanetCoreMenuService\PlanetCoreMenuServiceInterface $menu_service
   */
  public function __construct(MenuLinkTreeInterface $menu_tree, AliasManagerInterface $path_alias_manager, LanguageManagerInterface $language_manager, PlanetCoreNodeTranslationsServiceInterface $node_translation_service, PlanetCoreMenuServiceInterface $menu_service) {
    $this->menuTree = $menu_tree;
    $this->pathAliasManager = $path_alias_manager;
    $this->languageManager = $language_manager;
    $this->nodeTranslationService = $node_translation_service;
    $this->menuService = $menu_service;
  }

  /**
   * {@inheritdoc}
   */
  public function prepareLinksForFooter(): array {
    $main_menu = \Drupal::entityTypeManager()
      ->getStorage('menu_link_content')
      ->loadByProperties(['menu_name' => 'footer', 'enabled' => 1]);

    $child_menus = [];

    foreach ($main_menu as $menu) {
      if ($menu->getParentId() == '') {
        $child_menu = \Drupal::entityTypeManager()
          ->getStorage('menu_link_content')
          ->loadByProperties([
            'menu_name' => 'footer',
            'enabled' => 1,
            'parent' => 'menu_link_content:' . $menu->uuid(),
          ]);

        $child_menus[$menu->getTitle()] = $child_menu;
      }
    }

    $final_child_menus = [];

    foreach ($child_menus as $key => $child_menu) {
      foreach ($child_menu as $child_menu_item) {
        $title = $child_menu_item->getTitle();
        $url = self::prepareUrl($child_menu_item->getUrlObject()->toString());

        $weight = $child_menu_item->getWeight();
        $path = $this->pathAliasManager->getPathByAlias($url, 'en');

        if (
          preg_match('/node\/(\d+)/', $path, $matches) ||
          preg_match('/node\/([a-zA-Z]{2})\/(\d+)/', $path, $matches)
        ) {
          $node = Node::load($matches[1]);

          $final_child_menus[$key][$title] = [
            'title' => $title,
            'url' => $this->nodeTranslationService->buildTranslationArrayForNode($node),
            'weight' => $weight,
            'node' => $node,
          ];
        }

        if (str_contains($url, 'track-my-refund')) {
          $final_child_menus[$key][$title] = [
            'title' => $title,
            'url' => ['en' => 'https://planetpayment/track-my-refund'],
            'weight' => $weight,
            'node' => NULL,
          ];
        }
      }
    }

    return $final_child_menus;
  }

  public function prepareLinksForLegal(): array {
    $menu = \Drupal::entityTypeManager()
      ->getStorage('menu_link_content')
      ->loadByProperties(['menu_name' => 'legal-menu', 'enabled' => 1]);

    $links_array = [];

    foreach ($menu as $menu_item) {
          $title = $menu_item->getTitle();
          $url = self::prepareUrl($menu_item->getUrlObject()->toString());
          $path = $this->pathAliasManager->getPathByAlias($url, 'en');
          $weight = $menu_item->getWeight();

          $links_array[] = $this->prepareItemArray($title, $path, $weight);
    }

    return $links_array;
  }

  private static function prepareUrl(string $url): string {
    $exploded = explode('/', $url);

    if (count($exploded) === 3) {
      $url = '/' . $exploded[2];
    }

    if (count($exploded) === 4 && $exploded[3] === 'track-my-refund') {
      $url = 'https://planetpayment.com/track-my-refund';
    }

    return $url;
  }

  /**
   * Prepare an array of menu content for the legal section.
   *
   * @return array
   *   An array of menu content for the legal section.
   */
  private function prepareItemArray(string $title, string $path, int $weight):array {
    if (
      preg_match('/node\/(\d+)/', $path, $matches) ||
      preg_match('/node\/([a-zA-Z]{2})\/(\d+)/', $path, $matches)
    ) {
      $node = $this->menuService->getNodeFromUrl($path);

      return [
        'title' => $title,
        'url' => $this->nodeTranslationService->buildTranslationArrayForNode($node),
        'weight' => $weight,
        'node' => $node,
      ];
    }

    if (str_contains($path, 'track-my-refund')) {
      return [
        'title' => $title,
        'url' => ['en' => 'https://planetpayment/track-my-refund'],
        'weight' => $weight,
        'node' => NULL,
      ];
    }

    throw new Exception("Could not prepare item array for a given URL.");
  }

}
