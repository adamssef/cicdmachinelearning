<?php
namespace Drupal\planet_partners_pages\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class PartnersArticles extends PlanetCorePartnersBase {

  public function loadPartnersArticles() {
    $partners_articles = $this->planetPartnersService->getPublishedPartners();

    return new JsonResponse($partners_articles);
  }
}