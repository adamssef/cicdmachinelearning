<?php

namespace Drupal\lgpd_onetrust\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Build configuration form.
 */
class LGPDOneTrustForm extends FormBase {

  /**
   * The language manager service.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * Class constructor.
   */
  public function __construct(LanguageManagerInterface $languageManager) {
    $this->languageManager = $languageManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    // Instantiates this form class.
    return new static(
    // Load the service required to construct this class.
      $container->get('language_manager')
    );
  }

  /**
   * Get formid.
   */
  public function getFormId() {
    return 'lgpd_onetrust_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function getEditableConfigNames() {
    return ['lgpd_onetrust.settings'];
  }

  /**
   * Verify the compatibility with previous version.
   */
  public function getLgpdConfigInfo() {
    $languages = $this->languageManager->getLanguages();
    $config = $this->config('lgpd_onetrust.settings');
    if (count($languages) == 1 && !is_null($config->get('lgpd_onetrust_compliance_uuid'))) {
      return TRUE;
    }
    else {
      return FALSE;
    }
  }

  /**
   * Build configuration form.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $languages = $this->languageManager->getLanguages();
    $config = $this->config('lgpd_onetrust.settings');
    foreach ($languages as $language) {
      $lang_id = $language->getId();
      $field_name = 'lgpd_onetrust_compliance_uuid_' . $lang_id;
      if ($this->getLgpdConfigInfo()) {
        $field_name = 'lgpd_onetrust_compliance_uuid';
      }
      $form[$field_name] = [
        '#type' => 'textfield',
        '#title' => $this->t('UUID for the language') . ' - ' . $language->getName(),
        '#default_value' => $config->get($field_name),
        '#description' => $this->t('Sets the UUID provided by One Trust. This is language dependent for LGPD v1.<br/>UUID should be same for all the languages incase of LGPD v2.'),
      ];
    }
    $form['lgpd_onetrust_version'] = [
      '#type' => 'select',
      '#title' => $this->t('Please select LGPD OneTrust Version'),
      '#options' => ['1' => $this->t('1'), '2' => $this->t('2')],
      '#default_value' => $config->get('lgpd_onetrust_version'),
    ];
    $form['lgpd_autoblock_js'] = [
      '#title' => $this->t('Enable OneTrust autoblock JS'),
      '#type' => 'checkbox',
      '#description' => $this->t('Please select the checkbox only when the onetrust autoblock JS is enabled in OneTrust configuration. Applicable only for LGPD v2.'),
      '#options' => [
        '1' => $this->t('Yes'),
        '0' => $this->t('No'),
      ],
      '#default_value' => $config->get('lgpd_autoblock_js'),
    ];
    $form['submit'] = ['#type' => 'submit', '#value' => $this->t('Submit')];
    return $form;
  }

  /**
   * Validate config form.
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $languages = $this->languageManager->getLanguages();
    foreach ($languages as $language) {
      $lang_id = $language->getId();
      $field_name = 'lgpd_onetrust_compliance_uuid_' . $lang_id;
      if ($this->getLgpdConfigInfo()) {
        $field_name = 'lgpd_onetrust_compliance_uuid';
      }
      $form_value = $form_state->getValue($field_name);

      if (!empty($form_value) && preg_match(LGPD_ONETRUST_UUID_REGEX, $form_value) != 1) {
        $error_message = 'Please provide the Valid UUID for ' . $language->getName();
        $form_state->setErrorByName($field_name, $error_message);
      }
    }
  }

  /**
   * Form submit handler.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $languages = $this->languageManager->getLanguages();
    foreach ($languages as $language) {
      $lang_id = $language->getId();
      $field_name = 'lgpd_onetrust_compliance_uuid_' . $lang_id;
      if ($this->getLgpdConfigInfo()) {
        $field_name = 'lgpd_onetrust_compliance_uuid';
      }
      $form_value = $form_state->getValue($field_name);
      $this->configFactory->getEditable('lgpd_onetrust.settings')
        ->set($field_name, $form_value)
        ->save();
    }
    $this->configFactory->getEditable('lgpd_onetrust.settings')
      ->set('lgpd_onetrust_version', $form_state->getValue('lgpd_onetrust_version'))
      ->save();
    $this->configFactory->getEditable('lgpd_onetrust.settings')
      ->set('lgpd_autoblock_js', $form_state->getValue('lgpd_autoblock_js'))
      ->save();
    $this->messenger()->addMessage($this->t('LGPD Onetrust Configuration has been saved.'));
  }

}
