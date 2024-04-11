<?php

namespace Drupal\planet_sitestudio_custom_elements\Plugin\CustomElement;

use Drupal\cohesion_elements\CustomElementPluginBase;
use Drupal\views\Views;

/**
 * Creates a new element view resources.
 *
 * @CustomElement(
 *   id = "view_case_studies_more_reads",
 *   label = @Translation("Element Case Study Tag")
 * )
 */
class FilterTag extends CustomElementPluginBase {

  /**
   * Builds form you'll see on edit.
   *
   * @return array
   *   Created Form
   *
   * @codeCoverageIgnore
   */
  public function getFields() {
    return [
        'case_study_tag' => [
            'title' => 'Case Study Tag',
            'type' => 'textfield',
          ],
    ];
  }

  /**
   * Renders the element, in my case it'll only be a twig to add JS.
   *
   * @return array
   *   Rendered element
   *
   * @codeCoverageIgnore
   */
  public function render($element_settings, $element_markup, $element_class, $element_context = []) {
    $view = Views::getView('case_studies');
    $view->setDisplay('case_studies_more_reads');
    // Get the tid that was passed from the entity browser and pass it as a views argument.
    // print_r($element_settings['case_study_tag']);
    // exit;
   $entity_uuid = $element_settings['case_study_tag']['entity']['#entityId'];

   if (is_null($entity_uuid)) {
     $default_term_name = 'Product';
     $entity = \Drupal::entityTypeManager()->getStorage('taxonomy_term')
       ->loadByProperties(['name' => $default_term_name]);
   }
    else {
      $entity = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadMultiple()
        ->loadByProperties(['uuid' => $entity_uuid]);;
    }
   $entity = reset($entity);
   $entity_id;
   if($entity){
   $entity_id = $entity->id();
  }
  $arg = $view->setArguments([$entity_id]);
    $view->preExecute();
    
    // Render the element.
    return [
       // update "filterable_block" to your module machine name
      '#theme' => 'case_studies_more_reads_view_block',
      '#elementSettings' => $element_settings,
      '#elementMarkup' => $element_markup,
      '#elementClass' => $element_class,
      '#filteredData' => $view->buildRenderable()
    ];
  }
}