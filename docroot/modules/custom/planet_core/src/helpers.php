<?php

use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsService;

function node_translation_service(): PlanetCoreNodeTranslationsService {
  return \Drupal::service('planet_core.node_translation_service');
}
