<?php
namespace Drupal\planet_core\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\node\NodeInterface;
use Drupal\planet_core\Service\PlanetCoreMediaService\PlanetCoreMediaServiceInterface;
use Drupal\planet_core\Service\PlanetCoreNodeTranslationsService\PlanetCoreNodeTranslationsService;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\node\Entity\Node;

class PlanetCoreBasicPageService
{
    protected $entityTypeManager;
    public $planetCoreMediaService;
    protected $languageManager;
    protected $pathAliasManager;
    public $nodeTranslationService;

    public function __construct(
        EntityTypeManagerInterface $entity_type_manager,
        PlanetCoreMediaServiceInterface $planet_core_media_service,
        LanguageManagerInterface $language_manager,
        AliasManagerInterface $path_alias_manager,
        PlanetCoreNodeTranslationsService $nodeTranslationsService
    ) {
        $this->entityTypeManager = $entity_type_manager;
        $this->planetCoreMediaService = $planet_core_media_service;
        $this->languageManager = $language_manager;
        $this->pathAliasManager = $path_alias_manager;
        $this->nodeTranslationService = $nodeTranslationsService;
    }

    public function getPageParagraphData(NodeInterface $node)
    {
        $langcode = $this->languageManager->getCurrentLanguage()->getId();
        $node = $node->hasTranslation($langcode) ? $node->getTranslation($langcode) : $node;

        if ($node->field_product_page_layout) {
          $paragraphs = $node->field_product_page_layout->referencedEntities();
        }
        else if ($node->field_page_paragraphs) {
          $paragraphs = $node->field_page_paragraphs->referencedEntities();
        }

        $paragraph_data = [];

        if (!empty($paragraphs)) {
            foreach ($paragraphs as $paragraph) {
                $paragraph_data[] = $this->extractParagraphData($paragraph, $langcode);
            }
        }

        return $paragraph_data;
    }

    /**
     * Extracts data from a paragraph entity, including translations, media URLs, buttons, and nested paragraphs.
     */


    private function getTheByLanguageFormattedDate(?string $timestamp): ?string
    {
        if (!$timestamp) {
            return NULL;
        }

        $language_code = $this->languageManager->getCurrentLanguage()->getId();

        if ($language_code == "en") {
            return date('F j, Y', $timestamp);
        } else {
            return date('j/m/y', $timestamp);
        }
    }

