<?php

namespace Drupal\planet_partners_pages\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Drupal\path_alias\AliasManagerInterface;

/**
 * Class PlanetCoreService - a helper class for article-related functionalities.
 */
class PlanetCorePartnersService
{

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected $fileUrlGenerator;

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
  protected $languageManager;


  /**
   * Constructs a new PlantCoreService object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $file_url_generator
   *  The file url generator service.
   * @param \Drupal\path_alias\AliasManagerInterface $path_alias_manager
   *   The path alias manager service.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    FileUrlGeneratorInterface $file_url_generator,
    AliasManagerInterface $path_alias_manager,
    LanguageManagerInterface $language_manager,
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->fileUrlGenerator = $file_url_generator;
    $this->pathAliasManager = $path_alias_manager;
    $this->languageManager = $language_manager;
  }

  /**
   * Truncates a string to the given length.
   *
   * @param string $text
   *   The string to truncate.
   * @param int $maxLength
   *   The maximum length of the truncated string.
   * @param string $suffix
   *   The suffix to append to the truncated string. '...' by default.
   *
   * @return string
   *   The truncated string.
   */
  public function truncateText($text, $maxLength, $suffix = '...')
  {
    if (mb_strlen($text) <= $maxLength) {
      return $text;
    } else {
      $truncatedText = mb_substr($text, 0, $maxLength) . $suffix;

      // Remove trailing spaces if the last character is a space.
      return rtrim($truncatedText);
    }
  }

  public function pretty_taxonomies_lists($taxonomy_list) {
    $pretty_taxonomies = [];
    foreach ($taxonomy_list as $tag) {
      $tag_name = $tag->getName();
      $tag_id = $tag->id();
      $pretty_taxonomies[] = [
        'name' => $tag_name,
        'id' => $tag_id,
      ];
    }
    return $pretty_taxonomies;
  }

  

  public function getPublishedPartners()
  {
    $offset = \Drupal::request()->get('offset');
    $limit = \Drupal::request()->get('limit');
    $lang = \Drupal::request()->get('lang');
    $search = \Drupal::request()->get('search');
    $featured = \Drupal::request()->get('featured');
    $type = \Drupal::request()->get('type');
    $industry = \Drupal::request()->get('industry');
    $product = \Drupal::request()->get('product');
    $region = \Drupal::request()->get('region');

    // Get the current page language code.
    $language_code = $lang;
    $is_featured = $featured == true ? '=' : '!=';

    // Initialize arrays to store data.
    $articles = [];

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'partners')
      ->condition('status', 1)
      ->condition('langcode', $language_code) // Filter by language code.
      ->range($offset, $limit)
      ->accessCheck();

