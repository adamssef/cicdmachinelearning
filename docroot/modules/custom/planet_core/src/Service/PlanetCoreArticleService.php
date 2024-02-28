<?php

namespace Drupal\planet_core\Service;

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
class PlanetCoreArticleService {

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


  /**
   * @file
   * Custom hooks functions for the planet_core module.
   */
  public function getAuthorArticles($authorId, $limit = 3, $offset = 0) {
    $author_node = $this->entityTypeManager->getStorage('node')->load($authorId);
    $author_name = $author_node->getTitle();
    $author_name_words = explode(' ', $author_name);

    // Extract the first word only if the author's name has at least two words.
    $first_word = (count($author_name_words) >= 2) ? reset($author_name_words) : $author_name;

    $profile_picture_url = '';
    // Check if the author node and profile picture field exist.
    if ($author_node && $author_node->hasField('field_profile_picture')) {
      $profile_picture_media = $author_node->get('field_profile_picture')->entity;

      if ($profile_picture_media instanceof Media) {
        $profile_picture_file = $profile_picture_media->get('field_media_image')->entity;
        if ($profile_picture_file instanceof File) {
          $profile_picture_url = $this->fileUrlGenerator->generateAbsoluteString($profile_picture_file->getFileUri());
        }
      }
    }

    $node_storage = $this->entityTypeManager->getStorage('node');

    $total_nodes = $node_storage->getQuery()
      ->condition('type', 'resources') // Adjust to your content type name.
      ->condition('field_hide_from_components', NULL, 'IS NULL') // Exclude nodes where hide is true.
      ->condition('field_author.target_id', $authorId)
      ->accessCheck(FALSE)
      ->condition('status', 1);

    $total_nodes_nids = $total_nodes->execute();
    $total_articles = count($total_nodes_nids);

    $query = $node_storage->getQuery()
      ->condition('type', 'resources') // Adjust to your content type name.
      ->condition('field_hide_from_components', NULL, 'IS NULL') // Exclude nodes where hide is true
      ->condition('field_author.target_id', $authorId)
      ->condition('status', 1) // 1 represents published nodes.
      ->range($offset, $limit) // Apply offset and limit.
      ->accessCheck(FALSE)
      ->sort('created', 'DESC'); // Sort by creation date in descending order.

    $resource_nids= $query->execute();
    $resource_nodes = $node_storage->loadMultiple($resource_nids);

    // Empty arrays initialization.
    $articles = [];
    $unique_tags = [];

    foreach ($resource_nodes as $node) {
      $title = $node->get('field_resources_title')->value;

      $url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());

      // Get Tags (field_resources_tags).
      $tags_references = $node->get('field_resources_tags')->referencedEntities();
      $article_tags = [];

      foreach ($tags_references as $tag) {
        $tag_name = $tag->getName();
        $tag_id = $tag->id(); // Get the tag ID.

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

      // Get Background Image (field_resources_background_image)
      $background_image_media = $node->get('field_resources_background_image')->entity;

      if ($background_image_media instanceof \Drupal\media\Entity\Media) {
        $background_image_file = $background_image_media->get('field_media_image')->entity;

        if ($background_image_file instanceof \Drupal\file\Entity\File) {
          $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
        }
      }

      // Get Creation Date
      $custom_timestamp = $node->get('field_resources_published_time')->value;

      // Convert the custom timestamp to a formatted date.
      $creation_date = date('F j, Y', $custom_timestamp);

      $articles[] = [
        'url' => $url,
        'title' => $title,
        'tags' => $article_tags, // Store the tags for the current article.
        'background_image' => $background_image_url,
        'creation_date' => $creation_date,
      ];
    }

    return [
      'tags' => $unique_tags,
      'articles' => $articles,
      'articles_count' => $total_articles,
      'articles_finished' => $total_articles == count($articles),
      'author' => array(
        'profile_picture' => $profile_picture_url,
        'first_name' => $first_word,
        'full_name' => $author_name
      )
    ];
  }


