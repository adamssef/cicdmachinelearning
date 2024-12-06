<?php

namespace Drupal\planet_core\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Drupal\path_alias\AliasManagerInterface;

class PlanetCoreEbooksService {
  protected $entityTypeManager;
  protected $fileUrlGenerator;
  protected $pathAliasManager;
  protected $languageManager;

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

  public function getLastPublishedEbook() {
    $language_code = $this->languageManager->getCurrentLanguage()->getId();

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('status', 1)
      ->condition('type', 'e_book_')
      ->condition('field_promoted_e_book', 1)
      ->condition('langcode', $language_code)
      ->sort('created', 'DESC')
      ->accessCheck()
      ->range(0, 1);

    $nids = $query->execute();
    $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($nids);

    foreach ($nodes as $node) {
      $node = $node->getTranslation($language_code);
      
      $title = $node->get('title')->value;
      $url = $this->pathAliasManager->getAliasByPath('/node/' . $node->id());
      $url = $language_code != "en" ? "/" . $language_code . $url : $url;
      $article_tags = [];

      $tags_references = $node->get('field_resources_tags')->referencedEntities();
      foreach ($tags_references as $tag) {
        $article_tags[] = [
          'name' => $tag->getName(),
          'id' => $tag->id(),
        ];
      }

      $background_image_url = '';
      $background_image_media = $node->get('field_main_image_media')->entity;
      if ($background_image_media instanceof Media) {
        $background_image_file = $background_image_media->get('field_media_image')->entity;
        if ($background_image_file instanceof File) {
          $background_image_url = $this->fileUrlGenerator->generateAbsoluteString($background_image_file->getFileUri());
        }
      }

      $summary = $node->get('field_summary')->value;
      $pre_heading = $node->get('field_pre_heading')->value;
      $pre_heading_2 = $node->get('field_pre_heading_2')->value;
      $company_sector = $node->get('field_company_sector')->entity ? $node->get('field_company_sector')->entity->getName() : '';

      return [
        'url' => $url,
        'title' => $title,
        'background_image' => $background_image_url,
        'tags' => $article_tags,
        'summary' => $summary,
        'pre_heading' => $pre_heading,
        'pre_heading_2' => $pre_heading_2,
        'company_sector' => $company_sector
      ];
    }

    return null;
  }

  public function getPublishedEbooks($limit = 3, $offset = 0) {
    $query = $this->entityTypeManager->getStorage('node')->getQuery()
        ->condition('type', 'e_book_')
        ->condition('status', 1)
        ->sort('created', 'DESC')
        ->accessCheck();

    $orGroup = $query->orConditionGroup()
        ->condition('field_hide_from_website', NULL, 'IS')
        ->condition('field_hide_from_website', 1, '!=');
    $query->condition($orGroup);

    $nids = $query->execute();
    $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($nids);
    $ebooks = [];

    foreach ($nodes as $node) {
        $ebooks[] = [
            'id' => $node->id(),
            'url' => $this->pathAliasManager->getAliasByPath('/node/' . $node->id()),
            'title' => $node->get('title')->value,
            'tags' => $this->getNodeTags($node),
            'background_image' => $this->getBackgroundImage($node),
            'summary' => $node->get('field_summary')->value,
            'pre_heading' => $node->get('field_pre_heading')->value,
            'pre_heading_2' => $node->get('field_pre_heading_2')->value,
            'company_sector' => $node->get('field_company_sector')->entity ? 
                $node->get('field_company_sector')->entity->getName() : ''
        ];
    }

    return $ebooks;
}

private function getNodeTags($node) {
    $tags = [];
    if ($node->hasField('field_tags') && !$node->get('field_tags')->isEmpty()) {
        foreach ($node->get('field_tags')->referencedEntities() as $tag) {
            $tags[] = [
                'name' => $tag->getName(),
                'id' => $tag->id(),
            ];
        }
    }
    return $tags;
}

private function getBackgroundImage($node) {
    $media = $node->get('field_main_image_media')->entity;
    if ($media instanceof Media) {
        $file = $media->get('field_media_image')->entity;
        if ($file instanceof File) {
            return $this->fileUrlGenerator->generateAbsoluteString($file->getFileUri());
        }
    }
    return '';
}

  private function getAliasesInOtherLanguages($node_id, $langcode = false) {
    $path = '/node/' . (int)$node_id;
    if (!$langcode) {
      $langcode = $this->languageManager->getCurrentLanguage()->getId();
    }
    $path_alias = $this->pathAliasManager->getAliasByPath($path, $langcode);
    $lang_prefix = $langcode != "en" ? "/" . $langcode : "";
    return $lang_prefix . $path_alias;
  }
}