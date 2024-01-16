<?php
namespace Drupal\planet_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_core\Service\PlanetCoreArticleService;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PlanetCoreArticleBase extends ControllerBase {

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreArticleService
   */
  protected $planetCoreService;

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreArticleService
   *   The planet core service.
   */
  public function __construct(PlanetCoreArticleService $planet_core_service) {
    $this->planetCoreService = $planet_core_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('planet_core.article_helper')
    );
  }

}