  public function getToggleLinks() {
      /** These ids are for production only */
      $blog_url = $this->getAliasesInOtherLanguages(1576);
      $case_studies_url = $this->getAliasesInOtherLanguages(1366);
      $ebooks_url = $this->getAliasesInOtherLanguages(2136);

      return array(
        "case_studies" => $case_studies_url,
        "ebooks" => $ebooks_url,
        "blog" => $blog_url
      );
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
      $title = $node->get('field_resources_title')->value;
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


  /**
   * Gets the last published articles.
   *
   * @param int $limit
   *   The number of articles to return.
   * @param int $offset
   *   The offset.
   * @param string $lang
   *   The language code.
   *
   * @return array
   *   An array of blog articles.
   */
  public function getBlogArticles($limit = 3, $offset = 0, $lang = "en") {
    // Get the current page language code.
    $language_code = $lang;

    // Initialize arrays to store data.
    $articles = [];
    $unique_tags = [];

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'resources')
      ->condition('status', 1)
      ->condition('field_hide_from_components', NULL, 'IS NULL') // Include only nodes where field_hide_from_components is empty    // Exclude nodes where hide is true
      ->condition('field_promoted_resource', 1, '!=') // Exclude nodes where field_promoted_resource is true.
      ->condition('field_resources_published_time', NULL, 'IS NOT NULL') // Include only nodes where field_resources_published_time is not empty
      ->condition('langcode', $language_code) // Filter by language code.
      ->range($offset, $limit)
      ->sort('field_resources_published_time', 'DESC', $language_code)
      ->accessCheck()
      ->execute();

    $total_count = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'resources')
      ->condition('status', 1)
      ->condition('field_hide_from_components', NULL, 'IS NULL') // Exclude nodes where hide is true
      ->condition('field_resources_published_time', NULL, 'IS NOT NULL') // Include only nodes where field_resources_published_time is not empty
      ->condition('field_promoted_resource', 1, '!=') // Exclude nodes where field_promoted_resource is true.
      ->condition('langcode', $language_code) // Filter by language code.
      ->accessCheck()
      ->execute();
    $total_count = count($total_count);

    $resource_nids = array_values($query);
    $resource_nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($resource_nids);

    foreach ($resource_nodes as $node) {
      // Load the node in the current language.
      $node = $node->getTranslation($language_code);
      $title = $node->get('field_resources_title')->value;
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

      // Get Author information.
      $author_id = $node->get('field_author')->target_id;
      $author_name = '';
      $author_photo = '';
      $author_url = '';

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

      // Get Creation Date.
      $custom_timestamp = $node->get('field_resources_published_time')->value;
      $creation_date = date('F j, Y', $custom_timestamp);

      $articles[] = [
        'url' => $url,
        'title' => $title,
        'tags' => $article_tags,
        'background_image' => $background_image_url,
        'published_date' => $published_date,
        'creation_date' => $creation_date,
        'author' => [
          'full_name' => $author_name,
          'url' => $author_url,
          'profile_picture' => $author_photo,
        ]
      ];
    }

    

    // Return the result.
    return [
      'tags' => $unique_tags,
      'articles' => $articles,
      'articles_count' => $total_count,
      'articles_finished' => count($articles) >= ($total_count - 1),
    ];
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



  public function getPublishedNews($limit = 3, $external = false, $lang = "en") {

    // Get the current page language code.
    $language_code = $lang;
    $is_external = $external == true ? 'IS NOT NULL' : 'IS NULL';

    // Initialize arrays to store data.
    $articles = [];
    $unique_tags = [];

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'newsroom')
      ->condition('status', 1)
      ->condition('field_promoted_resource', 1, '!=') // Exclude nodes where field_promoted_resource is true.
      ->condition('field_is_it_an_external_article', null, $is_external) // Include only nodes where field_resources_published_time is not empty
      ->condition('langcode', $language_code) // Filter by language code.
      ->range(0, $limit)
      ->sort('field_resources_published_time', 'DESC', $language_code)
      ->accessCheck()
      ->execute();

