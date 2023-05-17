<?php

namespace Drupal\planet_config\Controller;

use Drupal\Core\Controller\ControllerBase;

class OfficesController extends ControllerBase {

  public function content() {
    $simpleform['simple_form'] = \Drupal::formBuilder()->getForm('Drupal\planet_config\Form\OfficesForm');
    return $simpleform;
  }

}