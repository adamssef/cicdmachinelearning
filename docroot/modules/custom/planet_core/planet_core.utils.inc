<?php

use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Drupal\path_alias\AliasManagerInterface;

function truncateText($text, $maxLength, $suffix = '...') {
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
function planet_core_get_author_articles($authorId, $limit = 3, $offset = 0)
{

  $author_node = \Drupal\node\Entity\Node::load($authorId);
  $author_name = $author_node->getTitle();
  $author_name_words = explode(' ', $author_name);

  // Extract the first word only if the author's name has at least two words.
  $first_word = (count($author_name_words) >= 2) ? reset($author_name_words) : $author_name;

  $profile_picture_url = '';
  // Check if the author node and profile picture field exist.
  if ($author_node && $author_node->hasField('field_profile_picture')) {
    $profile_picture_media = $author_node->get('field_profile_picture')->entity;
    if ($profile_picture_media instanceof \Drupal\media\Entity\Media) {
      $profile_picture_file = $profile_picture_media->get('field_media_image')->entity;
      if ($profile_picture_file instanceof \Drupal\file\Entity\File) {
        $profile_picture_url = file_create_url($profile_picture_file->getFileUri());
      }
    }
  }

  $total_nodes = \Drupal::entityQuery('node')
    ->condition('type', 'resources') // Adjust to your content type name.
    ->condition('field_author.target_id', $authorId)
    ->condition('status', 1);

  $total_nodes_nids = $total_nodes->execute();
  $total_articles = count($total_nodes_nids);

  $query = \Drupal::entityQuery('node')
    ->condition('type', 'resources') // Adjust to your content type name.
    ->condition('field_author.target_id', $authorId)
    ->condition('status', 1) // 1 represents published nodes.
    ->range($offset, $limit) // Apply offset and limit.
    ->sort('created', 'DESC'); // Sort by creation date in descending order.

  $resource_nids = $query->execute();
  $resource_nodes = \Drupal\node\Entity\Node::loadMultiple($resource_nids);

  $articles = [];
  $unique_tags = []; // Initialize an array to store unique tags.

  foreach ($resource_nodes as $node) {
    $title = $node->get('field_resources_title')->value;

    $url = \Drupal::service('path_alias.manager')->getAliasByPath('/node/' . $node->id());

    // Get Tags (field_resources_tags)
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
        $background_image_url = file_create_url($background_image_file->getFileUri());
      }
    }

    // Get Creation Date
    $custom_timestamp = $node->get('field_resources_published_time')->value;

    // Convert the custom timestamp to a formatted date.
    $creation_date = date('F j, Y', $custom_timestamp);


    $articles[] = [
      'url' => $url,
      'title' => $title,
      'tags' => $article_tags,
      // Store the tags for the current article.
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


function planet_core_get_last_published_article()
{
    // Query for the last published article.
    $query = \Drupal::entityQuery('node')
        ->condition('status', 1) // 1 represents published nodes.
        ->condition('type', 'resources') // Adjust to your content type name.
        ->sort('created', 'DESC') // Sort by creation date in descending order.
        ->range(0, 1); // Limit the result to 1 article.

    $nids = $query->execute();
    $nodes = Node::loadMultiple($nids);

    $total_nodes = \Drupal::entityQuery('node')
    ->condition('type', 'resources') // Adjust to your content type name.
    ->condition('status', 1);

    $total_nodes_nids = $total_nodes->execute();
    $total_articles = count($total_nodes_nids);

    $latest_article = null;

    $author_name = "";
    $author_url = "";
    $author_photo = "";
    $title = "";
    $url = "";
    $creation_date = "";
    $article_tags = [];

    foreach ($nodes as $node) {
        $title = $node->get('field_resources_title')->value;

        $url = \Drupal::service('path_alias.manager')->getAliasByPath('/node/' . $node->id());

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
                $author_photo = file_create_url($file->getFileUri());
                $author_url = $author->toUrl()->toString();
            }
        }

        // Get Background Image (field_resources_background_image)
        $background_image_media = $node->get('field_resources_background_image')->entity;
        if ($background_image_media instanceof Media) {
            $background_image_file = $background_image_media->get('field_media_image')->entity;
            if ($background_image_file instanceof File) {
                $background_image_url = file_create_url($background_image_file->getFileUri());
            }
        }

        // Get Creation Date
        $custom_timestamp = $node->get('field_resources_published_time')->value;

        // Convert the custom timestamp to a formatted date.
        $creation_date = date('F j, Y', $custom_timestamp);

        

        // Get the summary/excerpt of the body field.
        $body_summary = $node->get('field_article_summary')->value;
        $body_summary = $body_summary ? truncateText($body_summary, 250) : "";

        $title = truncateText($title, 90);

        // Return a single article.
        $latest_article = [
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
            'total_articles' => $total_articles
        ];

        // Break the loop after finding the latest article.
        break;
    }

    return $latest_article;
}



/**
 * @file
 * Custom hooks functions for the planet_core module.
 */
