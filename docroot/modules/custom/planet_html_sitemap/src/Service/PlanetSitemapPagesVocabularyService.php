<?php

namespace Drupal\planet_html_sitemap\Service;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\NodeInterface;
use Drupal\path_alias\AliasManagerInterface;

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
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $language_manager;

  /**
   * The entity repository.
   *
   * @var \Drupal\Core\Entity\EntityRepositoryInterface
   */
  protected $entityRepository;

  /**
   * Constructs a new PlanetSitemapPagesVocabularyService object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\path_alias\AliasManager $aliasManager
   *  The alias manager.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *  The language manager.
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *  The entity repository.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    AliasManagerInterface $alias_manager,
    LanguageManagerInterface $language_manager,
    EntityRepositoryInterface $entity_repository
  ) {
    $this->aliasManager = $alias_manager;
    $this->entityTypeManager = $entity_type_manager;
    $this->language_manager = $language_manager;
    $this->entityRepository = $entity_repository;
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

        $taxonomy_term_trans = $this->getTranslatedTerm($term);

        $terms_data[] = [
          'id' => $term->id(),
          'name' => $taxonomy_term_trans->get('name')[0]->value,
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

    $show_missing_items_in_english = $config = \Drupal::config('planet_html_sitemap.settings')
      ->get('show_missing_items_in_english');

    $children_terms_data = [];

    foreach ($terms as $term) {
      $link_value =
        isset($term->get('field_sitemap_page_link')->getValue()[0])
          ? str_replace('internal:', '', $term->get('field_sitemap_page_link')->getValue()[0]['uri'])
          : NULL;

      $node = $this->loadNodeByAlias($link_value);

      $current_language = $this->language_manager
        ->getCurrentLanguage()
        ->getId();

      $taxonomy_term_trans = $this->getTranslatedTerm($term);

      if (is_null($node)) {
        $children_terms_data[] = [
          'id' => $taxonomy_term_trans->id(),
          'name' => $taxonomy_term_trans->get('name')[0]->value,
          'weight' => $taxonomy_term_trans->get('weight')->value,
          'link' => NULL,
          'is_label' => $taxonomy_term_trans->get('field_is_label')->value,
          'parent_id' => $parent_id
        ];
      }
      elseif ($current_language === 'en') {
        $children_terms_data[] = [
          'id' => $taxonomy_term_trans->id(),
          'name' => $taxonomy_term_trans->get('name')[0]->value,
          'weight' => $taxonomy_term_trans->get('weight')->value,
          'link' => $this->getAliasesForNode($node)[$current_language] ?? $node->toUrl()
              ->toString(),
          'is_label' => $taxonomy_term_trans->get('field_is_label')->value,
          'parent_id' => $parent_id
        ];
      }
      else {
        if ($show_missing_items_in_english || $node->hasTranslation($current_language)) {

          $is_current_language_en = $current_language === 'en';

          if ($is_current_language_en) {
            $link = $this->getAliasesForNode($node)[$current_language] ?? $node->toUrl()->toString();
          }
          else {
            $link = '/' . $current_language . $this->getAliasesForNode($node)[$current_language] ?? $node->toUrl()->toString();
          }

          $children_terms_data[] = [
            'id' => $taxonomy_term_trans->id(),
            'name' => $node->getTranslation($current_language)->getTitle(),
            'weight' => $taxonomy_term_trans->get('weight')->value,
            'link' => $link,
            'is_label' => $taxonomy_term_trans->get('field_is_label')->value,
            'parent_id' => $parent_id
          ];
        }
        else {
          continue;
        }
      }

      usort($children_terms_data, function ($a, $b) {
        return $a['weight'] <=> $b['weight'];
      });

    }
    return $children_terms_data;

  }

  public function getTranslatedTerm(EntityInterface $term) {
    return $this->entityRepository->getTranslationFromContext($term,  $this->language_manager->getCurrentLanguage()->getId());
  }

  /**
   * Get all aliases for a node.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The node.
   *
   * @return array
   *   An array of aliases.
   */
  public function getAliasesForNode(NodeInterface $node) {
    $path_alias_manager = \Drupal::service('path_alias.manager');
    $enabled_languages = $this->language_manager->getLanguages(LanguageInterface::STATE_CONFIGURABLE);
    $aliases = [];

    foreach ($enabled_languages as $language) {
      $language_code = $language->getId();
      $this->language_manager->setConfigOverrideLanguage($language);
      $translation = $node->getTranslation($language_code);
      $alias = $path_alias_manager->getAliasByPath('/node/' . $translation->id(), $language_code);
      $aliases[$language_code] = $alias;
    }

    $this->language_manager->setConfigOverrideLanguage(NULL);

    return $aliases;
  }

  /**
   * Load a node by alias.
   *
   * @param string $alias
   *   The alias.
   *
   * @return \Drupal\Core\Entity\EntityInterface
   *   The node or NULL if not found.
   */
  public function loadNodeByAlias($alias) {
    $path = $this->aliasManager->getPathByAlias($alias, 'en');

    if ($path === $alias) {
      $path = $this->aliasManager->getPathByAlias($alias, 'en');
    }

    $language = $this->language_manager->getCurrentLanguage()->getId();

    if (preg_match('/node\/(\d+)/', $path, $matches)) {
      $nid = $matches[1];
      $node = $this->entityTypeManager->getStorage('node')->load($nid);

      if ($node === NULL) {
        return NULL;
      }

      if ($node->hasTranslation($language)) {
        return $node->getTranslation($language);
      }

      return $this->entityTypeManager->getStorage('node')->load($nid);
    }

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

  /**
   * Build a tree of terms from sitemap_pages vocabulary recursively.
   *
   * @param int $termId
   *   The term id.
   *
   * @return array
   *   An array of terms.
   */
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