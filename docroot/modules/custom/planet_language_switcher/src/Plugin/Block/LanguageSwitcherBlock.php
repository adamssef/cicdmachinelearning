<?php

namespace Drupal\planet_language_switcher\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a block to display language switcher.
 *
 * @Block(
 *   id = "planet_language_switcher_block",
 *   admin_label = @Translation("Planet Language Switcher"),
 *   category = @Translation("Custom Blocks"),
 *   context_definitions = {
 *     "node" = @ContextDefinition("entity:node", label = @Translation("Node"))
 *   }
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
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, LanguageManagerInterface $language_manager, RouteMatchInterface $route_match) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->languageManager = $language_manager;
    $this->routeMatch = $route_match;
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
    );
  }

  /**
   * {@inheritdoc}
   *
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  public function build() {
    $languages = $this->languageManager->getLanguages();
    $currentLangCode = $this->languageManager->getCurrentLanguage()->getId();

    // Node to be shown in 'en' lang when there is no translation.
    $defaultLanguage = 'en';

    $links = [];
    foreach ($languages as $lid => $language) {
      $node = $this->routeMatch->getParameter('node');
      if ($node instanceof NodeInterface) {
        $langcode = $node->hasTranslation($lid) ? $lid : $defaultLanguage;
        $links[$lid]['url'] = $node->getTranslation($langcode)->toUrl()->toString();
      }

      $links[$lid]['name'] = $language->getName();
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

}
