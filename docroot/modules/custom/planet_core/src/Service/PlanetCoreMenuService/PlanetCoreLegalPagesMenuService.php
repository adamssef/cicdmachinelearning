<?php

namespace Drupal\planet_core\Service\PlanetCoreMenuService;

use Drupal\menu_item_extras\Entity\MenuItemExtrasMenuLinkContentInterface;

class PlanetCoreLegalPagesMenuService extends PlanetCoreMenuService {

  /**
   * {@inheritdoc}
   */
  function getMenuLinkData(MenuItemExtrasMenuLinkContentInterface $entity): array {

    return [
      'title' => $entity->getTitle(),
      'id' => strtolower(str_replace(' ', '-', $entity->getTitle())),
      'url' => $translation_array ?? $entity->getUrlObject()->toString(),
      'weight' => $entity->getWeight(),
      '_blank' => str_starts_with($entity->getUrlObject()->toString(), 'http'),
    ];
  }
}