<?php

namespace Drupal\lgpd_onetrust\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Config\ConfigFactory;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'Onetrust' Block.
 *
 * @Block(
 *   id = "lgpd_onetrust_footer",
 *   admin_label = @Translation("LGPD One Trust Cookie Settings"),
 *   category = @Translation("LGPD Onetrust"),
 * )
 */
class LGPDOneTrustCookieSettings extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * A config store instance.
   *
   * @var \Drupal\Core\ConfigFactory
   */
  protected $config;

  /**
   * Class constructor.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, ConfigFactory $config) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->config = $config;
  }

  /**
   * Dependecny Create Method.
   *
   * @param \Symfony\Component\DependencyInjection\ContainerInterface $container
   *   The container.
   * @param array $configuration
   *   The configuration.
   * @param string $plugin_id
   *   The plugin id.
   * @param mixed $plugin_definition
   *   The plugin definition.
   *
   * @return static
   *   The static create.
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    // Instantiates this form class.
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $lgpd_config = $this->config;
    $lgpd_onetrust_version = $lgpd_config->get('lgpd_onetrust.settings')->get('lgpd_onetrust_version');
    if ($lgpd_onetrust_version == 2) {
      $markup = "<button id='ot-sdk-btn' class='ot-sdk-show-settings'>" . $this->t('Cookie Settings') . "</button>";
    }
    else {
      $markup = "<a class='optanon-toggle-display'>" . $this->t('Cookie Settings') . "</a>";
    }

    $build = [];
    $build['#template'] = $markup;
    $build['#type'] = 'inline_template';
    $build['#cache'] = ['max-age' => 0];

    return $build;
  }

}
