<?php

namespace Drupal\planet_migrations\Plugin\migrate\process;

use Drupal\Core\Database\Connection;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\planet_core\Service\PlanetCoreNodeService\PlanetCoreNodeServiceInterface;
use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Abstract class for custom tag lookup for migration.
 */
abstract class AbstractProcessPluginBaseExtended extends ProcessPluginBase implements ContainerFactoryPluginInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Active database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $database;

  /**
   * A logger instance.
   *
   * @var \Psr\Log\LoggerInterface
   */
  protected $logger;

  /**
   * Taxonomy service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface
   */
  protected $taxonomyService;

  /**
   * Node service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreNodeService\PlanetCoreNodeServiceInterface
   */
  protected $nodeService;

  /**
   * Constructs a FileLocationMatcher object.
   *
   * @param array $configuration
   *   The plugin configuration.
   * @param string $plugin_id
   *   The plugin ID.
   * @param array $plugin_definition
   *   The plugin definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Database\Connection $database
   * The database connection to be used.
   * @param \Psr\Log\LoggerInterface $logger
   * The logger.
   * @param \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface $taxonomy_service
   *  Taxonomy service.
   * @param \Drupal\planet_core\Service\PlanetCoreNodeService\PlanetCoreNodeServiceInterface $node_service
   *  Node service.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    array $plugin_definition,
    EntityTypeManagerInterface $entity_type_manager,
    Connection $database,
    LoggerInterface $logger,
    PlanetCoreTaxonomyServiceInterface $taxonomy_service,
    PlanetCoreNodeServiceInterface $node_service
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entity_type_manager;
    $this->database = $database;
    $this->logger = $logger;
    $this->taxonomyService = $taxonomy_service;
    $this->nodeService = $node_service;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
      $container->get('database'),
      $container->get('logger.factory')->get('action'),
      $container->get('planet_core.taxonomy_service'),
      $container->get('planet_core.node_service')
    );
  }

}
