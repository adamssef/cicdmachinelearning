<?php

namespace Drupal\planet_offices\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

/**
 * Provides a block to display language switcher.
 *
 * @Block(
 *   id = "planet_offices_block",
 *   admin_label = @Translation("Planet Offices V3"),
 *   category = @Translation("Custom Blocks")
 * )
 */

class PlanetOfficesBlock extends BlockBase {

  public function getTranslatedRegions(): array {
    $vid = 'planet_offices_regions';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);

    $translatedRegions = [];
    foreach ($terms as $term) {
      $term_entity = Term::load($term->tid);
      $translatedTerm = $term_entity->getTranslation(\Drupal::languageManager()->getCurrentLanguage()->getId());
      $translatedRegions[] = [
        'id' => $translatedTerm->id(),
        'name' => $translatedTerm->getName(),
      ];
    }

    return $translatedRegions;
  }
  
  public function getTranslatedCountries(): array {
    $vid = 'planet_offices_countries';
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
  
    $translatedCountries = [];
    foreach ($terms as $term) {
      $term_entity = Term::load($term->tid);
      $translatedTerm = $term_entity->getTranslation(\Drupal::languageManager()->getCurrentLanguage()->getId());
      $region_id = $translatedTerm->get('field_office_region')->target_id;
      $translatedCountries[] = [
        'id' => $translatedTerm->id(),
        'name' => $translatedTerm->getName(),
        'region_id' => $region_id,
      ];
    }
  
    return $translatedCountries;
  }

  function getOffices()
    {
        $query = \Drupal::entityQuery('node')
            ->condition('type', 'planet_offices')
            ->condition('status', 1); // Optional: Include only published nodes

        $entity_ids = $query->execute();
        $nodes = Node::loadMultiple($entity_ids);

        $offices = [];
        foreach ($nodes as $node) {
            $country_id = $node->get('field_office_country')->target_id;

            // Load the country term to access the referenced region.
            $country_term = \Drupal::entityTypeManager()
                ->getStorage('taxonomy_term')
                ->load($country_id);

            $region_id = NULL;
            if ($country_term) {
                // Retrieve the referenced region ID from the country term.
                $region_id = $country_term->get('field_office_region')->target_id;
            }

            // Get the additional fields from the node.
            $address_1 = $node->get('field_address_1')->value;
            $address_2 = $node->get('field_address_2')->value;
            $address_3 = $node->get('field_address_3')->value;
            $city = $node->get('field_city')->value;
            $county_state = $node->get('field_county_state')->value;
            $postcode = $node->get('field_postcode')->value;

            $office = [
                'node_id' => $node->id(),
                'title' => $node->label(),
                'country_id' => $country_id,
                'region_id' => $region_id,
                'address_1' => $address_1,
                'address_2' => $address_2,
                'address_3' => $address_3,
                'city' => $city,
                'county_state' => $county_state,
                'postcode' => $postcode,
            ];
            $offices[] = $office;
        }
          $f = fopen('my_log.txt', 'a');
            fwrite($f, date('Ymd H:i:s - ') . var_export($offices, true) . "\n");
            fclose($f);
        return $offices;
    }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $data = [
      '#theme' => 'planet_offices',
      '#data' => [
        'regions' => $this->getTranslatedRegions(),
        'countries' => $this->getTranslatedCountries(),
        'offices' => $this->getOffices(),
      ],
      '#attached' => [
        'library' => ['planet_offices/planet-offices'],
      ],
    ];

    return $data;
  }

}