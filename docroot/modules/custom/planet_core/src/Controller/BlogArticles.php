<?php
namespace Drupal\planet_core\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;

class BlogArticles extends PlanetCoreArticleBase {

  public function loadBlogArticles($limit, $offset, $lang) {
    $blog_articles = $this->planetCoreService->getBlogArticles($limit, $offset, $lang);

    return new JsonResponse($blog_articles);
  }
}