    $total_count = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'partners')
      ->condition('status', 1)
      ->condition('langcode', $language_code) // Filter by language code.
      ->accessCheck();

    if (($type !== null) && ($type != "all")) {
      $query->condition('field_partner_type', $type);
      $total_count->condition('field_partner_type', $type);
    }

    if (($product !== null) && ($product != "all")) {
      $query->condition('field_product_type_tax', $product);
      $total_count->condition('field_product_type_tax', $product);
    }

    if (($region !== null) && ($region != "all")) {
      $query->condition('field_region_tax', $region);
      $total_count->condition('field_region_tax', $region);
    }

    if (($industry !== null) && ($industry != "all")) {
      $query->condition('field_industry_tax', $industry);
      $total_count->condition('field_industry_tax', $industry);
    }

    // Add the 'field_year' condition only if $year is not null
    if ($featured) {
      $query->condition('field_is_featured', 1, $is_featured);
      $total_count->condition('field_is_featured', 1, $is_featured);
    }

    if ($search) {
      $query->condition('title', $search, 'CONTAINS');
      $total_count->condition('title', $search, 'CONTAINS');
    }

    // Executing queries
    $query = $query->execute();
    $total_count = $total_count->execute();

    $total_count = count($total_count);
    $resource_nids = array_values($query);
    $resource_nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($resource_nids);

    foreach ($resource_nodes as $node) {
      // Load the node in the current language.
      $node = $node->getTranslation($language_code);
      $title = $node->get('title')->value;
      $body = $node->get('body')->value;
      $bg_color = $node->get('field_partner_background_color')->value;
      $is_new = $node->get('field_is_new')->value;
      $is_coming_soon = $node->get('field_coming_soon')->value;
      $url = $this->getAliasesInOtherLanguages($node->id(), $language_code);

      // Get Background Image (field_resources_background_image).
      $background_image_media = $node->get('field_partner_logo')->entity;
      $background_image_url = '';

      if ($background_image_media instanceof Media) {
        $background_image_file = $background_image_media->get('field_media_image')->entity;

        if ($background_image_file instanceof File) {
          $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
        }
      }

      $industry_references_taxs = [];
      $field_partner_type_taxs = [];
      $field_product_type_taxs = [];
      $field_region_taxs = [];

      $industry_references = $node->get('field_industry_tax')->referencedEntities();
      $field_partner_type = $node->get('field_partner_type')->referencedEntities();
      $field_product_type = $node->get('field_product_type_tax')->referencedEntities();
      $field_region = $node->get('field_region_tax')->referencedEntities();

      $industry_references_taxs = $this->pretty_taxonomies_lists($industry_references);
      $field_partner_type_taxs = $this->pretty_taxonomies_lists($field_partner_type);
      $field_product_type_taxs = $this->pretty_taxonomies_lists($field_product_type);
      $field_region_taxs = $this->pretty_taxonomies_lists($field_region);

      $articles[] = [
        'tags' => $industry_references_taxs,
        'url' => $url,
        'title' => $title,
        'body' => $this->truncateText($body, 130),
        'is_new' => (int)$is_new,
        'is_coming_soon' => (int)$is_coming_soon,
        'bg_color' => $bg_color ? $bg_color : "white",
        'logo' => $background_image_url,
      ];
    }

    return [
      'featured' => $featured,
      'articles' => $articles,
      'articles_count' => $total_count,
      'articles_finished' => (count($articles) >= $total_count),
    ];
  }

  public function getPartnersTaxonomy($vid = false)
  {

    if (!$vid) {
      return;
    }

    // Get the current page language code.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => $vid]);
    $result = [];
    foreach ($terms as $term) {
      $result[] = [
        'id' => $term->id(),
        'name' => $term->getName(),
      ];
    }
    return $result;
  }

  /**
   * Gets aliases in other languages for the given English alias.
   *
   * @param string $englishAlias
   *   The English alias.
   *
   * @return string
   *   A string consisting of language prefix and path alias.
   */
  public function getAliasesInOtherLanguages($node_id, $langcode = false)
  {
    $path = '/node/' . (int) $node_id;

    if (!$langcode) {
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
    }
    $path_alias = $this->pathAliasManager->getAliasByPath($path, $langcode);

    $lang_prefix = $langcode != "en" ? "/" . $langcode : "";
    return $lang_prefix . $path_alias;
  }

  function getSinglePartnerData($node_id)
  {
    global $base_url;

    // Get the current page language code.
    $language_code = $this->languageManager->getCurrentLanguage()->getId();

    // Load the node in the current language.
    $node = Node::load($node_id);

    if ($node->hasTranslation($language_code)) {
      $node = $node->getTranslation($language_code);
    }

    $title = $node->get('title')->value;
    $bg_color = $node->get('field_partner_background_color')->value;
    $website = $node->get('field_website')->value;
    $integrated_products = $node->get('field_integrated_products')->value;
    $yt_video = $node->get('field_youtube_video')->value;
    $body = $node->get('body')->value;

    $url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());
    $url = $language_code != "en" ? "/" . $language_code . $url : $url;

    if ($node->get('field_partner_logo')) {
      // Get Background Image (field_resources_background_image)
      $background_image_media = $node->get('field_partner_logo')->entity;

      if ($background_image_media instanceof \Drupal\media\Entity\Media) {
        $background_image_file = $background_image_media->get('field_media_image')->entity;

        if ($background_image_file instanceof \Drupal\file\Entity\File) {
          $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
        }
      }
    }

    if ($node->get('field_featured_image')) {
      // Get Background Image (field_resources_background_image)
      $featured_image = $node->get('field_featured_image')->entity;

      if ($featured_image instanceof \Drupal\media\Entity\Media) {
        $featured_image = $featured_image->get('field_media_image')->entity;

        if ($featured_image instanceof \Drupal\file\Entity\File) {
          $featured_image = $this->fileUrlGenerator->generateAbsoluteString($featured_image->getFileUri());
        }
      }
    }

    $industry_refs = $node->get('field_industry_tax')->referencedEntities();
    $industry_taxs_pretty = $this->pretty_taxonomies_lists($industry_refs);

    $partner_type_refs = $node->get('field_partner_type')->referencedEntities();
    $partner_type_taxs_pretty = $this->pretty_taxonomies_lists($partner_type_refs);

    $product_type_refs = $node->get('field_product_type_tax')->referencedEntities();
    $product_type_taxs_pretty = $this->pretty_taxonomies_lists($product_type_refs);

    $region_refs = $node->get('field_region_tax')->referencedEntities();
    $region_taxs_pretty = $this->pretty_taxonomies_lists($region_refs);


    $article = array(
      "title" => $title,
      "body" => $body,
      'url' => $url,
      'background_image' => $background_image_url,
      'featured_image' => $featured_image,
      'yt_video' => $yt_video,
      'bg_color' => $bg_color,
      'industry' => $industry_taxs_pretty,
      'integrated_products' => $integrated_products,
      'partner_types' => $partner_type_taxs_pretty,
      'product_types' => $product_type_taxs_pretty,
      'regions' => $region_taxs_pretty,
      'website' => $website
    );

    return $article;
  }


}