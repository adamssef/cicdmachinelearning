<?php
namespace Drupal\planet_core\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class PartnersArticles extends PlanetCorePartnersBase {

  public function loadPartnersArticles() {
    $partners_articles = $this->planetCoreService->getPublishedPartners();

    return new JsonResponse($partners_articles);
  }
}