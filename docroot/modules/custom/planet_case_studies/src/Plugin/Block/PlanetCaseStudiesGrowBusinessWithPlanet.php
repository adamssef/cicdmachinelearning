<?php

namespace Drupal\planet_case_studies\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'CasteStudies Landing Page' block.
 *
 * @Block(
 *   id = "planet_case_studies_growth_business_with_planet_block",
 *   admin_label = @Translation("Planet Case Studies Grow Business With Planet Block"),
 *   category = @Translation("Planet Case Studies Block")
 * )
 */
class PlanetCaseStudiesGrowBusinessWithPlanet extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * Constructs a new PlanetHeaderBlock instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   */
  public function __construct(
    $configuration,
    $plugin_id,
    $plugin_definition,

  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $block_array = [
      '#theme' => 'block__grow_business_with_planet',
    ];

    return $block_array;
  }

}
