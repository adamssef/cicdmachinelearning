<?php
namespace Drupal\planet_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

class BlogArticles extends ControllerBase
{
    public function loadBlogArticles($limit, $offset, $lang)
    {
        $blog_articles = planet_core_get_blog_articles($limit, $offset, $lang);
        return new JsonResponse($blog_articles);
    }
}