    $total_count = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'newsroom')
      ->condition('status', 1)
      ->condition('field_is_it_an_external_article', null, 'IS NULL') // Include only nodes where field_resources_published_time is not empty
      ->condition('field_resources_published_time', NULL, $is_external) // Include only nodes where field_resources_published_time is not empty
      ->condition('field_promoted_resource', 1, '!=') // Exclude nodes where field_promoted_resource is true.
      ->condition('langcode', $language_code) // Filter by language code.
      ->accessCheck()
      ->execute();
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

      // Get Creation Date.
      $custom_timestamp = $node->get('field_resources_published_time')->value;
      $external_url = $node->get('field_e')->value;
      $external_source = $node->get('field_external_source')->value;
      $is_external_value = $node->get('field_is_it_an_external_article')->value;
      $creation_date = date('F j, Y', $custom_timestamp);

      $articles[] = [
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
      'tags' => $unique_tags,
      'articles' => $articles,
      'articles_count' => $total_count,
      'articles_finished' => count($articles) >= ($total_count - 1),
    ];
  }



  public function getAllBlogArticleTags() {
    // Get the current page language code.
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => 'tags']);
    $result = [];
    foreach ($terms as $term) {
        $result[] = [
            'id' => $term->id(),
            'name' => $term->getName(),
        ];
    }
    return $result;
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


  /**
   * Gets the article data for the given node ID.
   *
   * @param int $node_id
   *   The node ID.
   *
   * @return array
   *   An array of article data.
   */
  function getSingleArticleData($node_id) {
    global $base_url;

    $blog_id = 1576;
    // Get the current page language code.
    $language_code = $this->languageManager->getCurrentLanguage()->getId();

    // Load the node in the current language.
    $node = Node::load($node_id);

    if ($node->hasTranslation($language_code)) {
      $node = $node->getTranslation($language_code);
    }

    $article_tags = [];
    $author_name = "";
    $author_url = "";
    $author_photo = "";

    $title = $node->get('field_resources_title')->value;

    $url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());
    $url = $language_code != "en" ? "/" . $language_code . $url : $url;

    // Get Tags (field_resources_tags)
    $tags_references = $node->get('field_resources_tags')->referencedEntities();

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

    if ($background_image_media instanceof \Drupal\media\Entity\Media) {
      $background_image_file = $background_image_media->get('field_media_image')->entity;

      if ($background_image_file instanceof \Drupal\file\Entity\File) {
        $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
      }
    }

    // Get Creation Date
    $custom_timestamp = $node->get('field_resources_published_time')->value;
    $reading_time = $node->get('field_resources_reading_time')->value;
    $blog_url = $this->getAliasesInOtherLanguages($blog_id);
    $domain = $base_url;
    $short_url = substr($domain . $url, 0, 48) . "...";
    $share_url = $domain . $url;

    // Convert the custom timestamp to a formatted date.
    $creation_date = date('F j, Y', $custom_timestamp);
    $related_tag = $article_tags ? $article_tags[0]['id'] : false;
    $related_articles = $this->getRelatedArticles($related_tag, $node->id());

    $article = array(
      "title" => $title,
      'url' => $url,
      'domain' => $domain,
      'share_url' => $share_url,
      'short_share_url' => $short_url,
      'tags' => $article_tags,
      'background_image' => $background_image_url,
      'creation_date' => $creation_date,
      'reading_time' => $reading_time,
      'author' => [
        'full_name' => $author_name,
        'url' => $author_url,
        'profile_picture' => $author_photo,
      ],
      'blog_url' => $blog_url,
      'related_articles' => $related_articles,
    );

    return $article;
  }

  function getSingleNewsData($node_id) {
    global $base_url;

    $blog_id = 1576;
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

    // Get Background Image (field_resources_background_image)
    $background_image_media = $node->get('field_resources_background_image')->entity;

    if ($background_image_media instanceof \Drupal\media\Entity\Media) {
      $background_image_file = $background_image_media->get('field_media_image')->entity;

      if ($background_image_file instanceof \Drupal\file\Entity\File) {
        $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
      }
    }

    // Get Creation Date
    $custom_timestamp = $node->get('field_resources_published_time')->value;
    $blog_url = $this->getAliasesInOtherLanguages($blog_id);
    $domain = $base_url;
    $short_url = substr($domain . $url, 0, 48) . "...";
    $share_url = $domain . $url;

    // Convert the custom timestamp to a formatted date.
    $creation_date = date('F j, Y', $custom_timestamp);
    $related_tag = $article_tags ? $article_tags[0]['id'] : false;
    $related_articles = $this->getRelatedArticles($related_tag, $node->id());

    $article = array(
      "title" => $title,
      'url' => $url,
      'domain' => $domain,
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
  public function getRelatedArticles($tag_id, $exclude_node_id) {
    \Drupal::logger('PlanetCoreArticleService')->notice('In getRelatedArticles.');
    $related_articles = [];

    // Get the current page language code.
    $language_code = $this->languageManager->getCurrentLanguage()->getId();

    $node_storage_query = $this->entityTypeManager->getStorage('node')->getQuery();

    $query = $node_storage_query
      ->condition('type', 'resources') // Adjust to your content type name.
      ->condition('field_hide_from_components', NULL, 'IS NULL') // Exclude nodes where hide is true
      ->condition('langcode', $language_code) // Filter by language code.
      ->condition('field_resources_tags.target_id', $tag_id)
      ->condition('status', 1)
      ->condition('nid', $exclude_node_id, '<>') // Exclude the specified node ID.
      ->sort('created', 'DESC')
      ->range(0, 3)
      ->accessCheck()
      ->execute();

    $related_article_ids = array_values($query);

    // If no related articles are found, query the last 3 articles excluding the specified node ID.
    if (empty($related_article_ids)) {
      $query = $node_storage_query
        ->condition('type', 'resources') // Adjust to your content type name.
        ->condition('langcode', $language_code) // Filter by language code.
        ->condition('status', 1)
        ->condition('field_hide_from_components', NULL, 'IS NULL') // Exclude nodes where hide is true
        ->condition('nid', $exclude_node_id, '<>') // Exclude the specified node ID.
        ->sort('created', 'DESC')
        ->range(0, 3)
        ->accessCheck()
        ->execute();

      $related_article_ids = array_values($query);
    }

    foreach ($related_article_ids as $related_article_id) {
      $node = Node::load($related_article_id);

      // Load the node in the current language.
      $node = $node->getTranslation($language_code);

      if ($node instanceof Node) {
        $related_article_title = $node->get('field_resources_title')->value;
        $related_article_url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());

        $tags_references = $node->get('field_resources_tags')->referencedEntities();
        $tags_references = array_slice($tags_references, 0, 3);
        $article_tags = [];

        $author_id = $node->get('field_author')->target_id;
        if ($author_id) {
          // Load the author node.
          $author = Node::load($author_id);
          if ($author instanceof Node && $author->getType() == 'author') {
            $author_name = $author->getTitle() ? $author->getTitle() : "";
            $mid = $author->get('field_profile_picture')->getValue()[0]['target_id'];
            $media = Media::load($mid);
            $fid = $media->field_media_image->target_id;
            $file = File::load($fid);
            $author_photo = $this->fileUrlGenerator->generateAbsoluteString($file->getFileUri());
            $author_url = $author->toUrl()->toString();
          }
        }

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
          'author' => [
            'full_name' => $author_name ?? "",
            'url' => $author_url ?? "",
            'profile_picture' => $author_photo ?? "",
          ]
        ];
      }
    }

    return $related_articles;
  }

}
