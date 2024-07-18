<?php

namespace Drupal\planet_language_switcher\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Drupal\path_alias\AliasManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a block to display language switcher.
 *
 * @Block(
 *   id = "planet_language_switcher_block",
 *   admin_label = @Translation("Planet Language Switcher"),
 *   category = @Translation("Custom Blocks")
 * )
 */
class LanguageSwitcherBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * The current route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * The path alias manager.
   *
   * @var \Drupal\path_alias\AliasManagerInterface
   */
  protected $aliasManager;

  /**
   * Constructs a new LanguageSwitcherBlock.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin ID for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match.
   * @param \Drupal\path_alias\AliasManagerInterface $alias_manager
   *   The path alias manager.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    LanguageManagerInterface $language_manager,
    RouteMatchInterface $route_match,
    AliasManagerInterface $alias_manager
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->languageManager = $language_manager;
    $this->routeMatch = $route_match;
    $this->aliasManager = $alias_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('language_manager'),
      $container->get('current_route_match'),
      $container->get('path_alias.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function pretty_lang_name($id): string {
    return match ($id) {
      'fr' => 'Français',
      'de' => 'Deutsch',
      'es' => 'Español',
      'it' => 'Italiano',
      default => 'English',
    };
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $default_language = $this->languageManager->getDefaultLanguage();
    $languages = $this->languageManager->getLanguages();
    $current_lang_id = $this->languageManager->getCurrentLanguage()->getId();
    $lang_url_list = [];
    $is_frontpage = \Drupal::service('path.matcher')->isFrontPage();

    foreach ($languages as $language) {
      // Get the current URL in each language.
      $url = Url::fromRoute('<current>')
        ->setOption('language', $language)->toString();

      // Check if the URL has a translation.
      $has_translation = FALSE;
      if ($node = $this->routeMatch->getParameter('node')) {
        if ($node instanceof NodeInterface) {
          $has_translation = $node->hasTranslation($language->getId());
        }
      }

      // If the page doesn't have a translation, use the English URL as a fallback.
      if (!$has_translation && $language->getId() !== $default_language) {
        $url = \Drupal\Core\Url::fromRoute('<current>')
          ->setOption('language', $default_language)->toString();
      }

      $homepage_url = $language->getId() == "en" ? "/" : "/" . $language->getId();
      $url = $is_frontpage ? $homepage_url : $url;
      $name = $this->pretty_lang_name($language->getId());
      $flag = '/resources/icons/language_switcher/' . $language->getId() . '.png';

      $lang_url_list[$language->getId()] = [
        "url" => $url,
        "name" => $name,
        "flag" => $flag,
        "active" => $has_translation,
      ];
    }

    $current_lang = $lang_url_list[$current_lang_id];

    $lang_arr = [
      '#theme' => 'language_switcher',
      '#data' => [
        'links' => $lang_url_list,
        'current_language' => $current_lang,
        'current_language_shortname' => $current_lang_id,
      ],
      '#attached' => [
        'library' => ['planet_language_switcher/language-switcher'],
      ],
    ];

    return $lang_arr;
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheTags() {
    if ($node = \Drupal::routeMatch()->getParameter('node')) {
      return Cache::mergeTags(parent::getCacheTags(), ['node:' . $node->id()]);
    }
    else {
      return parent::getCacheTags();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheContexts() {
    return Cache::mergeContexts(parent::getCacheContexts(), ['route']);
  }

}
