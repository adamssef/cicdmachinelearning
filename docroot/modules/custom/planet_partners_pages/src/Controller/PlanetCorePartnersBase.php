<?php
namespace Drupal\planet_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_core\Service\PlanetCorePartnersService;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PlanetCorePartnersBase extends ControllerBase {

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCorePartnersService
   */
  protected $planetCoreService;

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCorePartnersService
   *   The planet core service.
   */
  public function __construct(PlanetCorePartnersService $planet_core_service) {
    $this->planetCoreService = $planet_core_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('planet_core.partners_helper')
    );
  }

}