<?php

namespace Drupal\planet_core\Service\PlanetCoreMenuService;

use Drupal;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\menu_item_extras\Entity\MenuItemExtrasMenuLinkContentInterface;
use Drupal\menu_link_content\MenuLinkContentInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;

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
   * The node translation service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface
   */
  public $planetCoreNodeTranslationsService;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  public $entityTypeManager;

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
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   * The entity type manager.
   */
  public function __construct(MenuLinkTreeInterface $menu_tree, AliasManagerInterface $path_alias_manager, LanguageManagerInterface $language_manager, PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service) {
    $this->menuTree= $menu_tree;
    $this->pathAliasManager = $path_alias_manager;
    $this->languageManager = $language_manager;
    $this->planetCoreNodeTranslationsService = $planet_core_node_translations_service;
    $this->entityTypeManager = Drupal::entityTypeManager();
  }

  /**
   * {@inheritDoc}
   */
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
          $item = Drupal::entityTypeManager()->getStorage('menu_link_content')->loadByProperties(
            ['id' => $children_id->id]
          );

          $children[] = $this->getMenuLinkData(array_shift($item));
        }
      }

      $menu_link_array = $this->getMenuLinkData($entity);

      if (count($children) > 0) {
        if (static::doesHaveProductCategoryField($children)) {
          $children = static::categorizeChildren($children);
        };

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

  function getMenuLinkData(MenuItemExtrasMenuLinkContentInterface $entity): array {
    $classes = NULL;

    if (!empty($entity->get('field_megamenu_classes')->getValue())) {
      $classes = $entity->get('field_megamenu_classes')->getValue()[0];
    }

    $icon_path = NULL;
    $product_category = NULL;

    if ($entity->hasField('field_megamenu_icon_path')) {
      $icon_path = $entity->get('field_megamenu_icon_path')?->getValue()[0]['value'] ?? NULL;
    }

    if ($entity->hasField('field_megamenu_product_category')) {
      $product_category = $entity->get('field_megamenu_product_category')?->getValue()[0]['value'] ?? NULL;
    }

    $node_id = $entity?->get('field_page')?->getValue() ? $entity?->get('field_page')?->getValue()[0]['target_id'] : NULL;
    $translated_node = NULL;

    if ($node_id) {
      $node = Node::load($node_id);
      $language = $this->languageManager->getCurrentLanguage()->getId();
      $translation_arr = $this->planetCoreNodeTranslationsService->buildTranslationArrayForNode($node, FALSE);

      if (isset($translation_arr[$language])) {
        if ($language === 'en') {
          $translated_node = [$language => $translation_arr[$language]];
        }
        else {
          $translated_node = [$language => "/$language" . $translation_arr[$language]];
        }
      }
      else {
        $translated_node = ['en' => $translation_arr['en']];
      }
    }

    return [
      'title' => $entity->getTitle(),
      'id' => strtolower(str_replace(' ', '-', $entity->getTitle())),
      'url' => $translated_node ?? ['en' => $entity->getUrlObject()->toString()],
      'weight' => $entity->getWeight(),
      '_blank' => str_starts_with($entity->getUrlObject()->toString(), 'http'),
      'classes' => $classes !== NULL ? $classes['value']: NULL,
      'description' => $entity->getDescription() ?? '',
      'icon_path' => $icon_path,
      'product_category' => $product_category,
    ];
  }


  /**
   * Categorizes children by product category.
   *
   * @param array $children_arr
   *   The array of children menu item data.
   *
   * @return array
   *   The array of categorized children.
   */
  public static function categorizeChildren(array $children_arr) {
    $categories = [];

    foreach ($children_arr as $item) {
      if ($item['product_category'] !== NULL && !in_array($item['product_category'], $categories)) {
        $categories[$item['product_category']] = [];
      }
    }

    $categorized = [];

    foreach ($children_arr as $item) {
      $categorized[$item['product_category']][] = $item;
    }

    return $categorized;
  }

  /**
   * Checks if any of the children have a product category field.
   *
   * @param array $children_arr
   *   The array of children menu item data.
   *
   * @return bool
   *   TRUE if any of the children have a product category field, FALSE otherwise.
   */
  public static function doesHaveProductCategoryField(array $children_arr): bool {
    foreach ($children_arr as $item) {
      if ($item['product_category'] !== NULL) {
        return TRUE;
      }
    }

    return FALSE;
  }

  /**
   * Gets children IDs for a given menu link.
   *
   * @param MenuLinkContentInterface $menu_link
   *   Menu link.
   *
   * @return array
   *   The array of children IDs.
   */
  public function getChildrenIds($menu_link) {
    $query = \Drupal::database()->select('menu_link_content_data', 'mlcd');
    $query->fields('mlcd', ['id']);
    $uuid = $menu_link->get('uuid')->getString();
    $query->where('mlcd.parent = :parent', [':parent' => 'menu_link_content:' . $uuid]);
    $query = $query->execute();

    return $query->fetchAll();
  }


  /**
   * A helper method that retrieves node for a given string representing URL.
   *
   * @param string $url
   *   The URL string.
   *
   * @return \Drupal\node\NodeInterface|null
   *   The node object or NULL if the node was not found.
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