function planet_core_get_blog_articles($limit = 3, $offset = 0)
{

  $total_nodes = \Drupal::entityQuery('node')
    ->condition('type', 'resources') // Adjust to your content type name.
    ->condition('status', 1);

  $total_nodes_nids = $total_nodes->execute();
  $total_articles = count($total_nodes_nids);

  $query = \Drupal::entityQuery('node')
    ->condition('type', 'resources') // Adjust to your content type name.
    ->condition('status', 1) // 1 represents published nodes.
    ->range($offset, $limit) // Apply offset and limit.
    ->sort('created', 'DESC'); // Sort by creation date in descending order.

  $resource_nids = $query->execute();
  $resource_nodes = \Drupal\node\Entity\Node::loadMultiple($resource_nids);

  $articles = [];
  $unique_tags = []; // Initialize an array to store unique tags.

  foreach ($resource_nodes as $node) {
    $title = $node->get('field_resources_title')->value;

    $url = \Drupal::service('path_alias.manager')->getAliasByPath('/node/' . $node->id());

    // Get Tags (field_resources_tags)
    $tags_references = $node->get('field_resources_tags')->referencedEntities();
    $article_tags = [];

    
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
            $author_photo = file_create_url($file->getFileUri());
            $author_url = $author->toUrl()->toString();
        }
    }


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
        $background_image_url = file_create_url($background_image_file->getFileUri());
      }
    }

    // Get Creation Date
    $custom_timestamp = $node->get('field_resources_published_time')->value;

    // Convert the custom timestamp to a formatted date.
    $creation_date = date('F j, Y', $custom_timestamp);


    $articles[] = [
      'url' => $url,
      'title' => $title,
      'tags' => $article_tags,
      'background_image' => $background_image_url,
      'creation_date' => $creation_date,
      'author' => [
        'full_name' => $author_name,
        'url' => $author_url,
        'profile_picture' => $author_photo,
        ]
    ];
  }

  return [
    'tags' => $unique_tags,
    'articles' => $articles,
    'articles_count' => $total_articles,
    'articles_finished' => $total_articles == count($articles),
  ];
}


/**
 * Gets aliases in other languages for the given English alias.
 *
 * @param string $englishAlias
 *   The English alias.
 *
 * @return array
 *   An array of aliases in other languages keyed by language code.
 */

function planet_core_get_aliases_in_other_languages($english_alias) {
  $alias_manager = \Drupal::service('path_alias.manager');
  $language_manager = \Drupal::languageManager();
  $languages = $language_manager->getLanguages();

  $aliases_in_other_languages = [];

  foreach ($languages as $language) {
    // Skip the English language as we already have the English alias.
    if ($language->getId() == 'en') {
      continue;
    }

    // Get the alias for the current language.
    $alias = $alias_manager->getPathByAlias('/' . $english_alias, $language->getId());

    // If an alias is found, add it to the result array.
    if ($alias) {
      $aliases_in_other_languages[$language->getId()] = $alias;
    }
    else {
      // If no alias is found, use the English alias as a fallback.
      $aliases_in_other_languages[$language->getId()] = '/' . $english_alias;
    }
  }

  return $aliases_in_other_languages;
}


function planet_core_single_article($node_id) {

  global $base_url;

  $node = Node::load($node_id);
  
  $article = array();
  $article_tags = [];
  $author_name = "";
  $author_url = "";
  $author_photo = "";

  $title = $node->get('field_resources_title')->value;

  $url = \Drupal::service('path_alias.manager')->getAliasByPath('/node/' . $node->id());

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
          $author_photo = file_create_url($file->getFileUri());
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
      $background_image_url = file_create_url($background_image_file->getFileUri());
    }
  }

  // Get Creation Date
  $custom_timestamp = $node->get('field_resources_published_time')->value;
  $reading_time = $node->get('field_resources_reading_time')->value;
  $blog_urls = planet_core_get_aliases_in_other_languages("blog");
  $domain = $base_url;

  $short_url = substr($domain . $url, 0, 48) . "...";
  $share_url = $domain . $url;

  // Convert the custom timestamp to a formatted date.
  $creation_date = date('F j, Y', $custom_timestamp);

  $related_articles = planet_core_get_related_articles($article_tags[0]['id'], $node->id());

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
    'blog_urls' => $blog_urls,
    'related_articles' => $related_articles,
  );

  return $article;
}



function planet_core_get_related_articles($tag_id, $exclude_node_id)
{

  $related_articles = [];

  $query = \Drupal::entityQuery('node')
    ->condition('type', 'resources') // Adjust to your content type name.
    ->condition('field_resources_tags.target_id', $tag_id)
    ->condition('status', 1)
    ->condition('nid', $exclude_node_id, '<>') // Exclude the specified node ID.
    ->sort('created', 'DESC')
    ->range(0, 3)
    ->execute();

  $related_article_ids = array_values($query);

    // If no related articles are found, query the last 3 articles excluding the specified node ID.
  if (empty($related_article_ids)) {
    $query = \Drupal::entityQuery('node')
      ->condition('type', 'resources') // Adjust to your content type name.
      ->condition('status', 1)
      ->condition('nid', $exclude_node_id, '<>') // Exclude the specified node ID.
      ->sort('created', 'DESC')
      ->range(0, 3)
      ->execute();

    $related_article_ids = array_values($query);
  }

  foreach ($related_article_ids as $related_article_id) {

    $node = Node::load($related_article_id);

    if ($node instanceof Node) {
      $related_article_title = $node->get('field_resources_title')->value;
      $related_article_url = \Drupal::service('path_alias.manager')->getAliasByPath('/node/' . $node->id());

      $tags_references = $node->get('field_resources_tags')->referencedEntities();
      $tags_references = array_slice($tags_references, 0, 3);
      $article_tags = [];

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
          $author_photo = file_create_url($file->getFileUri());
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
          $background_image_url = file_create_url($background_image_file->getFileUri());
        }
      }

      // Get Creation Date
      $custom_timestamp = $node->get('field_resources_published_time')->value;

      // Convert the custom timestamp to a formatted date.
      $creation_date = date('F j, Y', $custom_timestamp);

      $related_articles[] = [
        'url' => $related_article_url,
        'title' => $related_article_title,
        'tags' => $article_tags,
        'background_image' => $background_image_url,
        'creation_date' => $creation_date,
        'author' => [
          'full_name' => $author_name,
          'url' => $author_url,
          'profile_picture' => $author_photo,
        ]
      ];
    }
  }
  return $related_articles;
}