<?php

namespace Drupal\planet_core\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\image\Entity\ImageStyle;
use Drupal\media\Entity\Media;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface;
use Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface;

/**
 * Class PlanetCoreService - a helper class for article-related functionalities.
 */
class PlanetCoreCaseStudiesService {

  /**
   * Entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  public $entityTypeManager;

  /**
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected $fileUrlGenerator;

  /**
   * The path alias manager.
   *
   * @var \Drupal\path_alias\AliasManagerInterface
   */
  protected $pathAliasManager;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * The taxonomy service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface
   */
  public $planetCoreTaxonomyService;

  /**
   * The node translation service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface
   */
  public $planetCoreNodeTranslationsService;

  /**
   * The media service.
   *
   * @var \Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface
   */
  public $planetCoreMediaService;

  /**
   * Constructs a new PlantCoreService object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $file_url_generator
   *  The file url generator service.
   * @param \Drupal\path_alias\AliasManagerInterface $path_alias_manager
   *   The path alias manager service.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager service.
   * @param \Drupal\planet_core\Service\PlanetCoreTaxonomyService\PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service
   *   The planet core taxonomy service.
   * @param \Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service
   *   The node translation service.
   * @param \Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface $planet_core_media_service
   *   The media service.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    FileUrlGeneratorInterface $file_url_generator,
    AliasManagerInterface $path_alias_manager,
    LanguageManagerInterface $language_manager,
    PlanetCoreTaxonomyServiceInterface $planet_core_taxonomy_service,
    PlanetCoreNodeTranslationsServiceInterface $planet_core_node_translations_service,
    PlanetCoreMediaServiceInterface $planet_core_media_service
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->fileUrlGenerator = $file_url_generator;
    $this->pathAliasManager = $path_alias_manager;
    $this->languageManager = $language_manager;
    $this->planetCoreTaxonomyService = $planet_core_taxonomy_service;
    $this->planetCoreNodeTranslationsService = $planet_core_node_translations_service;
    $this->planetCoreMediaService = $planet_core_media_service;
  }

  /**
   * Retrieves case studies starting from a specific index and
   * continues to load the next 9 articles from that point.
   *
   * @param int $start The starting index (0-based) for case studies.
   *
   * @return array An array of case study data.
   */
  public function getCaseStudies($product_option, $industry_option, $company_size_option, int $offset, $limit) {
    $product_option_tid = strtolower($product_option) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($product_option, 'case_studies_products') : NULL;
    $industry_option_tid = strtolower($industry_option) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($industry_option, 'case_studies_industry') : NULL;
    $company_size_option_tid = strtolower($company_size_option) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($company_size_option, 'company_size') : NULL;
    $current_lang = $this->planetCoreNodeTranslationsService->determineTheLangId();

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'case_studies')
      ->range($offset, $limit)
      ->sort('created', 'DESC')
      ->condition('langcode', $current_lang, '=')
      ->condition('status', TRUE)
      ->accessCheck(FALSE); // Sorting by creation date, adjust as needed

    if ($product_option_tid !== NULL) {
      $query->condition('field_product_type', $product_option_tid);
    }

    if ($industry_option_tid !== NULL) {
      $query->condition('field_industry_type', $industry_option_tid);
    }

    if ($company_size_option_tid !== NULL) {
      $query->condition('field_company_size', $company_size_option_tid);
    }

    $nids = $query->execute();

