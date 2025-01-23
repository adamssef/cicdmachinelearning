<?php

namespace Drupal\planet_payment_methods\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\planet_core\Service\PlanetCoreMenuService\PlanetCoreMenuServiceInterface;
use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;
use Drupal\planet_payment_methods\Service\PlanetPaymentMethodsService;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'HeaderBlock' block.
 *
 * @Block(
 *   id = "planet_payment_methods_block",
 *   admin_label = @Translation("Planet Payment Methods Block"),
 *   category = @Translation("Planet Payment Methods Block")
 * )
 */
class PaymentMethodsBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The block service from planet_core.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreMenuService\PlanetCoreMenuServiceInterface
   */
  public $menuService;

  /**
   * The case studies service from planet_core.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface
   */
  public $taxonomyService;

  /**
   * The payment methods service from planet_payment_methods.
   *
   * @var \Drupal\planet_payment_methods\Service\PlanetPaymentMethodsService
   */
  public $paymentMethodsService;

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
   * @param \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface $taxonomy_service
   *  The taxonomy service.
   * @param \Drupal\planet_payment_methods\Service\PlanetPaymentMethodsService $payment_methods_service
   *  The payment methods service.
   */
  public function __construct(
    $configuration,
    $plugin_id,
    $plugin_definition,
    PlanetCoreMenuServiceInterface $menu_service,
    PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service,
    PlanetPaymentMethodsService $payment_methods_service
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->menuService = $menu_service;
    $this->taxonomyService = $planet_core_taxonomy_service;
    $this->paymentMethodsService = $payment_methods_service;
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
      $container->get('planet_core.taxonomy_service'),
      $container->get('planet_payment_methods.service')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $payment_methods = $this->taxonomyService->getTaxonomyTermsArray('payment_methods');

    $block_array[] = [
      '#theme' => 'block__planet_payment_methods_block',
      '#data' => [
        'payment_methods' => $payment_methods,
        'cards' => $this->paymentMethodsService->getCards(),
      ]
    ];

    return $block_array;
  }

}
