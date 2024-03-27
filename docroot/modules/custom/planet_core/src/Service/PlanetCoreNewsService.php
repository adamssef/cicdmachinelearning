<?php

namespace Drupal\planet_core\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Drupal\path_alias\AliasManagerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class PlanetCoreService - a helper class for article-related functionalities.
 */
class PlanetCoreNewsService {

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
  public function truncateText($text, $maxLength, $suffix = '...') {
    if (mb_strlen($text) <= $maxLength) {
      return $text;
    } else {
      $truncatedText = mb_substr($text, 0, $maxLength) . $suffix;

      // Remove trailing spaces if the last character is a space.
      return rtrim($truncatedText);
    }
  }


  public function getLastPublishedArticle() {
    // Get the current page language code.
    $language_code = $this->languageManager->getCurrentLanguage()->getId();

    // Query for the last published article.
    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('status', 1) // 1 represents published nodes.
      ->condition('type', 'resources') // Adjust to your content type name.
      ->condition('field_promoted_resource', 1) // Filter by field_promoted_resource being true.
      ->condition('langcode', $language_code) // Filter by language code.
      ->sort('field_resources_published_time', 'DESC') // Sort by field_resources_published_time in descending order.
      ->accessCheck()
      ->range(0, 1); // Limit the result to 1 article.


    $nids = $query->execute();

    $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($nids);

    foreach ($nodes as $node) {
      $node = $node->getTranslation($language_code);

      // Get node fields and prepare data.
      $title = $node->get('title')->value;
      $url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());
      $url = $language_code != "en" ? "/" . $language_code . $url : $url;
      $article_tags = [];
      $author_name = "";
      $author_url = "";
      $author_photo = "";
      $background_image_url = "";

      // Get Tags (field_resources_tags).
      $tags_references = $node->get('field_resources_tags')->referencedEntities();

      foreach ($tags_references as $tag) {
        $tag_name = $tag->getName();
        $tag_id = $tag->id();
        $article_tags[] = [
          'name' => $tag_name,
          'id' => $tag_id,
        ];
      }

      // Get Author information.
      $author_id = $node->get('field_author')->target_id;

      if ($author_id) {
        // Load the author node.
        $author = Node::load($author_id);

        if ($author instanceof Node && $author->getType() == 'author') {
          $author_name = $author->getTitle();
          $mid = $author->get('field_profile_picture')->getValue()[0]['target_id'];
          $media = Media::load($mid);
          $fid = $media->field_media_image->target_id;
          $file = File::load($fid);
          $author_photo = $this->fileUrlGenerator->generateAbsoluteString($file->getFileUri());
          $author_url = $author->toUrl()->toString();
        }
      }

      // Get Background Image (field_resources_background_image).
      $background_image_media = $node->get('field_resources_background_image')->entity;

      if ($background_image_media instanceof Media) {
        $background_image_file = $background_image_media->get('field_media_image')->entity;

        if ($background_image_file instanceof File) {
          $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
        }
      }

      // Get Creation Date.
      $custom_timestamp = $node->get('field_resources_published_time')->value;
      $creation_date = date('F j, Y', $custom_timestamp);

      // Get the summary/excerpt of the body field.
      $body_summary = $node->get('field_resources_subtitle')->value;
      $body_summary = $body_summary ? $this->truncateText($body_summary, 250) : "";

      $title = $this->truncateText($title, 90);

      // Return a single article.
      return [
        'url' => $url,
        'title' => $title,
        'background_image' => $background_image_url,
        'creation_date' => $creation_date,
        'tags' => $article_tags,
        'body' => $body_summary,
        'author' => [
          'full_name' => $author_name,
          'url' => $author_url,
          'profile_picture' => $author_photo,
        ],
      ];
    }

