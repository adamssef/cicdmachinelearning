<?php

namespace Drupal\planet_sitestudio_custom_elements\CacheContext;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Cache\Context\CacheContextInterface;

/**
 * Defines the ViewComponentCacheContext service, for view's uuid caching.
 *
 * Cache context ID: 'view_component'.
 */
class ViewComponentCacheContext implements CacheContextInterface {

  /**
   * Constructs a new ViewComponentCacheContext service.
   */
  public function __construct() {

  }

  /**
   * {@inheritdoc}
   */
  public static function getLabel() {
    return t("Site Studio View's component cache");
  }

  /**
   * {@inheritdoc}
   */
  public function getContext($parameter = NULL) {
    return $parameter;
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheableMetadata() {
    $cacheable_metadata = new CacheableMetadata();
    $cacheable_metadata->setCacheMaxAge(0);

    return $cacheable_metadata;
  }

}
