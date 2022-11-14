<?php

namespace Drupal\lgpd_onetrust_cookie_blocking\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Build configuration form.
 */
class LGPDOneTrustCookieBlocking extends FormBase {

  /**
   * Get formid.
   */
  public function getFormId() {
    return 'Cookieblocking_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function getEditableConfigNames() {
    return ['lgpd_onetrust_cookie_blocking.settings'];
  }

  /**
   * Build configuration form.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('lgpd_onetrust_cookie_blocking.settings');
    $form['external_js_cookie'] = [
      '#type' => 'textarea',
      '#title' => $this->t('External JS'),
      '#default_value' => $config->get('external_js_cookie'),
      '#description' => $this->t('Add Javascript URL along with the cookie category separated by | symbol,
      add one javascript path on each row. eg: path/jsfile|cookie_category_id
      cookie_category_id: 2 => Preformance, 3 => Functional, 4 => Targetting.'),
    ];
    $form['submit'] = ['#type' => 'submit', '#value' => $this->t('Submit')];
    return $form;
  }

  /**
   * Form submit handler.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->configFactory->getEditable('lgpd_onetrust_cookie_blocking.settings')
      ->set('external_js_cookie', $form_state->getValue('external_js_cookie'))
      ->set('ga_performance_cookies', $form_state->getValue('ga_performance_cookies'))
      ->save();
    $this->messenger()->addMessage($this->t('LGPD Onetrust Configuration has been saved.'));
  }

}