    return $this->prepareCaseStudiesData($nids);
  }

  public function getCaseStudiesForMoreBlock(int $offset, $limit, $product_option, $industry_option, $company_size_option) {
    $product_option_tids = [];
    $current_lang = $this->languageManager->getCurrentLanguage()->getId();

    foreach ($product_option as $product) {
      $product_option_tids[] = $this->planetCoreTaxonomyService->getTermIdByTermName($product, 'case_studies_products');
    }

    if (count($product_option_tids) === 1) {
      $product_option_tid = reset($product_option_tids);
      $product_option_tids = NULL;
    }

    if (empty($product_option_tids)) {
      $product_option_tids = NULL;
    }

    if ($industry_option !== null) {
      $industry_option_tid = strtolower($industry_option) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($industry_option, 'case_studies_industry') : NULL;
    }

    if ($company_size_option !== null) {
      $company_size_option_tid = strtolower($company_size_option) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($company_size_option, 'company_size') : NULL;
    }

    $current_node = \Drupal::routeMatch()->getParameter('node');

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'case_studies')
      ->range($offset, $limit)
      ->sort('created', 'DESC')
      ->condition('status', 1)
      ->condition('langcode', $current_lang, '=')
      ->condition('nid', $current_node->id(), '<>')
      ->accessCheck(FALSE); // Sorting by creation date, adjust as needed

    if (isset($product_option_tid)) {
      $query->condition('field_product_type', $product_option_tid);
    }

    if ($product_option_tids !== NULL) {
      $query->condition('field_product_type', $product_option_tids, 'IN');
    }

    if (isset($industry_option_tid)) {
      $query->condition('field_industry_type', $industry_option_tid);
    }

    if (isset($company_size_option_tid)) {
      $query->condition('field_company_size', $company_size_option_tid);
    }

    $nids = $query->execute();

    if (count($nids) < 4) {
      $how_many_left = 4 - count($nids);

      $query = $this->entityTypeManager->getStorage('node')->getQuery()
        ->condition('type', 'case_studies')
        ->range(0, $how_many_left)
        ->sort('created', 'DESC')
        ->condition('status', 1)
        ->accessCheck(FALSE); // Sorting by creation date, adjust as needed

      $additional_nids = $query->execute();

      return $this->prepareCaseStudiesData(array_merge($nids, $additional_nids));
    }




    return $this->prepareCaseStudiesData($nids);
  }

  public function getTotalCaseStudiesCount($product_option, $industry_option, $company_size_option) {
    $product_option_tid = strtolower($product_option) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($product_option, 'case_studies_products') : NULL;
    $industry_option_tid = strtolower($industry_option) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($industry_option, 'case_studies_industry') : NULL;
    $company_size_option_tid = strtolower($company_size_option) !== "all" ? $this->planetCoreTaxonomyService->getTermIdByTermName($company_size_option, 'company_size') : NULL;
    $current_language = $this->languageManager->getCurrentLanguage()->getId();

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'case_studies')
      ->condition('langcode', $current_language, '=')
      ->sort('created', 'DESC')
      ->condition('status', 1)
      ->accessCheck(FALSE); // Sorting by creation date, adjust as needed

    if ($product_option_tid !== NULL) {
      $query->condition('field_product_type', $product_option_tid);
    }

    if ($industry_option_tid !== NULL) {
      $query->condition('field_industry_type', $industry_option_tid);
    }

    if ($company_size_option_tid !== NULL) {
      $query->condition('field_company_size', $company_size_option_tid);
    }

    return $query->count()->execute();
  }

  /**
   * Retrieves case studies starting from a specific index and
   * continues to load the next 9 articles from that point.
   *
   * @param int $start The starting index (0-based) for case studies.
   *
   * @return array An array of case study data.
   */
  public function getAllCaseStudies() {
    $lang = $this->planetCoreNodeTranslationsService->determineTheLangId();

    $query = $this->entityTypeManager->getStorage('node')->getQuery()
      ->condition('type', 'case_studies')
      ->condition('langcode', $lang, '=')
      ->sort('created', 'DESC')
      ->condition('status', 1)
      ->accessCheck(FALSE); // Sorting by creation date, adjust as needed

    $nids = $query->execute();

    if (count($nids) < 25) {
      return $this->prepareCaseStudiesData($nids, 25);
    }
    else {
      return $this->prepareCaseStudiesData($nids);
    }
  }


  /**
   * Retrieves single case study data returned in an associative array.
   *
   * @param NodeInterface $node
   *   The node object of the case study.
   *
   * @return array
   *   A keyed array of case study data.
   */
  public function getSingleCaseStudyData(NodeInterface $node) {
    if ($node->getType() !== 'case_studies') {
      return [];
    }

    $langcode = \Drupal::languageManager()->getCurrentLanguage()->getId();

    $translation = $node->getTranslation($langcode);
    $recommendation_ent = $translation->get('field_recommendation')->entity;

    if ($recommendation_ent->hasTranslation($langcode)) {
      $recommendation_ent = $recommendation_ent->getTranslation($langcode);
    }
    $author = $recommendation_ent->get('field_name_and_surname')->value;

    $industry = !is_null($node->get('field_industry_type')->target_id) ? $this->planetCoreTaxonomyService->getTermNameById($node->get('field_industry_type')->target_id) : NULL;
    $all_products_from_term_field = $node->get('field_product_type')->getValue();
    $products = [];
    $metrics = $this->getMetricsDataFromParagraph($node);

    $recommendations = $node->field_recommendation->referencedEntities();
    $recommendations_data = [];
    $definitions = \Drupal::service('entity_field.manager')->getFieldDefinitions('paragraph', 'customer_recommendation_quote');
    $default_quote_version_list_value = $definitions['field_quote_version_list']->getDefaultValueLiteral()[0]['value'];

    if (!empty($recommendations)) {
      foreach ($recommendations as $key => $r) {
        $customer_avatar_url = $r->field_customer_avatar->target_id ? $this->planetCoreMediaService->getStyledImageUrl($r->field_customer_avatar->target_id, 'large') : NULL;
        $selected_version_value = $r->field_quote_version_list->getValue()[0]['value'] ?? $default_quote_version_list_value;
        $selected_version_value = str_replace('_', '-',$selected_version_value);

        $recommendations_data[$key] = [

          'recommendation_text' => self::trimFromDoubleQuote($r->field_recommendation_text->getValue()[0]['value']),
          'visual_version' => $selected_version_value,
          'fname_and_sname' => $r->field_name_and_surname->getValue()[0]['value'],
          'debug' => $author,
          'role' => $r->field_customer_role->getValue()[0]['value'],
          'customer_avatar_url' => $customer_avatar_url,
          'dark_mode' => $r->field_dark_mode->getValue()[0]['value'],
        ];
      }
    }

    $grow_your_business_paragraph = $node->field_grow_business_with_planet->referencedEntities();
    $grow_your_business_paragraph = reset($grow_your_business_paragraph);
    $link_box_paragraph = $node->field_link_box->referencedEntities();
    $link_box_paragraph = reset($link_box_paragraph);
    $tip_box_paragraph = $node->field_tip_box->referencedEntities();
    $tip_box_paragraph = reset($tip_box_paragraph);
    $favourite_features = $node->field_favourite_features->referencedEntities();
    $favourite_features = reset($favourite_features);


    if (!$grow_your_business_paragraph) {
      $grow_your_business_settings = NULL;
    }
    else {
      $grow_your_business_settings = [
        'color' => $grow_your_business_paragraph->field_color_of_the_component->value,
        'size' => $grow_your_business_paragraph->field_size_of_the_component->value,
      ];
    }
    
    if (!$link_box_paragraph) {
      $link_box_paragraph = NULL;
    }
    else {
      $link_box_paragraph = [
        'image' => $link_box_paragraph->field_image->target_id ? $this->planetCoreMediaService->getStyledImageUrl($link_box_paragraph->field_image->target_id, 'large') : NULL,
        'link' => str_replace('internal:/', '',$link_box_paragraph->field_link_box_link->uri),
        'title' => $link_box_paragraph->field_link_box_title->value,
        'text' => $link_box_paragraph->field_link_text->value,
      ];
    }

    if (!$tip_box_paragraph) {
      $tip_box_paragraph = NULL;
    }
    else {
      $tip_box_paragraph = [
        'label' => $tip_box_paragraph->field_tip_box_label->value,
        'text' => $tip_box_paragraph->field_tip_box_text->value,
      ];
    }

    if (!$favourite_features) {
      $favourite_features = NULL;
    }
    else {
      $favourite_features = [
        'title' => $favourite_features->field_label->value,
        'text_items' => $favourite_features->get('field_features')->getValue(),
      ];

      $text = [];

      foreach ($favourite_features['text_items'] as $feature) {
        $text[] = $feature['value'];
      }

      $favourite_features['text_items'] = $text;
    }

    if (!empty($all_products_from_term_field)) {
      foreach ($all_products_from_term_field as $product) {
        $product_tid = $product['target_id'];
        $product_name = $this->planetCoreTaxonomyService->getTermNameById($product_tid);
        $products[] = $product_name;
      }
    }

    return [
      'title' => $node->getTitle(),
      'company_name' => $node->get('field_company_name')->value,
      'company_size' => $this->getCompanySize($node),
      'company_size_in_numbers' => $this->getCompanySizeInNumbers($node),
      'case_study_alias' => $this->pathAliasManager->getAliasByPath('/node/' . $node->id()),
      'industry' => $industry,
      'products' => $products,
      'headquarter_city' => $node->get('field_headquarter_city')->value,
      'headquarter_country' => $node->get('field_headquarter_country')->value,
      'company_link' => $node->get('field_company_link')->uri,
      'at_a_glance' => $node->get('field_at_a_glance')->value,
      'recommendation' => $recommendations_data,
      'solution_text' => $node->get('field_challenge_solution_text')->value,
      'solution_text_image' => $node->get('field_solution_text_image')->target_id ? $this->planetCoreMediaService->getStyledImageUrl($node->get('field_solution_text_image')->target_id, 'large') : NULL,
      'challenge_text' => $node->get('field_challenge_text')->value,
      'result' => $node->get('field_case_study_result')->value,
      'metrics' => $metrics,
      'grow_your_business_settings' => $grow_your_business_settings,
      'link_box' => $link_box_paragraph,
      'tip_box' => $tip_box_paragraph,
      'favourite_features' => $favourite_features,
    ];
  }

  private function getMetricsDataFromParagraph($node) {
    $paragraph_metrics_field = $node->field_metrics->referencedEntities();
    $metrics = [];

    if (!empty($paragraph_metrics_field)) {
      foreach ($paragraph_metrics_field as $key => $metric) {
        $field_metric_value = $metric->field_metric->getValue();
        $field_metric_label_value = $metric->field_metric_label->getValue();

        if (
          !empty($field_metric_value) &&
          !empty($field_metric_value[0]['value']) &&
          !empty($field_metric_label_value) &&
          !empty($field_metric_label_value[0]['value'])
        ) {
          $metrics[$key] = [
            'value' => $field_metric_value[0]['value'],
            'label' => $field_metric_label_value[0]['value'],
          ];
        }
      }
    }

    return $metrics;
  }

  private static function trimFromDoubleQuote(String $string) {
    $string = trim($string,'"');
    $string = trim($string,'“');
    $string = trim($string,'”');
    return trim($string,'');
  }

  public function getCompanySize($node) {
    $company_size_tid = $node->get('field_company_size')->target_id;

    if (!$company_size_tid) {
      return NULL;
    }

    $company_size = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->load($company_size_tid);

    return $company_size->getName();
  }

  /**
   * Get the company size in numbers.
   *
   * For example, it can return "Below 1000" string.
   *
   * @param NodeInterface $node
   *   The node object of the case study.
   *
   * @return string
   *   The company size in numbers.
   */
  public function getCompanySizeInNumbers(NodeInterface $node):? string {
    if (isset($node->get('field_company_size_in_numbers')->view()[0])) {
      return $node->get('field_company_size_in_numbers')->view()[0]['#markup'];
    }

    return NULL;
  }

  /**
   * Prepare case studies data.
   *
   * @param array $case_study_nids
   *   The case study node IDs.
   *
   * @return array
   *   The array containing the data.
   */
  private function prepareCaseStudiesData(array $case_study_nids, ?int $threshold = NULL) {
    $case_studies = $this->entityTypeManager->getStorage('node')->loadMultiple($case_study_nids);

    if ($threshold !== NULL) {
      while (count($case_studies) < 21) {
        $case_studies = array_merge($case_studies, $case_studies);
      }
    }

    $case_studies_data = [];
    $langcode  = $this->planetCoreNodeTranslationsService->determineTheLangId();

    foreach ($case_studies as $case_study) {
      $case_study = $case_study->getTranslation($langcode);
      $translations = $case_study->getTranslationLanguages();

      if (array_key_exists($langcode, $translations)) {
        $alias = $this->pathAliasManager->getAliasByPath("/node/" . $case_study->id(), $langcode);
      }
      else {
        $alias = Node::load($case_study->id())->toUrl()->toString();
        $langcode = 'en';
      }
      $media_id = $case_study->get('field_main_image_media')?->target_id;
      $media_id_logo = $case_study->get('field_logo_media')?->target_id;

      if ($media_id === NULL) {
        $logo_url = NULL;
      }

      $logo_url = $this->planetCoreMediaService->getImageUrl($media_id_logo, 'field_media_image');

      $case_study_data = [
        'title' => $case_study->getTitle(),
        'image_url' => $media_id ? $this->planetCoreMediaService->getStyledImageUrl($media_id, 'large') : NULL,
        'url' =>  $langcode === 'en' ? $alias : "/$langcode" . $alias,
        'logo_url' => $logo_url,
        'company_name' => $case_study->get('field_company_name')->value,
        'landing_page_display_style' => $case_study->get('field_landing_page_display_style')->value ? $case_study->get('field_landing_page_display_style')->value : 'lavender',

      ];

      $case_studies_data[] = $case_study_data;
    }

    return $case_studies_data;
  }

  /**
   * Get the brands details with src to brand's logo and name.
   *
   * @return array
   *   The array containing the data.
   */
  public function getBrandsWeWorkWith(): array {
    return [
      [
        'name' => 'Hyatt',
        'src' => '/resources/logos/Hyatt.png',
      ],
      [
        'name' => 'Calvin Klein',
        'src' => '/resources/logos/calvin-klein.png',
      ],
      [
        'name' => 'Hugo Boss',
        'src' => '/resources/logos/hugo-boss.png',
      ],
      [
        'name' => 'IHG',
        'src' => '/resources/logos/IHG_1.png',
      ],
      [
        'name' => 'Giorgio Armani',
        'src' => '/resources/logos/giorgio-armani.png',
      ],
    ];
  }

}