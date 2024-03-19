<?php

namespace Drupal\planet_html_sitemap\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\path_alias\AliasManagerInterface;
use SplQueue;

/**
 * Class PlanetSitemapPagesVocabularyService - a utility service.
 *
 * We need a helper class that will support performing operations on sitemap_pages vocabulary.
 */
class PlanetSitemapPagesVocabularyService {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The alias manager.
   *
   * @var \Drupal\path_alias\AliasManager
   */
  protected $aliasManager;

  /**
   * Constructs a new PlanetSitemapPagesVocabularyService object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\path_alias\AliasManager $aliasManager
   *  The alias manager.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    AliasManagerInterface $alias_manager
  ) {
    $this->aliasManager = $alias_manager;
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * Get all terms from sitemap_pages vocabulary.
   *
   * @return array
   *   An array of terms.
   */
  public function getAllTerms() {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')
      ->loadByProperties(['vid' => 'sitemap_pages']);;
    foreach ($terms as $term) {
      $term_data[] = [
        'id' => $term->tid,
        'name' => $term->name
      ];
    }

    return $term_data;
  }

  /**
   * Get all root terms from sitemap_pages vocabulary.
   *
   * @return array
   *   An array of root terms.
   */
  public function getAllRootTerms() {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')
      ->loadByProperties(['vid' => 'sitemap_pages']);

    $terms_data = [];
    foreach ($terms as $term) {
      if ($term->get('parent')->getValue()[0]['target_id'] === "0") {
        $link_value = isset($term->get('field_sitemap_page_link')->getValue()[0]) ? str_replace('internal:', '', $term->get('field_sitemap_page_link')->getValue()[0]['uri']) : NULL;

        $terms_data[] = [
          'id' => $term->id(),
          'name' => $term->get('name')->value,
          'weight' => $term->get('weight')->value,
          'link' => $link_value,
          'is_label' => $term->get('field_is_label')->value
        ];

        usort($terms_data, function ($a, $b) {
          return $a['weight'] <=> $b['weight'];
        });
      }
    }

    return $terms_data;
  }


  /**
   * Get all children terms from sitemap_pages vocabulary.
   *
   * @param int $parent_id
   *   The parent term id.
   *
   * @return array
   *   An array of children terms.
   */
  public function getChildrenTerms($parent_id) {
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')
      ->loadByProperties(['parent' => $parent_id]);

    $children_terms_data = [];

    foreach ($terms as $term) {
      $link_value = isset($term->get('field_sitemap_page_link')->getValue()[0]) ? str_replace('internal:', '', $term->get('field_sitemap_page_link')->getValue()[0]['uri']) : NULL;

      // Check if node with this alias exists.
      if ($link_value) {
        $node = $this->loadNodeByAlias($link_value);

        if (empty($node)) {
          continue;
        }
      }

      $children_terms_data[] = [
        'id' => $term->id(),
        'name' => $term->get('name')->value,
        'weight' => $term->get('weight')->value,
        'link' => $link_value,
        'is_label' => $term->get('field_is_label')->value,
        'parent_id' => $parent_id
      ];
    }

    usort($children_terms_data, function ($a, $b) {
      return $a['weight'] <=> $b['weight'];
    });

    return $children_terms_data;
  }

  public function loadNodeByAlias($alias) {
    // Convert path alias to system path.
    $path = $this->aliasManager->getPathByAlias($alias);

    if (preg_match('/node\/(\d+)/', $path, $matches)) {
      // Load the node if it's a node path.
      $nid = $matches[1];
      return $this->entityTypeManager->getStorage('node')->load($nid);
    }

    // Return NULL if no node is found.
    return NULL;
  }

  /**
   * Build a tree of terms from sitemap_pages vocabulary.
   *
   * As this is recursive function be careful with the number of terms in the vocabulary.
   * It may influence the performance of a website.
   *
   * @return array
   *   An array of terms.
   */
  public function buildTree() {
    $parents = $this->getAllRootTerms();
    $tree = [];

    foreach ($parents as $parent) {
      $tree[$parent['id']] = $parent;
      $tree[$parent['id']]['children'] = $this->buildTreeRecursively($parent['id']);
    }

    return $tree;
  }

  private function buildTreeRecursively($termId) {
    $children = $this->getChildrenTerms($termId);
    $tree = [];

    foreach ($children as $child) {
      $tree[$child['id']] = $child;
      $tree[$child['id']]['children'] = $this->buildTreeRecursively($child['id']);
    }

    return $tree;
  }

}