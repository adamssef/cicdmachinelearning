<?php

namespace Drupal\planet_core\Service\PlanetCoreNodeTranslationsService;

use Drupal\Core\Database\Connection;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\path_alias\AliasManagerInterface;

class PlanetCoreNodeTranslationsService implements PlanetCoreNodeTranslationsServiceInterface {

  /**
   * The path alias manager.
   *
   * @var \Drupal\path_alias\AliasManagerInterface
   */
  protected AliasManagerInterface $pathAliasManager;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $connection;

  /**
   * Constructs a new PlantCoreService object.
   *
   * @param \Drupal\path_alias\AliasManagerInterface $path_alias_manager
   *   The path alias manager service.
   */
  public function __construct(
    AliasManagerInterface $path_alias_manager,
    LanguageManagerInterface $language_manager,
    EntityTypeManagerInterface $entity_type_manager,
    Connection $database
  ) {
    $this->pathAliasManager = $path_alias_manager;
    $this->languageManager = $language_manager;
    $this->entityTypeManager = $entity_type_manager;
    $this->connection = $database;
  }

  /**
   * A function that can translate a string to a given language.
   *
   * @param string $string
   *   String to be translated.
   * @param string $context
   *   Context to enable fallback to t()
   * @param string $langcode
   *
   *
   * @return ?string
   *   The translated string null otherwise
   */
  public function t2(string $string = "", $context = NULL, string $langcode = ''): string {
    $t = $string;

    if ($string !== "") {
      if ($langcode == "en") {
        $sql = 'SELECT s.source
        FROM {locales_source} s
        JOIN {locales_target} t
          ON s.lid = t.lid
        WHERE t.translation = :string';

        $results = $this->connection->query($sql, array(':string' => $string));

        foreach ($results as $row) {
          $t = $row->source;
        }

      }
      else {
        $t = t($string, $context, ['langcode' => $langcode]);
      }
    }

    return $t;
  }

  /**
   * {@inheritdoc}
   */
  public function buildTranslationArrayForNode(NodeInterface $node): ?array {
    $node_translations_url = [];

    if ($node) {
      $node_translations = $node->getTranslationLanguages();

      foreach ($node_translations as $langcode => $translation) {

        $translated_node = $node->getTranslation($langcode);
        $alias = $this->pathAliasManager->getAliasByPath('/node/' . $translated_node->id(), $langcode);

        if (in_array($langcode, ['de', 'fr', 'it', 'es'])) {
          $node_translations_url[$langcode] = "/$langcode" . $alias;
        }
        else {
          $node_translations_url[$langcode] = $alias;
        }
      }
    }

    return $node_translations_url;
  }


  /**
   * Get the translation array for a given url.
   *
   * @return array
   */
  public function getTranslationArrWithoutPrefixes($url): ?array {
    $node  = $this->getNodeByPathAlias($url);

    if ($node) {
      $node_translation_arr = $this->buildTranslationArrayForNode($node, TRUE);

      return array_values($node_translation_arr);
    }

    return NULL;
  }

  /**
   * Get the translation array for a given url.
   *
   * @return array
   */
  public function getTranslationArrWithPrefixes($url): ?array {
    $node  = $this->getNodeByPathAlias($url);

    if ($node) {
      return $this->buildTranslationArrayForNode($node);
    }

    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getNodeByPathAlias(string $alias): ?NodeInterface {
    // Get the current language prefix.
    $current_lang_prefix = $this->languageManager->getCurrentLanguage()->getId();

    // Normalize the alias to ensure it starts with "/".
    $alias = str_starts_with($alias, '/') ? $alias : "/$alias";

    // Load path alias for the current language using entity type manager.
    $path_alias_storage = $this->entityTypeManager->getStorage('path_alias');
    $path_aliases = $path_alias_storage->loadByProperties([
      'alias' => $alias,
      'langcode' => $current_lang_prefix,
    ]);

    // If no result, fallback to the default 'en' language.
    if (empty($path_aliases)) {
      $path_aliases = $path_alias_storage->loadByProperties([
        'alias' => $alias,
        'langcode' => 'en',
      ]);
    }

    // If we have a result, extract the path.
    if (!empty($path_aliases)) {
      /** @var \Drupal\path_alias\Entity\PathAlias $path_alias */
      $path_alias = reset($path_aliases);
      $path = $path_alias->getPath();

      // Check if the path matches a node, and return the node entity if found.
      if (preg_match('/node\/(\d+)/', $path, $matches)) {
        return Node::load($matches[1]);
      }
    }

    // If no matching node is found, return NULL.
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function determineTheLangId():string {
    $current_lang = $this->languageManager->getCurrentLanguage()->getId();

    $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : FALSE;

    if ($referer === FALSE) {
      $lang = $current_lang;
    } else {
      switch ($referer) {
        case str_contains($referer, '/es/'):
          $lang = 'es';
          break;
        case str_contains($referer, '/fr/'):
          $lang = 'fr';
          break;
        case str_contains($referer, '/de/'):
          $lang = 'de';
          break;
        case str_contains($referer, '/it/'):
          $lang = 'it';
          break;
        default:
          $lang = 'en';
      }
    }

    if ($current_lang !== $lang) {
      $current_lang = $lang;
    }

    return $current_lang;
  }

  /**
   * {@inheritdoc}
   */
  public function translateUrlAlias(string $english_alias): string {
    $node = $this->getNodeByPathAlias('/contact/sales');
    $translation_array = $this->buildTranslationArrayForNode($node);
    $langcode = $this->languageManager->getCurrentLanguage()->getId();
    $translated_alias = $translation_array[$langcode];

    return $translated_alias;
  }

}
