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
use Drupal\Core\Language\Language;

/**
 * Provides a block to display language switcher.
 *
 * @Block(
 *   id = "planet_language_switcher_block",
 *   admin_label = @Translation("Planet Language Switcher"),
 *   category = @Translation("Custom Blocks")
 * )
 */
class LanguageSwitcherBlock extends BlockBase implements ContainerFactoryPluginInterface
{

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
    public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition)
    {
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
    public function pretty_lang_name($id): string
    {
        $lang_dict = array(
            "en" => "Global",
            "fr" => "France",
            "it" => "Italia",
            "de" => "Deutschland",
            "es" => "España"
        );
        $name = $this->languageManager->getLanguageName($id);
        return $lang_dict[$id] . " (" . $name . ")";
    }

    /**
     * {@inheritdoc}
     */
    public function build(): array
    {

        $default_language = $this->languageManager->getDefaultLanguage();

        $base_path = \Drupal::request()->getBasePath();
        $languages = $this->languageManager->getLanguages();
        $current_lang_id = $this->languageManager->getCurrentLanguage()->getId();
        $current_lang = $this->languageManager->getCurrentLanguage();

        $lang_url_list = [];
        $is_frontpage = \Drupal::service('path.matcher')->isFrontPage();

        foreach ($languages as $language) {
            // Get the current URL in each language.
            $url = \Drupal\Core\Url::fromRoute('<current>')
                ->setOption('language', $language)->toString();

            // Check if the URL has a translation.
            $has_translation = false;
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
            $flag = $base_path . '/resources/flag-icons/' . $language->getId() . '.svg';

            $lang_url_list[$language->getId()] = array(
                "url" => $url,
                "name" => $name,
                "flag" => $flag,
                "active" => $has_translation
            );
        }

        $current_lang = $lang_url_list[$current_lang_id];
        unset($lang_url_list[$current_lang_id]);

        $lang_arr = [
            '#theme' => 'language_switcher',
            '#data' => [
                'links' => $lang_url_list,
                'current_language' => $current_lang,
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
    public function getCacheTags()
    {
        if ($node = \Drupal::routeMatch()->getParameter('node')) {
            return Cache::mergeTags(parent::getCacheTags(), ['node:' . $node->id()]);
        } else {
            return parent::getCacheTags();
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getCacheContexts()
    {
        return Cache::mergeContexts(parent::getCacheContexts(), ['route']);
    }

}