<?php

/**
 * @file
 * Drupal site-specific configuration file.
 */

// Reverse proxy settings.
$settings['reverse_proxy'] = TRUE;
$settings['reverse_proxy_addresses'] = [$_SERVER['REMOTE_ADDR']];
$settings['reverse_proxy_trusted_headers'] =
  \Symfony\Component\HttpFoundation\Request::HEADER_X_FORWARDED_FOR |
  \Symfony\Component\HttpFoundation\Request::HEADER_X_FORWARDED_PROTO |
  \Symfony\Component\HttpFoundation\Request::HEADER_X_FORWARDED_PORT;

// Database settings.
$databases = [
  'default' => [
    'default' => [
      'database' => getenv('APPSETTING_DATABASE_NAME'),
      'username' => getenv('APPSETTING_DATABASE_USER'),
      'password' => getenv('APPSETTING_DATABASE_PASSWORD'),
      'host'     => getenv('APPSETTING_DATABASE_HOST'),
      'port'     => getenv('APPSETTING_DATABASE_PORT') ?: 3306,
      'driver'   => 'mysql',
      'prefix'   => '',
    ],
  ],
];

// Enable SSL connection if not disabled.
if (!getenv('APPSETTING_DISABLE_DATABASE_SSL')) {
  $databases['default']['default']['pdo'] = [
    PDO::MYSQL_ATTR_SSL_CA => '/var/www/html/azure/certs/uat_db_ca-cert.crt.pem',
  ];
}

// File system paths.
$settings['file_temp_path'] = '/var/www/html/docroot/sites/default/files/tmp';
$settings['file_private_path'] = '/var/www/html/docroot/sites/default/files-private';

// Trusted host patterns.
$settings['trusted_host_patterns'] = [
  '^planet\.lndo\.site$',
  '^.+\.planetmktg\.dev$',
  '^.+\.planetpayment\.com$',
  '^.+\.azurewebsites\.net$',
  '^localhost$',
];

// Logging.
$config['system.logging']['error_level'] = 'verbose';

// Enable DX8 JSON fields debugging.
$settings['dx8_json_fields'] = TRUE;

// Skip file system permissions hardening.
$settings['skip_permissions_hardening'] = TRUE;

// Development services and config splits.
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

// Uncomment if using a config sync directory.
// $settings['config_sync_directory'] = 'profiles/contrib/genius_profile/config/sync';
// $settings['config_sync_directory'] = '../config/default/sync';
// $config['config_split.config_split.local']['status'] = TRUE;

// Performance settings: disable CSS/JS aggregation in dev.
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;

/**
 * Redis configuration.
 */
if (extension_loaded('redis') && getenv('APPSETTING_ENABLE_REDIS')) {

  $settings['redis.connection'] = [
    'interface'  => 'PhpRedis',
    'host'       => getenv('APPSETTING_REDIS_HOST'),
    'port'       => getenv('APPSETTING_REDIS_PORT'),
    'password'   => getenv('APPSETTING_REDIS_PASSWORD'),
    'persistent' => TRUE,
  ];

  $settings['cache_prefix'] = getenv('APPSETTING_REDIS_PREFIX') ?: 'drupal_wap_';

  // Include Redis container configuration.
  $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';
  $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';

  // Manually add the class loader path.
  $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

  // Redis container cache definition.
  $settings['bootstrap_container_definition'] = [
    'parameters' => [],
    'services' => [
      'redis.factory' => [
        'class' => 'Drupal\redis\ClientFactory',
      ],
      'cache.backend.redis' => [
        'class'     => 'Drupal\redis\Cache\CacheBackendFactory',
        'arguments' => ['@redis.factory', '@cache_tags_provider.container', '@serialization.phpserialize'],
      ],
      'cache.container' => [
        'class'     => '\Drupal\redis\Cache\PhpRedis',
        'factory'   => ['@cache.backend.redis', 'get'],
        'arguments' => ['container'],
      ],
      'cache_tags_provider.container' => [
        'class'     => 'Drupal\redis\Cache\RedisCacheTagsChecksum',
        'arguments' => ['@redis.factory'],
      ],
      'serialization.phpserialize' => [
        'class' => 'Drupal\Component\Serialization\PhpSerialize',
      ],
    ],
  ];

  // Cache bins leveraging Redis.
  $settings['cache']['bins']['bootstrap'] = 'cache.backend.chainedfast';
  $settings['cache']['bins']['discovery'] = 'cache.backend.chainedfast';
  $settings['cache']['bins']['config'] = 'cache.backend.chainedfast';

  $settings['cache']['default'] = 'cache.backend.redis';
  $settings['cache']['bins']['render'] = 'cache.backend.redis';

  // Queue services leveraging Redis.
  $settings['queue_default'] = 'queue.redis';
  // Optionally use reliable queues:
  // $settings['queue_default'] = 'queue.redis_reliable';
  $settings['queue_service_aggregator_feeds'] = 'queue.redis';
  // Optionally use reliable queues:
  // $settings['queue_service_aggregator_feeds'] = 'queue.redis_reliable';

} else {
  // Fallback to database caching when Redis isn't enabled.
  $settings['cache']['bins']['bootstrap'] = 'cache.backend.database';
  $settings['cache']['bins']['discovery'] = 'cache.backend.database';
  $settings['cache']['bins']['config'] = 'cache.backend.database';
  $settings['cache']['bins']['render'] = 'cache.backend.database';
  $settings['cache']['bins']['data'] = 'cache.backend.database';
  $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.database';
}