<?php

namespace Drupal\planet_language_switcher\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class LanguageDetectionSettingsForm extends ConfigFormBase {

  protected function getEditableConfigNames() {
    return ['planet_language_switcher.settings'];
  }

  public function getFormId() {
    return 'planet_language_switcher_language_detection_settings_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('planet_language_switcher.settings');
    
    $form['enable_language_detection'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable Language Detection'),
      '#default_value' => $config->get('enable_language_detection'),
    ];

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->configFactory->getEditable('planet_language_switcher.settings');
    $config->set('enable_language_detection', $form_state->getValue('enable_language_detection'))
      ->save();

    parent::submitForm($form, $form_state);
  }
}