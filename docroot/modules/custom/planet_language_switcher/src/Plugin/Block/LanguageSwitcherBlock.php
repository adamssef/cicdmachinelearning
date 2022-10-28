<?php

namespace Drupal\planet_language_switcher\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Routing\RouteMatchInterface;
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
  public function __construct(array $configuration, $plugin_id, $plugin_definition, LanguageManagerInterface $language_manager, RouteMatchInterface $route_match, AliasManagerInterface $alias_manager) {
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
  public function build(): array {
    $languages = $this->languageManager->getLanguages();
    $currentLangCode = $this->languageManager->getCurrentLanguage()->getId();

    $links = [];
    foreach ($languages as $lid => $language) {
      $node = $this->routeMatch->getParameter('node');
      if ($node instanceof NodeInterface) {
        $nodePath = $this->aliasManager->getAliasByPath('/node/' . $node->id());
        $nativeLanguage = $this->languageManager->getNativeLanguages()[$lid];

        // Add the url with language.
        $links[$lid]['url'] = '/' . $lid . $nodePath;

        $links[$lid]['name'] = $language->getName();
        $links[$lid]['native_lang_name'] = $this->t($nativeLanguage->getName());
      }
    }

    // Remove current language from dropdown list.
    unset($links[$currentLangCode]);

    return [
      '#theme' => 'language_switcher',
      '#data' => [
        'links' => $links,
        'current_language' => $currentLangCode,
      ],
      '#attached' => [
        'library' => ['planet_language_switcher/language-switcher'],
      ],
    ];
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
