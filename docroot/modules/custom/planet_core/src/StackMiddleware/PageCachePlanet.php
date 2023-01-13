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
    // Get X-Acquia-Stripped-Query header.
    // This is because of acquia varnish.
    $xAcquiaStrippedQuery = $request->headers->get('X-Acquia-Stripped-Query');

    if (!empty($xAcquiaStrippedQuery)) {
      parse_str($xAcquiaStrippedQuery, $get_array);
      if (is_array($get_array) && !empty($get_array)) {

        $utms = array("utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content");

        foreach ($utms as $utm) {
          if (isset($get_array[$utm]) && !isset($_COOKIE[$utm])) {
            $utm_value = filter_var($get_array[$utm], FILTER_SANITIZE_STRING);
            setrawcookie('Drupal.visitor.' . $utm, rawurlencode($utm_value), REQUEST_TIME + 31536000, '/');
          }
        }
      }
    }

    $this->cid = parent::getCacheId($request);
    return $this->cid;
  }
}
