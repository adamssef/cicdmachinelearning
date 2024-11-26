<?php
namespace Drupal\planet_support\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_support\Service\PlanetSupportService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class SupportController extends ControllerBase {

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_support\Service\PlanetSupportService
   */
  protected $supportService;

  /**
   * The payment methods dedicated service.
   *
   * @var \Drupal\planet_support\Service\PlanetSupportService
   */
  public function __construct(PlanetSupportService $support_service) {
    $this->supportService = $support_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('planet_support.service')
    );
  }

  /**
   * Load support countries by region.
   *
   * @param string $region
   *   The region name.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response.
   */
  public function loadSupportCountriesByRegion($region) {
    if ($region === "null" || $region === 'undefined') {
      $region = NULL;
    }

    return new JsonResponse($this->supportService->getAllCountriesForRegion($region));
  }

  /**
   * Load support emails by company.
   *
   * @param string $company
   *   The company name.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response.
   */
  public function loadSupportEmailsByCompany($company) {
    if ($company === "null" || $company === 'undefined') {
      $company = NULL;
    }

    return new JsonResponse($this->supportService->getAllEmailsForCompany($company));
  }
}
