<?php

namespace Drupal\planet_sitestudio_custom_elements\Plugin\CustomElement;

use Drupal\cohesion_elements\CustomElementPluginBase;

/**
 * Creates a new element to attach JS to component.
 *
 * @CustomElement(
 *   id = "attach_js_element",
 *   label = @Translation("Element to Attach JS")
 * )
 */
class AttachJsElement extends CustomElementPluginBase {

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
        'title' => 'Your Hook Theme Element (Default Value is attach_js_element)',
        'nullOption' => FALSE,
        'placeholder' => 'Enter your hook_theme element on the created hook_theme.',
        'required' => TRUE,
        'validationMessage' => 'Your hook_theme name is required.',
        'defaultValue' => 'attach_js_element',
      ],
      'template_name' => [
        'htmlClass' => 'col-xs-12',
        'type' => 'textfield',
        'title' => 'Your Template name (Default Value is attach-js-template)',
        'nullOption' => FALSE,
        'placeholder' => 'Enter your template name.',
        'required' => TRUE,
        'validationMessage' => 'Your Template name is required.',
        'defaultValue' => 'attach-js-template',
      ],
      'module_name' => [
        'htmlClass' => 'col-xs-12',
        'type' => 'textfield',
        'title' => 'Your Module name',
        'nullOption' => FALSE,
        'placeholder' => 'Enter your module name for the theme.',
        'required' => TRUE,
        'validationMessage' => 'Your Module name is required.',
      ],
      'library_name' => [
        'htmlClass' => 'col-xs-12',
        'type' => 'textfield',
        'title' => 'Library Name',
        'nullOption' => FALSE,
        'placeholder' => 'Enter your library name.',
        'required' => TRUE,
        'validationMessage' => 'Your Library name is required.',
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
    return [
      '#theme' => $settings['hook_theme_name'],
      '#template' => $settings['template_name'],
      '#elementSettings' => $settings,
      '#elementMarkup' => $markup,
      '#elementClass' => $class,
    ];
  }

}
