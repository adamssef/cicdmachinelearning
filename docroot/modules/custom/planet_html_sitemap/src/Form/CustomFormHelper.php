<?php

namespace Drupal\planet_html_sitemap\Form;

use Drupal\simple_sitemap\Form\FormHelper;

class CustomFormHelper extends FormHelper {

  /**
   * Returns a customized form to configure the sitemap settings.
   *
   * @param array $form
   *   The form where the settings form is being included in.
   * @param array $settings
   *   The sitemap settings.
   *
   * @return array
   *   The form elements for the sitemap settings.
   */
  public function settingsForm(array $form, array $settings): array {
    $node = \Drupal::routeMatch()->getParameter('node');

    if (!$node) {
      $form['index'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Index'),
        '#default_value' => 0,
      ];
    } else {
      $form['index'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Index'),
        '#default_value' => (int) ($settings['index'] ?? 0),
      ];
    }
    $form['#after_build'][] = [static::class, 'settingsFormStates'];

    $form['priority'] = [
      '#type' => 'select',
      '#title' => $this->t('Priority'),
      '#default_value' => $settings['priority'] ?? NULL,
      '#options' => static::getPriorityOptions(),
    ];
    $form['changefreq'] = [
      '#type' => 'select',
      '#title' => $this->t('Change frequency'),
      '#default_value' => $settings['changefreq'] ?? NULL,
      '#options' => static::getChangefreqOptions(),
      '#empty_option' => $this->t('- Not specified -'),
    ];
    $form['include_images'] = [
      '#type' => 'select',
      '#title' => $this->t('Include images'),
      '#default_value' => (int) ($settings['include_images'] ?? 0),
      '#options' => [$this->t('No'), $this->t('Yes')],
    ];

    return $form;
  }
}