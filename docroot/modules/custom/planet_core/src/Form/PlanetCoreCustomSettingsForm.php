<?php

namespace Drupal\planet_core\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class PlanetCoreCustomSettingsForm extends ConfigFormBase {

  protected function getEditableConfigNames() {
    return ['planet_core.settings'];
  }

  public function getFormId() {
    return 'planet_core_custom_settings_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('planet_core.settings');
    
    $form['enable_new_blog'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable New Blog templates'),
      '#default_value' => $config->get('enable_new_blog'),
    ];

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->configFactory->getEditable('planet_core.settings');
    $config->set('enable_new_blog', $form_state->getValue('enable_new_blog'))
      ->save();

    parent::submitForm($form, $form_state);
  }
}