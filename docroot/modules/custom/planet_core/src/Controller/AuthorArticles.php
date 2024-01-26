<?php
namespace Drupal\planet_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\planet_core\Service\PlanetCoreArticleService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;

class AuthorArticles extends PlanetCoreArticleBase {

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


  public function loadAuthorArticles($author_id, $limit, $offset) {
    $author_articles = $this->planetCoreService->getAuthorArticles($author_id, $limit, $offset);

    return new JsonResponse($author_articles);
    }
}