    // Return null if no articles are found.
    return null;
  }


  public function getLastPublishedNews() {
    // Get the current page language code.
    $language_code = $this->languageManager->getCurrentLanguage()->getId();

    // Query for the last published article.
    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('status', 1) // 1 represents published nodes.
      ->condition('type', 'newsroom') // Adjust to your content type name.
      ->condition('field_promoted_resource', 1) // Filter by field_promoted_resource being true.
      ->condition('field_is_it_an_external_article', false) // Include only nodes where field_resources_published_time is not empty
      ->condition('langcode', $language_code) // Filter by language code.
      ->sort('field_resources_published_time', 'DESC') // Sort by field_resources_published_time in descending order.
      ->accessCheck()
      ->range(0, 1); // Limit the result to 1 article.


    $nids = $query->execute();

    $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($nids);

    foreach ($nodes as $node) {
      $node = $node->getTranslation($language_code);

      // Get node fields and prepare data.
      $title = $node->get('title')->value;
      $url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());
      $url = $language_code != "en" ? "/" . $language_code . $url : $url;
      $article_tags = [];
      $background_image_url = "";

      // Get Tags (field_resources_tags).
      $tags_references = $node->get('field_resources_tags')->referencedEntities();

      foreach ($tags_references as $tag) {
        $tag_name = $tag->getName();
        $tag_id = $tag->id();
        $article_tags[] = [
          'name' => $tag_name,
          'id' => $tag_id,
        ];
      }

      // Get Background Image (field_resources_background_image).
      $background_image_media = $node->get('field_resources_background_image')->entity;

      if ($background_image_media instanceof Media) {
        $background_image_file = $background_image_media->get('field_media_image')->entity;

        if ($background_image_file instanceof File) {
          $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
        }
      }

      // Get Creation Date.
      $custom_timestamp = $node->get('field_resources_published_time')->value;
      $creation_date = date('F j, Y', $custom_timestamp);

      // Get the summary/excerpt of the body field.
      $body_summary = $node->get('field_resources_subtitle')->value;
      $body_summary = $body_summary ? $this->truncateText($body_summary, 250) : "";

      $title = $this->truncateText($title, 90);

      // Return a single article.
      return [
        'url' => $url,
        'title' => $title,
        'background_image' => $background_image_url,
        'creation_date' => $creation_date,
        'tags' => $article_tags,
        'body' => $body_summary,
      ];
    }

    // Return null if no articles are found.
    return null;
  }


  public function getPublishedNews($limit = 3, $offset = 0, $lang = "en", $external = false, $filtered = true, $include_featured = true) {

    // Get the current page language code.
    $language_code = $lang;
    $is_external = $external == true ? '=' : '!=';

    // Initialize arrays to store data.
    $articles = [];
    $unique_tags = [];

    $category = \Drupal::request()->get('category');
    $year = \Drupal::request()->get('year');
    $query_filtered = \Drupal::request()->get('filtered');
    if($query_filtered) {
      $filtered = true;
    }

    if(!$year && !$external && $filtered) {
      $current_year = $this->getLastPublishedYear();
      $year = $current_year['id'];
    }

    $total_count = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'newsroom')
      ->condition('status', 1)
      ->condition('field_is_it_an_external_article', 1, $is_external) // Include only nodes where field_resources_published_time is not empty
      ->condition('field_promoted_resource', 1, '!=') // Exclude nodes where field_promoted_resource is true.
      ->condition('langcode', $language_code) // Filter by language code.
      ->accessCheck();

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'newsroom')
      ->condition('status', 1)
      ->condition('field_promoted_resource', 1, '!=') // Exclude nodes where field_promoted_resource is true.
      ->condition('field_is_it_an_external_article', 1, $is_external) // Include only nodes where field_resources_published_time is not empty
      ->condition('langcode', $language_code) // Filter by language code.
      ->range($offset, $limit) // Apply offset and limit.
      ->sort('field_resources_published_time', 'DESC', $language_code)
      ->accessCheck();

     if ($year != null && $year != "all" && !$external && $filtered) {
      $query->condition('field_year', $year);
      $total_count->condition('field_year', $year);
    }

    if ($category != null && $category != "all" && !$external && $filtered) {
      $query->condition('field_resources_tags', $category);
      $total_count->condition('field_resources_tags', $category);
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
      $url = $this->getAliasesInOtherLanguages($node->id(), $language_code);
      $published_date = $node->get('field_resources_published_time')->value;

      // Get Tags (field_resources_tags).
      $tags_references = $node->get('field_resources_tags')->referencedEntities();
      $article_tags = [];

      foreach ($tags_references as $tag) {
        $tag_name = $tag->getName();
        $tag_id = $tag->id();

        // Add the tag to the unique_tags array if it doesn't exist.
        if (!in_array($tag_id, array_column($unique_tags, 'id'))) {
          $unique_tags[] = [
            'name' => $tag_name,
            'id' => $tag_id,
          ];
        }

        // Add the tag to the article_tags array.
        $article_tags[] = [
          'name' => $tag_name,
          'id' => $tag_id,
        ];
      }

      // Get Background Image (field_resources_background_image).
      $background_image_media = $node->get('field_resources_background_image')->entity;
      $background_image_url = '';

      if ($background_image_media instanceof Media) {
        $background_image_file = $background_image_media->get('field_media_image')->entity;

        if ($background_image_file instanceof File) {
          $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
        }
      }

      $custom_timestamp = $node->get('field_resources_published_time')->value;
      $external_url = $node->get('field_e')->value;
      $external_source = $node->get('field_external_source')->value;
      $is_external_value = $node->get('field_is_it_an_external_article')->value;
      $creation_date = date('F j, Y', $custom_timestamp);
      $node_id = $node->id();

      $articles[] = [
        'id' => $node_id,
        'url' => $url,
        'title' => $title,
        'tags' => $article_tags,
        'external_url' => $external_url,
        'external_source' => $external_source,
        'is_external_value' => $is_external_value,
        'background_image' => $background_image_url,
        'published_date' => $published_date,
        'creation_date' => $creation_date,
      ];
    }

    return [
      'debug' => array(
        "limit" => $limit,
        "offset" => $offset,
        "external" => $external,
        "filtered" => $filtered,
      ),
      'tags' => $unique_tags,
      'articles' => $articles,
      'articles_count' => $total_count,
      'articles_finished' => (count($articles) >= $total_count),
    ];
  }

  public function getYears() {
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => 'newsroomyears']);
    $result = [];

    foreach ($terms as $term) {
        $result[] = [
            'id' => $term->id(),
            'name' => $term->getName(),
            'year' => (int) $term->getName(), // Convert the name to an integer for sorting
        ];
    }

    // Sort the result array by the 'year' key in descending order
    usort($result, function ($a, $b) {
        return $b['year'] - $a['year'];
    });

    return $result;
}


