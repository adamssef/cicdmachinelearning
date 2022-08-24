<?php

/**
 * @file
 * Drupal site-specific configuration file.
 */

// @codingStandardsIgnoreFile

// On Acquia Cloud, this include file configures Drupal to use the correct
// database in each site environment (Dev, Stage, or Prod). To use this
// settings.php for development on your local workstation, set $db_url
// (Drupal 5 or 6) or $databases (Drupal 7 or 8) as described in comments
// above.
if (getenv('AH_SITE_ENVIRONMENT')) {

  // Environment settings.php.
  if (file_exists('/var/www/site-php')) {
    require_once '/var/www/site-php/' . getenv('AH_SITE_GROUP') . '/' . getenv('AH_SITE_GROUP') . '-settings.inc';
  }

  // Set the environment paths.
  $settings['file_private_path'] = '/mnt/files/' . getenv('AH_SITE_GROUP') . '.' . getenv('AH_SITE_ENVIRONMENT') . '/'
    . $site_path . '/files-private';
  $config['system.file']['path']['temporary'] = '/mnt/gfs/' . getenv('AH_SITE_GROUP') . '.' . getenv('AH_SITE_ENVIRONMENT')
    . '/' . $site_path . '/tmp';
}

// Memcached settings for Acquia Hosting
if (file_exists(DRUPAL_ROOT . '/sites/default/cloud-memcache-d8+.php')) {
  require(DRUPAL_ROOT . '/sites/default/cloud-memcache-d8+.php');
}
