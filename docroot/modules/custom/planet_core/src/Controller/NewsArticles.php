<?php
namespace Drupal\planet_core\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class NewsArticles extends PlanetCoreNewsBase {

  public function loadNewsArticles($limit = 9, $offset = 0, $lang = "en", $is_external = false, $filtered = false, $include_featured = true) {
    $news_articles = $this->planetCoreService->getPublishedNews($limit, $offset, $lang, $is_external, $filtered, $include_featured);
    return new JsonResponse($news_articles);
  }
}
