<?php
namespace Drupal\planet_core\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class NewsArticles extends PlanetCoreNewsBase {

  public function loadNewsArticles($limit, $offset, $lang) {
    $blog_articles = $this->planetCoreService->getPublishedNews($limit, $offset, $lang);

    return new JsonResponse($blog_articles);
  }
}
