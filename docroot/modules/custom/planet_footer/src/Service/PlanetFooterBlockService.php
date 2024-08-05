<?php

namespace Drupal\planet_footer\Service;

use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Url;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
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
   * The current route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;


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
   *  The menu service.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *  The current route match.
   */
  public function __construct(MenuLinkTreeInterface $menu_tree, AliasManagerInterface $path_alias_manager, LanguageManagerInterface $language_manager, PlanetCoreNodeTranslationsServiceInterface $node_translation_service, PlanetCoreMenuServiceInterface $menu_service, RouteMatchInterface $route_match) {
    $this->menuTree = $menu_tree;
    $this->pathAliasManager = $path_alias_manager;
    $this->languageManager = $language_manager;
    $this->nodeTranslationService = $node_translation_service;
    $this->menuService = $menu_service;
    $this->routeMatch = $route_match;
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

    $lang = $this->languageManager->getCurrentLanguage()->getId();

    foreach ($child_menus as $key => $child_menu) {
      foreach ($child_menu as $child_menu_item) {
        if ($child_menu_item->hasTranslation($lang)) {
          $title = $child_menu_item->getTranslation($lang)->getTitle();
        } else {
          $title = $child_menu_item->getTitle();
        }

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
          ];
        }

        if (str_contains($url, 'track-my-refund')) {
          $final_child_menus[$key][$title] = [
            'title' => $title,
            'url' => ['en' => 'https://www.planetpayment.com/track-my-refund'],
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

    $lang = $this->languageManager->getCurrentLanguage()->getId();

    $links_array = [];

    foreach ($menu as $menu_item) {
      if ($menu_item->hasTranslation($lang)) {
        $title = $menu_item->getTranslation($lang)->getTitle();
      } else {
        $title = $menu_item->getTitle();
      }

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
      $url = 'https://www.planetpayment.com/track-my-refund';
    }

    return $url;
  }

  /**
   * {@inheritdoc}
   */
  public function prepareDataForLanguageSwitcher():array {
    $default_language = $this->languageManager->getDefaultLanguage();
    $languages = $this->languageManager->getLanguages();
    $current_lang_id = $this->languageManager->getCurrentLanguage()->getId();
    $lang_url_list = [];
    $is_frontpage = \Drupal::service('path.matcher')->isFrontPage();

    foreach ($languages as $language) {
      // Get the current URL in each language.
      $url = Url::fromRoute('<current>')
        ->setOption('language', $language)->toString();

      // Check if the URL has a translation.
      $has_translation = FALSE;
      if ($node = $this->routeMatch->getParameter('node')) {
        if ($node instanceof NodeInterface) {
          $has_translation = $node->hasTranslation($language->getId());
        }
      }

      // If the page doesn't have a translation, use the English URL as a fallback.
      if (!$has_translation && $language->getId() !== $default_language) {
        $url = Url::fromRoute('<current>')
          ->setOption('language', $default_language)->toString();
      }

      $homepage_url = $language->getId() == "en" ? "/" : "/" . $language->getId();
      $url = $is_frontpage ? $homepage_url : $url;
      $name = $this->pretty_lang_name($language->getId());
      $flag = '/resources/icons/language_switcher/' . $language->getId() . '.png';

      $lang_url_list[$language->getId()] = [
        "url" => $url,
        "name" => $name,
        "flag" => $flag,
        "active" => $has_translation,
      ];
    }

    $current_lang = $lang_url_list[$current_lang_id];

    $lang_arr = [
      '#theme' => 'language_switcher',
      '#data' => [
        'links' => $lang_url_list,
        'current_language' => $current_lang,
        'current_language_shortname' => $current_lang_id,
      ],
      '#attached' => [
        'library' => ['planet_language_switcher/language-switcher'],
      ],
    ];

    return $lang_arr;
  }

  /**
   * {@inheritdoc}
   */
  public function pretty_lang_name($id): string {
    return match ($id) {
      'fr' => 'Français',
      'de' => 'Deutsch',
      'es' => 'Español',
      'it' => 'Italiano',
      default => 'English',
    };
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
        'url' => ['en' => 'https://www.planetpayment.com/track-my-refund'],
        'weight' => $weight,
        'node' => NULL,
      ];
    }

    throw new Exception("Could not prepare item array for a given URL.");
  }

}
