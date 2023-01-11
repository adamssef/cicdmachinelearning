<?php

namespace Drupal\planet_config\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\State\StateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * The Content External configs form.
 */
class PlanetPardotForm extends ConfigFormBase{

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'planet_pardot_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'planet_config.pardot',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['redirects'] = [
      '#type' => 'table',
      '#tree' => TRUE,
      '#header' => [
        $this->t('Webform machine name'),
        $this->t('From path'),
        $this->t('Pardot Destination')
      ],
      '#prefix' => '<div id="planet-pardot-wrapper">',
      '#suffix' => '</div>',
    ];

    // Obtain config.
    if ($domain_redirects = $this->config('planet_config.pardot')->get('webform_redirects')) {
      foreach ($domain_redirects as $key => $value) {
        foreach ($value as $item) {
          $form['redirects'][] = [
            'from' => [
              '#type' => 'textfield',
              '#value' => str_replace(':','.',$key),
            ],
            'sub_path' => [
              '#type' => 'textfield',
              '#value' => $item['sub_path'],
            ],
            'destination' => [
              '#type' => 'textfield',
              '#value' => $item['destination'],
            ],
          ];
        }
      }
    }

    // Fields for the new domain redirects.
    for ($i = 0; $i < $form_state->get('maximum_domains'); $i++) {
      $form['redirects'][] = [
        'from' => [
          '#type' => 'textfield',
          '#attributes' => [
            'autocomplete' => 'off',
          ],
        ],
        'sub_path' => [
          '#type' => 'textfield',
          '#attributes' => [
            'autocomplete' => 'off',
          ],
        ],
        'destination' => [
          '#type' => 'textfield',
          '#attributes' => [
            'autocomplete' => 'off',
          ],
        ],
      ];
    }

    $form['add'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add another'),
      '#submit' => ['::addAnotherSubmit'],
      '#ajax' => [
        'callback' => '::ajaxAddAnother',
        'wrapper' => 'planet-pardot-wrapper',
      ],
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#button_type' => 'primary',
      '#value' => $this->t('Save'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $domain_redirects = [];
    $domain_config = $this->config('planet_config.pardot');

    if ($redirects = $form_state->getValue('redirects')) {
      foreach ($redirects as $redirect) {
        if (!empty($redirect['from']) && !empty($redirect['destination'])) {
          // Replace '.' with ':' for an eligible key.
          // @see \Drupal\redirect_domain\EventSubscriber\DomainRedirectRequestSubscriber::onKernelRequestCheckDomainRedirect()
          $redirect['from'] = str_replace('.', ':', $redirect['from']);
          $domain_redirects[$redirect['from']][] = [
            'sub_path' => '/' . ltrim($redirect['sub_path'], '/'),
            'destination' => $redirect['destination']
          ];
        }
      }
    }
    $domain_config->set('webform_redirects', $domain_redirects);
    $domain_config->save();
    $this->messenger()->addMessage($this->t('The pardot config have been saved.'));
  }

  /**
   * Ajax callback for adding another redirect.
   *
   * @param array $form
   *   The form structure.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The form state.
   *
   * @return array
   *   The new redirect form part.
   */
  public function ajaxAddAnother(array $form, FormStateInterface $form_state) {
    return $form['redirects'];
  }

  /**
   * Submit callback for adding a new field.
   */
  public function addAnotherSubmit(array $form, FormStateInterface $form_state) {
    $form_state->set('maximum_domains', $form_state->get('maximum_domains') + 1);
    $form_state->setRebuild(TRUE);
  }

}
