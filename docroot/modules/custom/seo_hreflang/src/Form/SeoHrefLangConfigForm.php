<?php

namespace Drupal\seo_hreflang\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides settings for all pages.
 */
class SeoHrefLangConfigForm extends ConfigFormBase {

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManager
   */
  protected $languageManager;

  /**
   * Constructs a SeoHreflang object.
   *
   * @param object $entity_manager
   *   The entity manager.
   * @param object $lang_manager
   *   The language manager.
   */
  public function __construct($lang_manager) {
    $this->languageManager = $lang_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('language_manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'seo_hreflang';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'seo_hreflang.settings',
    ];
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Add hreflang textfields for all languages.
    $config = $this->config('seo_hreflang.settings');
    foreach ($this->languageManager->getLanguages() as $langKey => $langObject) {
      $form['language_' . $langKey] = [
        '#type' => 'textfield',
        '#title' => $this->t('Hreflang for :name', [':name' => $langObject->getName()]),
        '#default_value' => $config->get('language_' . $langKey),
        '#description' => $this->t('Please follow the general pattern en-us or en for hreflang'),
      ];
    }

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $configSettings = $this->configFactory->getEditable('seo_hreflang.settings');
    foreach ($this->languageManager->getLanguages() as $langKey => $langObject) {
      $configSettings->set('language_' . $langKey, $form_state->getValue('language_' . $langKey));
    }
    $configSettings->save();
    parent::submitForm($form, $form_state);
  }

}
