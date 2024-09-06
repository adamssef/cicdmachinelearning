<?php

/**
 * @file
 * Drupal site-specific configuration file.
  */


  $databases = [
    'default' => [
      'default' => [
        'database' => getenv('APPSETTING_DATABASE_NAME'),
        'username' => getenv('APPSETTING_DATABASE_USER'),
        'password' => getenv('APPSETTING_DATABASE_PASSWORD'),
        'host' => getenv('APPSETTING_DATABASE_HOST'),
        'port' => getenv('APPSETTING_DATABASE_PORT') ? getenv('APPSETTING_DATABASE_PORT') : 3306,
        'driver' => 'mysql',
        'prefix' => ''
      ],
    ],
  ];
  if (!getenv('APPSETTING_DISABLE_DATABASE_SSL')) {
    // Add the 'pdo' array to the configuration
    $databases['default']['default']['pdo'] = [
        PDO::MYSQL_ATTR_SSL_CA => '/var/www/html/azure/certs/uat_db_ca-cert.crt.pem'
    ];
}

$settings['file_temp_path'] = '/var/www/html/docroot/sites/default/files/tmp';

$settings['trusted_host_patterns'] = [
  '^planet\.lndo\.site$',
  '^.+\.planetmktg\.dev$',
  '^.+\.planetpayment\.com$',
  '^.+\.azurewebsites\.net$',
  '^localhost$',
];

$config['system.logging']['error_level'] = 'verbose';

// Private folder
$settings['file_private_path'] = '/var/www/html/docroot/sites/default/files-private';

// Enabling JSON Debugging for SS:
$settings['dx8_json_fields'] = TRUE;

// Skip file system permissions hardening.
$settings['skip_permissions_hardening'] = TRUE;


// Config sync.
// $settings['config_sync_directory'] =
// 'profiles/contrib/genius_profile/config/sync';
// $settings['config_sync_directory'] = '../config/default/sync';
// $config['config_split.config_split.local']['status'] = TRUE;
// Include development configurations.
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';


// $settings['cache']['bins']['render'] = 'cache.backend.null';
// $settings['cache']['bins']['page'] = 'cache.backend.null';
// $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';

// Disable css and js aggregation.
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;



if (extension_loaded('redis') && getenv('APPSETTING_ENABLE_REDIS')) {

  // Set Redis as the default backend for any cache bin not otherwise specified.
  // $settings['cache']['default'] = 'cache.backend.redis';
  $settings['redis.connection']['interface'] = 'PhpRedis'; // Can be "Predis".
  $settings['redis.connection']['host'] = getenv('APPSETTING_REDIS_HOST');
  $settings['redis.connection']['port'] = getenv('APPSETTING_REDIS_PORT');
  $settings['redis.connection']['password'] = getenv('APPSETTING_REDIS_PASSWORD'); // If you are using passwords, otherwise, omit
  $settings['redis.connection']['persistent'] = TRUE; // Persistant connection.
  $settings['cache_prefix'] = getenv('APPSETTING_REDIS_PREFIX') ? getenv('APPSETTING_REDIS_PREFIX') : 'drupal_tf_';


  // Apply changes to the container configuration to better leverage Redis.
  // This includes using Redis for the lock and flood control systems, as well
  // as the cache tag checksum. Alternatively, copy the contents of that file
  // to your project-specific services.yml file, modify as appropriate, and
  // remove this line.
  $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';

  // Allow the services to work before the Redis module itself is enabled.
  $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';

  // Manually add the classloader path, this is required for the container cache bin definition below
  // and allows to use it without the redis module being enabled.
  $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

  // Use redis for container cache.
  // The container cache is used to load the container definition itself, and
  // thus any configuration stored in the container itself is not available
  // yet. These lines force the container cache to use Redis rather than the
  // default SQL cache.
  $settings['bootstrap_container_definition'] = [
    'parameters' => [],
    'services' => [
      'redis.factory' => [
        'class' => 'Drupal\redis\ClientFactory',
      ],
      'cache.backend.redis' => [
        'class' => 'Drupal\redis\Cache\CacheBackendFactory',
        'arguments' => ['@redis.factory', '@cache_tags_provider.container', '@serialization.phpserialize'],
      ],
      'cache.container' => [
        'class' => '\Drupal\redis\Cache\PhpRedis',
        'factory' => ['@cache.backend.redis', 'get'],
        'arguments' => ['container'],
      ],
      'cache_tags_provider.container' => [
        'class' => 'Drupal\redis\Cache\RedisCacheTagsChecksum',
        'arguments' => ['@redis.factory'],
      ],
      'serialization.phpserialize' => [
        'class' => 'Drupal\Component\Serialization\PhpSerialize',
      ],
    ],
  ];
  
  
  /** @see: https://pantheon.io/docs/redis/ */
  // Always set the fast backend for bootstrap, discover and config, otherwise
  // this gets lost when redis is enabled.
  $settings['cache']['bins']['bootstrap'] = 'cache.backend.chainedfast';
  $settings['cache']['bins']['discovery'] = 'cache.backend.chainedfast';
  $settings['cache']['bins']['config'] = 'cache.backend.chainedfast';

  /** @see: https://github.com/md-systems/redis */
  // Use for all bins otherwise specified.
  $settings['cache']['default'] = 'cache.backend.redis';

  // Use this to only use it for specific cache bins.
  $settings['cache']['bins']['render'] = 'cache.backend.redis';

  // Use for all queues unless otherwise specified for a specific queue.
  $settings['queue_default'] = 'queue.redis';

  // Or if you want to use reliable queue implementation.
  $settings['queue_default'] = 'queue.redis_reliable';

  // Use this to only use Redis for a specific queue (aggregator_feeds in this case).
  $settings['queue_service_aggregator_feeds'] = 'queue.redis';

  // Or if you want to use reliable queue implementation.
  $settings['queue_service_aggregator_feeds'] = 'queue.redis_reliable';

} else {

  // $settings['cache']['default'] = 'cache.backend.database';

  # Force common chainedfast bin to use database.
  $settings['cache']['bins']['discovery'] = 'cache.backend.database';
  $settings['cache']['bins']['bootstrap'] = 'cache.backend.database';
  $settings['cache']['bins']['render'] = 'cache.backend.database';
  $settings['cache']['bins']['data'] = 'cache.backend.database';
  $settings['cache']['bins']['config'] = 'cache.backend.database';
  $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.database';


}