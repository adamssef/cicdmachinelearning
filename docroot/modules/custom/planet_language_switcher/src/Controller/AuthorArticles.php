<?php
namespace Drupal\planet_language_switcher\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthorArticles extends ControllerBase
{
    public function loadAuthorArticles($author_id)
    {
        $author_articles = planet_language_switcher_get_author_articles($author_id);
        return new JsonResponse($author_articles);
    }
}