public function getLastPublishedYear() {
  $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => 'newsroomyears']);
  $result = [];

  foreach ($terms as $term) {
      $result[] = [
          'id' => $term->id(),
          'name' => $term->getName(),
          'year' => (int) $term->getName(), // Convert the name to an integer for sorting
      ];
  }

  // Sort the result array by the 'year' key in descending order
  usort($result, function ($a, $b) {
      return $b['year'] - $a['year'];
  });

  return $result[0];
}

public function getAllNewsArticleTags() {
    // Get the current page language code.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => 'newsroomtags']);
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
  public function getAliasesInOtherLanguages($node_id, $langcode = false) {
    $path = '/node/' . (int)$node_id;

    if (!$langcode) {
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
    }
    $path_alias = $this->pathAliasManager->getAliasByPath($path, $langcode);
   
    $lang_prefix = $langcode != "en" ? "/" . $langcode : "";
    return $lang_prefix . $path_alias;
  }

  function getSingleNewsData($node_id) {
    global $base_url;

    $news_id = 4751;
    // Get the current page language code.
    $language_code = $this->languageManager->getCurrentLanguage()->getId();

    // Load the node in the current language.
    $node = Node::load($node_id);

    if ($node->hasTranslation($language_code)) {
      $node = $node->getTranslation($language_code);
    }

    $article_tags = [];

    $title = $node->get('title')->value;

    $url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());
    $url = $language_code != "en" ? "/" . $language_code . $url : $url;

    // Get Tags (field_resources_tags)
    $tags_references = $node->get('field_resources_tags')->referencedEntities();

    foreach ($tags_references as $tag) {
      $tag_name = $tag->getName();
      $tag_id = $tag->id(); // Get the tag ID.

      // Add the tag to the article_tags array.
      $article_tags[] = [
        'name' => $tag_name,
        'id' => $tag_id,
      ];
    }

    if($node->get('field_resources_background_image')) {
      // Get Background Image (field_resources_background_image)
      $background_image_media = $node->get('field_resources_background_image')->entity;

      if ($background_image_media instanceof \Drupal\media\Entity\Media) {
        $background_image_file = $background_image_media->get('field_media_image')->entity;

        if ($background_image_file instanceof \Drupal\file\Entity\File) {
          $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
        }
      }
    }


    // Get Creation Date
    $custom_timestamp = $node->get('field_resources_published_time')->value;
    $summary = $node->get('field_resources_subtitle')->value;
    $blog_url = $this->getAliasesInOtherLanguages($news_id);
    $domain = $base_url;
    $short_url = substr($domain . $url, 0, 48) . "...";
    $share_url = $domain . $url;

    // Convert the custom timestamp to a formatted date.
    $creation_date = date('F j, Y', $custom_timestamp);
    $related_articles = $this->getRelatedNews($node->id());

    $article = array(
      "title" => $title,
      'url' => $url,
      'domain' => $domain,
      'summary' => $summary,
      'share_url' => $share_url,
      'short_share_url' => $short_url,
      'tags' => $article_tags,
      'background_image' => $background_image_url,
      'creation_date' => $creation_date,
      'blog_url' => $blog_url,
      'related_articles' => $related_articles,
    );

    return $article;
  }

  /**
   * Gets the related articles for the given tag ID.
   *
   * @param int $tag_id
   *   The tag ID.
   * @param int $exclude_node_id
   *   The node ID to exclude.
   *
   * @return array
   *   An array of related articles.
   */
  public function getRelatedNews($exclude_node_id) {
    $related_articles = [];

    // Get the current page language code.
    $language_code = $this->languageManager->getCurrentLanguage()->getId();

    $node_storage_query = $this->entityTypeManager->getStorage('node')->getQuery();

    $query = $node_storage_query
      ->condition('type', 'newsroom') // Adjust to your content type name.
      ->condition('langcode', $language_code) // Filter by language code.
      ->condition('status', 1)
      ->condition('nid', $exclude_node_id, '<>') // Exclude the specified node ID.
      ->sort('created', 'DESC')
      ->range(0, 3)
      ->accessCheck()
      ->execute();

    $related_article_ids = array_values($query);

    foreach ($related_article_ids as $related_article_id) {
      $node = Node::load($related_article_id);

      // Load the node in the current language.
      $node = $node->getTranslation($language_code);

      if ($node instanceof Node) {
        $related_article_title = $node->get('title')->value;
        $related_article_url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());

        $tags_references = $node->get('field_resources_tags')->referencedEntities();
        $tags_references = array_slice($tags_references, 0, 3);
        $article_tags = [];

        foreach ($tags_references as $tag) {
          $tag_name = $tag->getName();
          $tag_id = $tag->id(); // Get the tag ID.

          // Add the tag to the article_tags array.
          $article_tags[] = [
            'name' => $tag_name,
            'id' => $tag_id,
          ];
        }

        // Get Background Image (field_resources_background_image)
        $background_image_media = $node->get('field_resources_background_image')->entity;

        if ($background_image_media instanceof Media) {
          $background_image_file = $background_image_media->get('field_media_image')->entity;

          if ($background_image_file instanceof File) {
            $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
          }
        }

        // Get Creation Date
        $custom_timestamp = $node->get('field_resources_published_time')->value;

        // Convert the custom timestamp to a formatted date.
        $creation_date = date('F j, Y', $custom_timestamp);


        if ($language_code != "en") {
          $url = "/" . $language_code . $related_article_url;
        } else {
          $url = $related_article_url;
        }

        $related_articles[] = [
          'url' => $url,
          'title' => $related_article_title,
          'tags' => $article_tags,
          'background_image' => $background_image_url,
          'creation_date' => $creation_date,
        ];
      }
    }

    return $related_articles;
  }

}
