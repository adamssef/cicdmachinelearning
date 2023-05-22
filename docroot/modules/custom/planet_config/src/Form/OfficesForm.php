<?php
namespace Drupal\planet_config\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

// function log_to_file($text)
// {
//   $f = fopen('my_log.txt', 'a');
//   fwrite($f, date('Ymd H:i:s - ') . $text . "\n");
//   fclose($f);
// }

class OfficesForm extends FormBase
{

  public function getFormId()
  {
    return 'planet_config_offices_form';
  }

  public static function getTidByName($name = NULL, $vid = NULL)
  {
    if (empty($name) || empty($vid)) {
      return 0;
    }
    $properties = [
      'name' => $name,
      'vid' => $vid,
    ];
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties($properties);
    $term = reset($terms);
    return !empty($term) ? $term->id() : 0;
  }

  public static function save_company(
    $country,
    $country_id,
    $city,
    $address_1,
    $address_2,
    $address_3,
    $county,
    $postcode
  ) {
    $title = preg_replace('/[^\x20-\x7E]/', '', $country . " - " . $city);

    $to_create = [
      'type' => 'planet_offices',
      'title' => $title,
      'field_office_country' => ['target_id' => intval($country_id)],
      'field_city' => preg_replace('/[^\x20-\x7E]/', "", $city),
      'field_address_1' => preg_replace('/[^\x20-\x7E]/', "", $address_1),
      'field_address_2' => preg_replace('/[^\x20-\x7E]/', "", $address_2),
      'field_address_3' => preg_replace('/[^\x20-\x7E]/', "", $address_3),
      'field_county_state' => preg_replace('/[^\x20-\x7E]/', "", $county),
      'field_postcode' => preg_replace('/[^\x20-\x7E]/', "", $postcode),
    ];


    $node = \Drupal\node\Entity\Node::create($to_create);

    // Save the node.
    $node->save();
  }

  public function buildForm(array $form, FormStateInterface $form_state)
  {
    $form['#theme'] = ['form_template'];

    $form['csv_file'] = [
      '#type' => 'managed_file',
      '#title' => $this->t('Offices CSV File'),
      '#description' => $this->t('Upload the CSV file containing office data.'),
      '#upload_location' => 'public://media/',
      '#upload_validators' => [
        'file_validate_extensions' => ['csv'],
      ],
      '#required' => TRUE,
    ];

    $form['actions']['#type'] = 'actions';

    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Upload and replace'),
      '#button_type' => 'primary',
    ];
    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state)
  {
    $file_id = $form_state->getValue('csv_file')[0];
    $file = \Drupal\file\Entity\File::load($file_id);

    if ($file) {
      $file->setPermanent();
      $file->save();

      // Parse the CSV file.
      $csv_contents = file_get_contents($file->getFileUri());

      // Delete existing companies
      $nodes = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->loadByProperties(['type' => 'planet_offices']);

      if (!empty($nodes)) {
        $node_storage = \Drupal::entityTypeManager()->getStorage('node');
        $node_storage->delete($nodes);
      }

      $csvData = file_get_contents($file->getFileUri());
      $lines = explode(PHP_EOL, $csvData);
      $array = array();
      foreach ($lines as $line) {
        $array[] = str_getcsv($line, ";");
      }
      array_shift($array); // delete first row
      array_pop($array);

      foreach ($array as $company) {

        $country = self::getTidByName(trim($company[1]), "planet_offices_countries");

        if (!$country) {

          $region = self::getTidByName(trim($company[0]), "planet_offices_regions");
          if (!$region) {
            $region = \Drupal\taxonomy\Entity\Term::create([
              'name' => trim($company[0]),
              'vid' => 'planet_offices_regions',
            ]);
            $region->save();
            $region = $region->id();
          }

          $country = \Drupal\taxonomy\Entity\Term::create([
            'name' => trim($company[1]),
            'field_office_region' => $region,
            'vid' => 'planet_offices_countries',
          ]);
          $country->save();
          $country = $country->id();
        }
        // log_to_file(
        //   var_export(
        //     array(
        //       $region,
        //       $company[1],
        //       $country,
        //       $company[2],
        //       $company[3],
        //       $company[4],
        //       $company[5],
        //       $company[6],
        //       $company[7]
        //     ),
        //     true
        //   )
        // );
        self::save_company(
          $company[1],
          $country,
          $company[2],
          $company[3],
          $company[4],
          $company[5],
          $company[6],
          $company[7]
        );

        // Save the node.
      }

      $messenger = \Drupal::messenger();
      $messenger->addMessage($this->t('The file %filename has been uploaded.', ['%filename' => $file->getFilename()]));
    }
  }

}