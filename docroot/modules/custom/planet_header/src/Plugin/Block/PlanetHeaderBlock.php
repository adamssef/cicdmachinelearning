<?php

namespace Drupal\planet_header\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\planet_core\Service\PlanetCoreCaseStudiesService;
use Drupal\planet_core\Service\PlanetCoreMenuService\PlanetCoreMenuServiceInterface;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'HeaderBlock' block.
 *
 * @Block(
 *   id = "planet_header_block",
 *   admin_label = @Translation("Planet Header Block"),
 *   category = @Translation("Planet Header Block")
 * )
 */
class PlanetHeaderBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The block service from planet_core.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreMenuService\PlanetCoreMenuServiceInterface
   */
  public $menuService;

  /**
   * The case studies service from planet_core.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreCaseStudiesService
   */
  public $caseStudiesService;

  /**
   * Constructs a new PlanetHeaderBlock instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param PlanetCoreMenuServiceInterface $menu_service
   *   The menu tree service.
   * @param PlanetCoreCaseStudiesService $case_studies_service
   */
  public function __construct(
    $configuration,
    $plugin_id,
    $plugin_definition,
    PlanetCoreMenuServiceInterface $menu_service,
    PlanetCoreCaseStudiesService $case_studies_service
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->menuService = $menu_service;
    $this->caseStudiesService = $case_studies_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('planet_core.menu_service'),
      $container->get('planet_core.case_studies_helper')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $current_language_prefix = $this->menuService->languageManager->getCurrentLanguage()->getId();

    $block_array[] = [
      '#theme' => 'block__planet_header_block',
      '#data' => [
        'case_studies' => $this->caseStudiesService->getCaseStudies('all', 'all', 'all', 0, 4),
        '#current_language_prefix' => $current_language_prefix ===  'en' ? '' : $current_language_prefix,
      ],
    ];

    return $block_array;
  }

}
