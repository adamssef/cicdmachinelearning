<?php

namespace Drupal\planet_case_studies\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\planet_core\Service\PlanetCoreCaseStudiesService;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'PlanetCaseStudiesReviews' block.
 *
 * @Block(
 *   id = "planet_case_studies_reviews_block",
 *   admin_label = @Translation("Planet Case Studies Reviews Block"),
 *   category = @Translation("Planet Case Studies Reviews Block")
 * )
 */
class PlanetCaseStudiesReviews extends BlockBase implements ContainerFactoryPluginInterface {

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
    $node_storage = $this->planetCaseStudiesService->entityTypeManager->getStorage('node');
    $reviews = $node_storage->loadByProperties(
      [
        'type' => 'review',
        'status' => 1,
        'field_use_for_case_study_landing' => 1,
      ]
    );

    $reviews_arr = [];

    foreach ($reviews as $review) {
      $reviews_arr[] = [
        'title' => $review->getTitle(),
        'body' => strip_tags($review->get('body')->value),
        'subtitle' => $review->get('field_comment')->value,
      ];
    }

    $block_array = [
      '#theme' => 'block__case_studies_reviews',
      'reviews' => $reviews_arr,
    ];

    return $block_array;
  }

}
