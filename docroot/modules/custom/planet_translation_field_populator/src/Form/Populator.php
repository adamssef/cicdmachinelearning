<?php

namespace Drupal\planet_translation_field_populator\Form;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Populator extends FormBase {

  /**
   * The entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new PopulatorForm.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'planet_translation_field_populator_form';
  }

  /**
   * Build the form.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Load all content types.
    $content_types = $this->entityTypeManager->getStorage('node_type')->loadMultiple();

    $content_type_options = [];
    foreach ($content_types as $machine_name => $content_type) {
      $content_type_options[$machine_name] = $content_type->label();
    }

    $form['help'] = [
      '#type' => 'item',
      '#title' => t('<span style="color:orange; font-size:200%">CAUTION!</span>'),
      '#markup' => t('This module allows you to copy the values of selected fields from the English version to <b>all other</b> translations (DE, FR, IT, ES) simultaneously.<br><br><b>USE CASE:</b> <i>User X has set the correct logo files in all English translations for all case studies. Now, User X wants to populate the selected logos across all other translations. To do this, select "Case studies" from the content type dropdown, choose the appropriate field name, and finally, click the "Populate Fields" button</i>.<br><br><span style="color: red;"><b>USE CAREFULLY. CONSOLUT WITH DEVELOPERS.</b></span>'),
    ];

    // Content type select element.
    $form['content_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Select a content type to populate'),
      '#options' => $content_type_options,
      '#empty_option' => $this->t('- Select -'),
      '#ajax' => [
        'callback' => '::updateFields',
        'wrapper' => 'fields-wrapper',
        'event' => 'change',
      ],
    ];

    // Fields container that will be replaced via AJAX.
    $form['fields_wrapper'] = [
      '#type' => 'container',
      '#attributes' => ['id' => 'fields-wrapper'],
    ];

    // Check if a content type has been selected.
    $selected_content_type = $form_state->getValue('content_type');
    if (!empty($selected_content_type)) {
      $field_options = $this->getFieldOptions($selected_content_type);

      if (!empty($field_options)) {
        $form['fields_wrapper']['fields'] = [
          '#type' => 'checkboxes',
          '#title' => $this->t('Select fields to populate'),
          '#options' => $field_options,
          '#default_value' => [],
        ];
      }
      else {
        $form['fields_wrapper']['no_fields'] = [
          '#markup' => $this->t('No custom fields available for this content type.'),
        ];
      }
    }

    // Submit button.
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Populate Fields'),
      '#disabled' => FALSE,
    ];

    return $form;
  }

  /**
   * AJAX callback to update fields based on selected content type.
   */
  public function updateFields(array &$form, FormStateInterface $form_state) {
    return $form['fields_wrapper'];
  }

  /**
   * Retrieve field options for a given content type.
   *
   * @param string $content_type
   *   The machine name of the content type.
   *
   * @return array
   *   An associative array of field machine names and labels.
   */
  protected function getFieldOptions($content_type) {
    $fields = $this->entityTypeManager->getStorage('field_config')->loadByProperties([
      'entity_type' => 'node',
      'bundle' => $content_type,
    ]);

    $field_options = [];
    foreach ($fields as $field) {
      $field_options[$field->getName()] = $field->label();
    }

    return $field_options;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $fields= $form_state->getValues()['fields'];

    $fields_to_be_populated = [];

    foreach ($fields as $key => $field) {
      if ($fields[$key] !== 0) {
        $fields_to_be_populated[] = $field;
      }
    }

    if (!empty($fields_to_be_populated)) {
      $nodes = $this->entityTypeManager
        ->getStorage('node')
        ->loadByProperties(
          [
          'type' => 'case_studies'
          ]
      );

      $original_vals = [];

      foreach ($nodes as $node) {
        foreach ($fields_to_be_populated as $field) {
          if (isset($node->get($field)->getValue()[0]['target_id'])) {
            $original_vals[$field] = $node->get($field)->getValue()[0]['target_id'];
          }

          if (isset($node->get($field)->getValue()[0]['value'])) {
            $original_vals[$field] = $node->get($field)->getValue()[0]['value'];
          }
        }
      }

      $languages = $node->getTranslationLanguages();

      foreach ($languages as $id => $language) {
        foreach ($fields_to_be_populated as $field) {
          $node->getTranslation($id)->set($field, $original_vals[$field]);
          $node->getTranslation($id)->save();
        }
      }

    }
  }

}
