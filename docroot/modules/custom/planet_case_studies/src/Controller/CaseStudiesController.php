<?php
namespace Drupal\planet_case_studies\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_core\Service\PlanetCoreCaseStudiesService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class CaseStudiesController extends ControllerBase {

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreCaseStudiesService
   */
  protected $planetCoreService;

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreCaseStudiesService
   *   The planet core service.
   */
  public function __construct(PlanetCoreCaseStudiesService $planet_core_service) {
    $this->planetCoreService = $planet_core_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('planet_core.case_studies_helper')
    );
  }

  /**
   * Load case studies.
   *
   * @param int $how_many_already_loaded
   *   The number of case studies already loaded.
   * @param string $product_option
   *   The product option.
   * @param string $industry_option
   *   The industry option.
   * @param string $company_size_option
   *   The company size option.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The JSON response.
   */
  public function loadCaseStudies(string $product_option, string $industry_option, string $company_size_option, int $how_many_already_loaded = 0, int $limit = 9) {
    $case_studies = $this->planetCoreService->getCaseStudies($product_option, $industry_option, $company_size_option, $how_many_already_loaded, 9);

    return new JsonResponse($case_studies);
  }

  public function getTotalCaseStudiesCount($product_option, $industry_option, $company_size_option) {
    $total_case_studies_count = $this->planetCoreService->getTotalCaseStudiesCount($product_option, $industry_option, $company_size_option);

    return new JsonResponse($total_case_studies_count);
  }

}
