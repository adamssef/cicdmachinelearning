<?php

namespace Drupal\planet_core\Service\PlanetCoreNodeService;

use Drupal\Core\Entity\EntityTypeManagerInterface;

class PlanetCoreNodeService implements PlanetCoreNodeServiceInterface {

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * PlanetPaymentMethodsService constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public function getNodeIdByTitleAndContentType($title, $content_type): int {
    // Load the node (payment_methods type) by its title.
    $node_storage = $this->entityTypeManager->getStorage('node');
    $query = $node_storage->getQuery();
    $query->condition('title', $title);
    $query->condition('type', $content_type);
    $query->accessCheck(FALSE);

    $nids = $query->execute();

    return reset($nids);
  }

}