    private function extractParagraphData($paragraph, $langcode)
    {
        if ($paragraph->hasTranslation($langcode)) {
            $paragraph = $paragraph->getTranslation($langcode);
        }

        $fields = $paragraph->getFields();
        $field_data = [];

        foreach ($fields as $field_name => $field) {
            $field_data[$field_name] = $field->getValue();

            // Process Hero Image
            if ($field_name === 'field_hero_image' && !empty($field_data[$field_name][0]['target_id'])) {
                $media_id = $field_data[$field_name][0]['target_id'];
                $field_data['hero_image_url'] = $this->planetCoreMediaService->getStyledImageUrl($media_id, 'max_1300x1300');
            }

            // Process Hero Form
            if ($field_name === 'field_hero_form' && !$paragraph->get('field_hero_form')->isEmpty()) {
                $webform_id = $paragraph->get('field_hero_form')->target_id;
                $form = \Drupal::entityTypeManager()
                    ->getStorage('webform')
                    ->load($webform_id)
                    ->getSubmissionForm();
                $field_data[$field_name] = $form;
            }

            // Process Testimonial Image
            if ($field_name === 'field_testimonial_image' && !empty($field_data[$field_name][0]['target_id'])) {
                $media_id = $field_data[$field_name][0]['target_id'];
                $field_data['testimonial_image_url'] = $this->planetCoreMediaService->getStyledImageUrl($media_id, 'max_1300x1300');
            }

            // Process Brands Carousel
            if ($field_name === 'field_brands_carousel' && !empty($field_data[$field_name][0]['value'])) {
                $brands = explode(' ', trim($field_data[$field_name][0]['value']));
                $valid_extensions = ['svg', 'png', 'jpeg', 'jpg', 'webp'];

                foreach ($brands as &$brand) {
                    $parsed_url = parse_url($brand);
                    $path_info = pathinfo($parsed_url['path'] ?? '');

                    if (!isset($path_info['extension']) || !in_array(strtolower($path_info['extension']), $valid_extensions)) {
                        $brand = "/resources/logos/default/{$brand}.svg";
                    }
                }

                $field_data[$field_name] = $brands;
            }

            //Process Button Links
            if (in_array($field_name, ['field_button_1_link', 'field_button_2_link', 'field_button_url']) && !empty($field_data[$field_name][0]['uri'])) {
                $uri = $field_data[$field_name][0]['uri'];

                if (strpos($uri, 'entity:node/') === 0) {
                    $node_id = str_replace('entity:node/', '', $uri);
                    $linked_node = $this->entityTypeManager->getStorage('node')->load($node_id);
                    if ($linked_node) {
                        $aliases = $this->nodeTranslationService->buildTranslationArrayForNode($linked_node);
                        $field_data[$field_name][0]['uri'] = $aliases[$langcode] ?? $uri;
                    }
                }
            }

            // Process Selected Case Studies
            if ($field_name === 'field_selected_case_studies' && !$paragraph->get('field_selected_case_studies')->isEmpty()) {

                $case_studies = [];

                foreach ($paragraph->get('field_selected_case_studies')->getValue() as $case_study) {
                    $target_id = $case_study["target_id"];
                    $node = Node::load($target_id);
                    if ($node) {
                        $translated_node = $node->hasTranslation($langcode) ? $node->getTranslation($langcode) : $node;

                        $logo = $translated_node->get('field_logo_media')?->target_id;
                        $logo = $this->planetCoreMediaService->getStyledImageUrl($logo, 'large');

                        $main_image = $translated_node->get('field_main_image_media')?->target_id;
                        $main_image = $this->planetCoreMediaService->getStyledImageUrl($main_image, 'max_1300x1300');

                        $challenge_text = '';
                        if ($translated_node->hasField('field_challenge_text') && !$translated_node->get('field_challenge_text')->isEmpty()) {
                            $full_text = trim($translated_node->get('field_challenge_text')->value);

                            if (strlen($full_text) > 140) {
                                $truncated = substr($full_text, 0, 140);
                                $last_space = strrpos($truncated, ' ');

                                if ($last_space !== false) {
                                    $truncated = substr($truncated, 0, $last_space);
                                }
                                $truncated = rtrim($truncated, ',.');
                                $challenge_text = $truncated . '...';
                            } else {
                                $challenge_text = $full_text;
                            }
                        }

                        $case_studies[] = [
                            'title' => $translated_node->label(),
                            'url' => $translated_node->toUrl()->toString(),
                            'description' => $challenge_text,
                            'company_name' => $translated_node->get('field_company_name')->value,
                            'company_logo' => $logo,
                            'main_image' => $main_image
                        ];
                    }
                }
                $field_data['case_studies'] = $case_studies;
                $case_studies_this_langugage_url = $this->nodeTranslationService->getTranslationArrWithPrefixes('/case-studies');
                $field_data['case_studies_main_page_url'] = $case_studies_this_langugage_url[$langcode];
            }


            /** Selected case studies have priority; we only check if category is set if selected is false */
            if (empty($field_data['case_studies']) && $field_name === 'field_by_company_sector') {
                $case_study_latest = [];

                if (!$paragraph->get('field_by_company_sector')->isEmpty()) {
                    $taxonomy_term_id = $paragraph->get('field_by_company_sector')->target_id;
                }

                $query = $this->entityTypeManager->getStorage('node')->getQuery()
                    ->condition('type', 'case_studies')
                    ->condition('status', 1)
                    ->sort('created', 'DESC')
                    ->range(0, 3)
                    ->accessCheck(FALSE);

                // Apply taxonomy filter only if we have a term ID
                if (!empty($taxonomy_term_id)) {
                    $query->condition('field_company_sector', $taxonomy_term_id);
                }

                $case_study_ids = $query->execute();
                $case_study_nodes = $this->entityTypeManager->getStorage('node')->loadMultiple($case_study_ids);

                foreach ($case_study_nodes as $case_study_node) {
                    $translated_node = $case_study_node->hasTranslation($langcode) ? $case_study_node->getTranslation($langcode) : $case_study_node;

                    $logo = $translated_node->get('field_logo_media')?->target_id;
                    $logo = $this->planetCoreMediaService->getStyledImageUrl($logo, 'large');

                    $main_image = $translated_node->get('field_main_image_media')?->target_id;
                    $main_image = $this->planetCoreMediaService->getStyledImageUrl($main_image, 'max_1300x1300');

                    $challenge_text = '';
                    if ($translated_node->hasField('field_challenge_text') && !$translated_node->get('field_challenge_text')->isEmpty()) {
                        $full_text = trim($translated_node->get('field_challenge_text')->value);

                        if (strlen($full_text) > 140) {
                            $truncated = substr($full_text, 0, 140);
                            $last_space = strrpos($truncated, ' ');

                            if ($last_space !== false) {
                                $truncated = substr($truncated, 0, $last_space);
                            }
                            $truncated = rtrim($truncated, ',.');
                            $challenge_text = $truncated . '...';
                        } else {
                            $challenge_text = $full_text;
                        }
                    }

                    $case_study_latest[] = [
                        'title' => $translated_node->label(),
                        'url' => $translated_node->toUrl()->toString(),
                        'description' => $challenge_text,
                        'company_name' => $translated_node->get('field_company_name')->value,
                        'company_logo' => $logo,
                        'main_image' => $main_image
                    ];
                }

                // Append to the field data
                $field_data['case_studies'] = $case_study_latest;

                $case_studies_this_language_url = $this->nodeTranslationService->getTranslationArrWithPrefixes('/case-studies');
                $field_data['case_studies_main_page_url'] = $case_studies_this_language_url[$langcode];
            }



            if ($field_name === 'field_selected_blog_articles') {

                $blog_articles_ids = [];

                if (!$paragraph->get('field_selected_blog_articles')->isEmpty()) {

                    foreach ($paragraph->get('field_selected_blog_articles')->getValue() as $blog_article) {
                        $target_id = $blog_article["target_id"];
                        $blog_articles_ids[] = $target_id;
                    }
                    $selected_blog_articles = $this->entityTypeManager->getStorage('node')->loadMultiple($blog_articles_ids);
                    $blog_articles_ids = $selected_blog_articles;

                } else if (!$paragraph->get('field_by_tag')->isEmpty()) {
                    /** If tags for blog articles have been chosen */

                    $tags_ids = [];

                    foreach ($paragraph->get('field_by_tag') as $tag) {
                        $tags_ids[] = $tag->target_id;
                    }

                    $query = $this->entityTypeManager->getStorage('node')->getQuery()
                        ->condition('type', 'resources')
                        ->condition('status', 1)
                        ->sort('created', 'DESC')
                        ->range(0, 3)
                        ->accessCheck(FALSE);

                        if (!empty($tags_ids)) {
                            $orGroup = $query->orConditionGroup();
                        
                            foreach ($tags_ids as $tag) {
                                $orGroup->condition('field_resources_tags', $tag);
                            }
                        
                            $query->condition($orGroup);
                        }

                    $blog_articles = $query->execute();
                    $blog_articles_ids = $this->entityTypeManager->getStorage('node')->loadMultiple($blog_articles);


                } else {
                    /** Just get the last 3 */
                    $query = $this->entityTypeManager->getStorage('node')->getQuery()
                    ->condition('type', 'resources')
                    ->condition('status', 1)
                    ->sort('created', 'DESC')
                    ->range(0, 3)
                    ->accessCheck(FALSE);
                    $blog_articles = $query->execute();
                    $blog_articles_ids = $this->entityTypeManager->getStorage('node')->loadMultiple($blog_articles);

                }


                foreach ($blog_articles_ids as $blog_article) {

                    if(!$blog_article) {
                        continue;
                    }
                    $translated_node = $blog_article->hasTranslation($langcode) ? $blog_article->getTranslation($langcode) : $blog_article;
            
                    $image_id = $translated_node->get('field_resources_background_image')?->target_id;
                    $main_image = $this->planetCoreMediaService->getStyledImageUrl($image_id, 'max_1300x1300');
                    $author_id = $blog_article->get('field_author')->target_id;

                    if ($author_id) {
                        $author = Node::load($author_id);

                        if ($author instanceof Node && $author->getType() == 'author') {
                            $author_name = $author->getTitle();
                            $image_id = $author->get('field_profile_picture')?->target_id;
                            $author_image = $this->planetCoreMediaService->getStyledImageUrl($image_id, 'large');
                            $author_url = $author->toUrl()->toString();
                        }
                    }
                    $article_tags = [];
                    $tags_references = $blog_article->get('field_resources_tags')->referencedEntities();

                    foreach ($tags_references as $tag) {
                        if ($tag->hasTranslation($langcode)) {
                            $tag = $tag->getTranslation($langcode);
                        }

                        $tag_name = $tag->getName();
                        $tag_id = $tag->id();

                        $article_tags[] = [
                            'name' => $tag_name,
                            'id' => $tag_id,
                        ];
                    }

                    $custom_timestamp = $blog_article->get('field_resources_published_time')->value;

                    // Convert the custom timestamp to a formatted date.
                    $creation_date = $this->getTheByLanguageFormattedDate($custom_timestamp);


                    $blog_articles_list[] = [
                        'title' => $translated_node->label(),
                        'url' => $translated_node->toUrl()->toString(),
                        'main_image' => $main_image,
                        'tags' => $article_tags,
                        'author_image' => $author_image ?? '',
                        'author_name' => $author_name ?? '',
                        'author_url' => $author_url ?? '',
                        'creation_date' => $creation_date ?? ''
                    ];
                }
                $blog_this_langugage_url = $this->nodeTranslationService->getTranslationArrWithPrefixes('/blog');
                $field_data['blog_main_page_url'] = $blog_this_langugage_url[$langcode];
                $field_data['blog_articles'] = $blog_articles_list ?? [];
            }

            // Process Nested Benefit Boxes
            if ($field_name === 'field_benefit_box' && !$paragraph->get('field_benefit_box')->isEmpty()) {
                $child_paragraphs = $paragraph->get('field_benefit_box')->referencedEntities();
                $child_data = [];

                foreach ($child_paragraphs as $child_paragraph) {
                    $child_data[] = $this->extractParagraphData($child_paragraph, $langcode);
                }

                $field_data['field_benefit_box'] = $child_data;
            }
        }

        return [
            'type' => $paragraph->bundle(),
            'fields' => $field_data,
        ];
    }
}