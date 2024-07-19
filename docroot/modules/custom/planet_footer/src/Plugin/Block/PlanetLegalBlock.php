<?php

namespace Drupal\planet_footer\Plugin\Block;

use Drupal\planet_footer\Service\PlanetFooterBlockServiceInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

/**
 * Provides a 'LegalBlock' block.
 *
 * @Block(
 *   id = "planet_legal_block",
 *   admin_label = @Translation("Planet Legal Block"),
 *   category = @Translation("Planet Legal Block")
 * )
 */
class PlanetLegalBlock extends BlockBase implements ContainerFactoryPluginInterface {/**
 * The block service from planet_core.
 *
 * @var \Drupal\planet_footer\Service\PlanetFooterBlockServiceInterface
 */
  public $blockService;

  /**
   * Constructs a new PlanetHeaderBlock instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param PlanetFooterBlockServiceInterface $block_service
   *  The block service.
   */
  public function __construct(
    $configuration,
    $plugin_id,
    $plugin_definition,
    PlanetFooterBlockServiceInterface $block_service
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->blockService = $block_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('planet_footer.block_service')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $block_array = [
      '#theme' => 'block__planet_legal_block',
      'legal_menu' => $this->blockService->prepareLinksForLegal(),
      '#current_language_prefix' => $this->blockService->languageManager->getCurrentLanguage()->getId(),
    ];

    return $block_array;
  }
}
