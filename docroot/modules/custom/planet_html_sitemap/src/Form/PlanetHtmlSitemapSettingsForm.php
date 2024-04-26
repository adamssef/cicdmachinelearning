<?php

namespace Drupal\planet_html_sitemap\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class PlanetHtmlSitemapSettingsForm extends ConfigFormBase {

  protected function getEditableConfigNames() {
    return ['planet_html_sitemap.settings'];
  }

  public function getFormId() {
    return 'planet_html_sitemap_custom_settings_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('planet_html_sitemap.settings');

    $form['show_missing_items_in_english'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show missing sitemap items in English (will affect only non-English languages)'),
      '#default_value' => $config->get('show_missing_items_in_english'),
    ];

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->configFactory->getEditable('planet_html_sitemap.settings');
    $config->set('show_missing_items_in_english', $form_state->getValue('show_missing_items_in_english'))
      ->save();

    parent::submitForm($form, $form_state);
  }
}
