<?php

namespace Drupal\planet_core\StackMiddleware;

use Drupal\page_cache\StackMiddleware\PageCache;
use Symfony\Component\HttpFoundation\Request;

/**
 * Executes the page caching before the main kernel takes over the request.
 */
class PageCachePlanet extends PageCache
{

  /**
   * Gets the page cache ID for this request.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   A request object.
   *
   * @return string
   *   The cache ID for this request.
   *
   * @codeCoverageIgnore
   */
  protected function getCacheId(Request $request)
  {
    // Reads UTMs from the URL and stores them as cookies if they do not already exist.
    $queryParams = $request->query->all();

    $utms = array("utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content");

    foreach ($utms as $utm) {
      if (isset($queryParams[$utm]) && !isset($_COOKIE[$utm])) {
        $utm_value = filter_var($queryParams[$utm], FILTER_SANITIZE_STRING);
        setrawcookie('Drupal.visitor.' . $utm, rawurlencode($utm_value), REQUEST_TIME + 31536000, '/');
      }
    }

    $this->cid = parent::getCacheId($request);
    return $this->cid;
  }
}
