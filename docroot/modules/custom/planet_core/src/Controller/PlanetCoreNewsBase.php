<?php
namespace Drupal\planet_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_core\Service\PlanetCoreNewsService;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PlanetCoreNewsBase extends ControllerBase {

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreNewsService
   */
  protected $planetCoreService;

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreNewsService
   *   The planet core service.
   */
  public function __construct(PlanetCoreNewsService $planet_core_service) {
    $this->planetCoreService = $planet_core_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('planet_core.news_helper')
    );
  }

}
