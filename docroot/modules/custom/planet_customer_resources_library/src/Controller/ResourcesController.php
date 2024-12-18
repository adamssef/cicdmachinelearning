<?php

namespace Drupal\planet_customer_resources_library\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_customer_resources_library\Service\PlanetCustomerResourcesLibraryService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class ResourcesController extends ControllerBase {

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_customer_resources_library\Service\PlanetCustomerResourcesLibraryService
   */
  protected $resourceService;

  /**
   * The planet core service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreCaseStudiesService
   *   The planet core service.
   */
  public function __construct(PlanetCustomerResourcesLibraryService $resource_service) {
    $this->resourceService = $resource_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('planet_customer_resources_library.service')
    );
  }


  public function getFilteredContent(string $category) {
    return new JsonResponse($this->resourceService->getResourcesByCategory($category));
  }

  public function getFilteredContentWithText(string $category, string $text) {
    $test = new JsonResponse($this->resourceService->getResourcesByCategoryWithText($category, $text));
    return $test;
  }


}