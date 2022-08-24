<?php

/**
 * @file
 * Drupal site-specific configuration file.
 */

$databases = [
  'default' => [
    'default' => [
      'database' => 'drupal',
      'username' => 'drupal',
      'password' => 'drupal',
      'host' => 'database',
      'port' => '3306',
      'driver' => 'mysql',
      'prefix' => '',
    ],
  ],
];

$settings['file_temp_path'] = 'sites/default/files/tmp';

$settings['trusted_host_patterns'] = [
  // Production Domains .
  // Local domains (developers environments).
  '^planet\.lndo\.site$',
];

// Config sync.
// $settings['config_sync_directory'] =
// 'profiles/contrib/genius_profile/config/sync';
// $settings['config_sync_directory'] = '../config/default/sync';
// $config['config_split.config_split.local']['status'] = TRUE;
// Include development configurations.
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

// Disable css and js aggregation.
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

// Disable the render cache and disable dynamic page cache.
// $settings['cache']['bins']['render'] = 'cache.backend.null';
// $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';
// This code will prevent needing to clear caches to register a status change
// in a configuration split.
// reference: https://docs.acquia.com/blt/developer/config-split/
$settings['cache']['bins']['discovery'] = 'cache.backend.null';

// Memcache config.
/*
$settings['memcache']['servers'] = ['memcached:11211' => 'default'];
$settings['memcache']['bins'] = ['default' => 'default'];
$settings['memcache']['key_prefix'] = 'default';
$settings['cache']['default'] = 'cache.backend.memcache';
$settings['cache']['bins']['render'] = 'cache.backend.memcache';
*/

// Enables to display total hits and misses.
// $settings['memcache_storage']['debug'] = TRUE;
// Enable errors to be displayed.
$config['system.logging']['error_level'] = 'verbose';

// Private folder
$settings['file_private_path'] = 'sites/default/files-private';

// Enabling JSON Debugging for SS:
$settings['dx8_json_fields'] = TRUE;
