<?php

namespace Drupal\planet_sitestudio_custom_elements\Plugin\CustomElement;

use Drupal\cohesion_elements\CustomElementPluginBase;
use Drupal\views\Views;

/**
 * Creates a new element view resources.
 *
 * @CustomElement(
 *   id = "views_resources",
 *   label = @Translation("Element View Resources")
 * )
 */
class ViewsResources extends CustomElementPluginBase {

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
      'hook_theme_name' => [
        'htmlClass' => 'col-xs-12',
        'type' => 'textfield',
        'title' => 'Your Hook Theme Element (Default Value is views_resources)',
        'nullOption' => FALSE,
        'placeholder' => 'Enter your hook_theme element on the created hook_theme.',
        'required' => TRUE,
        'validationMessage' => 'Your hook_theme name is required.',
        'defaultValue' => 'views_resources',
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
  public function render($settings, $markup, $class) {

    $view = Views::getView('resources');
    $view->setDisplay('resources_page');
    $view->preExecute();
    $view->render();

    $variables['items'] = null;
    $exposed_input = isset($view->exposed_raw_input) ? $view->exposed_raw_input : NULL;
    if ($view->display_handler->renderPager() && property_exists($view, 'pager')) {
      $element = $view->pager->render($exposed_input);
      $variables = [
        'pager' => $element
      ];
      template_preprocess_pager($variables);
    }

    $variables['items']['current'] = $variables['current'];

    // Render the element.
    return [
      '#theme' => 'views_resources',
      '#template' => 'views-resources',
      '#elementSettings' => $settings,
      '#elementMarkup' => $markup,
      '#elementClass' => $class,
      '#items' => $variables['items'],
    ];
  }
}
