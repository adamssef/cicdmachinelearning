<?php

namespace Drupal\planet_menu_node_generator\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\Core\Menu\MenuTreeParameters;
use Drupal\node\Entity\Node;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Logger\LoggerChannelInterface;

/**
 * Class MenuNodeGeneratorService.
 *
 * Handles menu item processing and node creation.
 */
class MenuNodeGeneratorService {

  /**
   * The menu tree service.
   *
   * @var \Drupal\Core\Menu\MenuLinkTreeInterface
   */
  protected $menuTree;

  /**
   * The alias manager service.
   *
   * @var \Drupal\path_alias\AliasManagerInterface
   */
  protected $aliasManager;

  /**
   * The entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The logger service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected $logger;

  /**
   * Constructs a MenuNodeGeneratorService object.
   *
   * @param \Drupal\Core\Menu\MenuLinkTreeInterface $menu_tree
   *   The menu tree service.
   * @param \Drupal\path_alias\AliasManagerInterface $alias_manager
   *   The alias manager service.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $logger_factory
   *   The logger channel factory service.
   */
  public function __construct(
    MenuLinkTreeInterface $menu_tree,
    AliasManagerInterface $alias_manager,
    EntityTypeManagerInterface $entity_type_manager,
    LoggerChannelFactoryInterface $logger_factory
  ) {
    $this->menuTree = $menu_tree;
    $this->aliasManager = $alias_manager;
    $this->entityTypeManager = $entity_type_manager;
    $this->logger = $logger_factory->get('planet_menu_node_generator');
  }

  /**
   * Checks menu items and creates nodes for missing path aliases.
   *
   * @param string $menu_name
   *   The machine name of the menu to process.
   */
  public function checkAndCreateNodes($menu_name) {
    $parameters = (new MenuTreeParameters())->setTopLevelOnly();
    $menu_tree = $this->menuTree->load($menu_name, $parameters);
    $menu_links = $this->menuTree->transform($menu_tree, [], 'menu_link_content');

    foreach ($menu_links as $menu_item) {
      $url_object = $menu_item->link->getUrlObject();
      if (!$url_object->isRouted()) {
        $alias = $menu_item->link->getUrlObject()->toString();;

        if (empty($nids)) {
          $node = Node::create([
            'type' => 'legal_pages',
            'title' => $menu_item->link->getTitle(),
            'path' => ['alias' => $alias],
            'status' => 1,
          ]);
          $node->save();

          $this->logger->notice('Created node for alias: ' . $alias);
        }
      }
    }
  }
}