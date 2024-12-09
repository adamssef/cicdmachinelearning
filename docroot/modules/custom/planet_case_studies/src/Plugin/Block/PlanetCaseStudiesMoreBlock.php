<?php

namespace Drupal\planet_case_studies\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\planet_core\Service\PlanetCoreCaseStudiesService;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'CasteStudies More' block.
 *
 * @Block(
 *   id = "planet_case_studies_more_block",
 *   admin_label = @Translation("Planet Case Studies More Block"),
 *   category = @Translation("Planet Case Studies More Block")
 * )
 */
class PlanetCaseStudiesMoreBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The planet case studies service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreCaseStudiesService
   */
  public PlanetCoreCaseStudiesService $planetCaseStudiesService;

  /**
   * Constructs a new PlanetHeaderBlock instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\planet_core\Service\PlanetCoreCaseStudiesService $planet_case_studies_service
   *  The planet case studies service.
   */
  public function __construct(
    $configuration,
    $plugin_id,
    $plugin_definition,
    PlanetCoreCaseStudiesService $planet_case_studies_service

  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->planetCaseStudiesService = $planet_case_studies_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('planet_core.case_studies_helper')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $node = \Drupal::routeMatch()->getParameter('node');

    $current_node_data = $this->planetCaseStudiesService->getSingleCaseStudyData($node);

    $block_array = [
      '#theme' => 'block__case_studies_more',
      'case_studies' => $this->planetCaseStudiesService->getCaseStudiesForMoreBlock(0, 4, $current_node_data['products'], $current_node_data['industry'], $current_node_data['company_size']),
    ];
    
    return $block_array;
  }

}
