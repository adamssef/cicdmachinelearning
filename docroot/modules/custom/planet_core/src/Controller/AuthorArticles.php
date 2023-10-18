<?php
namespace Drupal\planet_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthorArticles extends ControllerBase
{
    public function loadAuthorArticles($author_id, $limit, $offset)
    {
        $author_articles = planet_core_get_author_articles($author_id, $limit, $offset);
        return new JsonResponse($author_articles);
    }
}