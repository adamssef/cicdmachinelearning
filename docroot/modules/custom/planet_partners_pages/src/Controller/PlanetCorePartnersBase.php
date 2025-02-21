<?php

namespace Drupal\planet_partners_pages\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_partners_pages\Service\PlanetCorePartnersService;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PlanetCorePartnersBase extends ControllerBase {

  protected PlanetCorePartnersService $planetPartnersService;

  public function __construct(PlanetCorePartnersService $planetPartnersService) {
    $this->planetPartnersService = $planetPartnersService;
  }

  public static function create(ContainerInterface $container): static {
    return new static(
      $container->get('planet_partners_pages.partners_helper')
    );
  }

}
